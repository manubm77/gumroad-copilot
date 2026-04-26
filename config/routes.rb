Rails.application.routes.draw do
  # Health check
  get "up" => "rails/health#show", as: :rails_health_check

  # Gumroad OAuth
  get  "auth/gumroad",          to: "auth#gumroad"
  get  "auth/callback",          to: "auth#callback"
  delete "auth/logout",         to: "auth#logout"
  post "auth/demo",             to: "auth#demo"

  # JSON API
  namespace :api do
    get "auth/me",             to: "auth#me"
    get "dashboard",           to: "dashboard#show"
    resources :products, only: [:index, :show]
    get "customers/segments",  to: "customers#segments"
    post "sync",               to: "sync#create"

    # AI endpoints
    post "ai/pricing",         to: "ai#pricing"
    post "ai/launch",          to: "ai#launch"
    post "ai/refund_analysis", to: "ai#refund_analysis"
  end

  # SPA catch-all (must be last)
  root "pages#index"
  get "*path", to: "pages#index", constraints: ->(req) {
    !req.path.start_with?("/rails/") && !req.path.start_with?("/assets/")
  }
end
