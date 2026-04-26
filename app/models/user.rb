class User < ApplicationRecord
  encrypts :gumroad_access_token
  encrypts :gumroad_refresh_token

  has_many :products, dependent: :destroy
  has_many :sales, dependent: :destroy
  has_many :customers, dependent: :destroy

  validates :email, presence: true, uniqueness: true

  def display_name
    name.presence || email.split("@").first
  end
end
