class AuthController < ApplicationController
  skip_forgery_protection only: [:callback]

  # GET /auth/gumroad — redirect to Gumroad OAuth
  def gumroad
    params = {
      client_id: Rails.application.config.gumroad.client_id,
      redirect_uri: Rails.application.config.gumroad.redirect_uri,
      scope: "view_sales view_profile",
      response_type: "code"
    }
    redirect_to "https://gumroad.com/oauth/authorize?#{params.to_query}", allow_other_host: true
  end

  # GET /auth/callback — exchange code for token
  def callback
    code = params[:code]
    Rails.logger.info "[Auth] Callback received with code: #{code.present?}"

    if code.blank?
      Rails.logger.error "[Auth] No code provided by Gumroad"
      redirect_to root_path, alert: "Authorization failed: No code provided"
      return
    end

    # Exchange code for access token
    conn = Faraday.new(url: "https://api.gumroad.com")
    response = conn.post("/oauth/token", {
      code: code,
      client_id: Rails.application.config.gumroad.client_id,
      client_secret: Rails.application.config.gumroad.client_secret,
      redirect_uri: Rails.application.config.gumroad.redirect_uri,
      grant_type: "authorization_code"
    })

    token_data = JSON.parse(response.body) rescue {}
    Rails.logger.info "[Auth] Token response success: #{response.success?}"

    unless response.success? && token_data["access_token"]
      Rails.logger.error "[Auth] Token exchange failed: #{response.body}"
      redirect_to root_path, alert: "Failed to get access token"
      return
    end

    access_token = token_data["access_token"]
    refresh_token = token_data["refresh_token"]

    # Fetch user info from Gumroad
    client = GumroadClient.new(access_token)
    gumroad_user = begin
      client.user_info
    rescue => e
      Rails.logger.error "[Auth] User info fetch error: #{e.message}"
      nil
    end

    unless gumroad_user && gumroad_user["user_id"]
      Rails.logger.error "[Auth] Invalid user info: #{gumroad_user.inspect}"
      redirect_to root_path, alert: "Could not fetch Gumroad user profile"
      return
    end

    # Create or update user
    user = User.find_or_initialize_by(gumroad_user_id: gumroad_user["user_id"])
    user.assign_attributes(
      email: gumroad_user["email"],
      name: gumroad_user["name"],
      avatar_url: gumroad_user["profile_url"],
      gumroad_access_token: access_token,
      gumroad_refresh_token: refresh_token
    )
    user.save!
    Rails.logger.info "[Auth] User saved: #{user.email}, ID: #{user.id}"

    # Set session
    session[:user_id] = user.id
    Rails.logger.info "[Auth] Session ID set: #{session[:user_id]}"

    # Sync data in background so redirect is instant
    Thread.new {
      begin
        GumroadSyncService.new(user).sync_all!
      rescue => e
        Rails.logger.error "[Sync] Background sync error: #{e.message}"
      end
    }

    redirect_to "/dashboard"
  end

  # DELETE /auth/logout
  def logout
    session.delete(:user_id)
    render json: { success: true }
  end

  # POST /auth/demo — log in with demo/seed user
  def demo
    user = User.find_by(email: "creator@example.com")
    if user
      session[:user_id] = user.id
      render json: { success: true, user: { id: user.id, name: user.display_name, email: user.email } }
    else
      render json: { success: false, error: "Run rails db:seed first" }, status: :not_found
    end
  end
end
