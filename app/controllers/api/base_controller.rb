class Api::BaseController < ApplicationController
  skip_forgery_protection
  before_action :authenticate_user!

  private

  def authenticate_user!
    unless current_user
      render json: { error: "Not authenticated" }, status: :unauthorized
    end
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end
end
