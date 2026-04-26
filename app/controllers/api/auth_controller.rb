class Api::AuthController < Api::BaseController
  skip_before_action :authenticate_user!, only: [:me]

  def me
    if current_user
      render json: {
        authenticated: true,
        user: {
          id: current_user.id,
          name: current_user.display_name,
          email: current_user.email,
          avatar_url: current_user.avatar_url,
          has_gumroad: current_user.gumroad_access_token.present?
        }
      }
    else
      render json: { authenticated: false }
    end
  end
end
