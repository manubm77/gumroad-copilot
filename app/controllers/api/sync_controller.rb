class Api::SyncController < Api::BaseController
  def create
    if current_user.gumroad_access_token.blank?
      render json: { error: "No Gumroad account connected. Please connect via OAuth first." }, status: :unprocessable_entity
      return
    end

    begin
      GumroadSyncService.new(current_user).sync_all!
      render json: { success: true, message: "Data synced successfully" }
    rescue GumroadApiError => e
      render json: { error: e.message }, status: :bad_gateway
    end
  end
end
