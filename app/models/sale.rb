class Sale < ApplicationRecord
  belongs_to :user
  belongs_to :product

  validates :gumroad_sale_id, presence: true, uniqueness: true

  scope :recent, -> { order(sold_at: :desc) }
  scope :refunded, -> { where(refunded: true) }
  scope :successful, -> { where(refunded: false) }
  scope :in_period, ->(start_date, end_date) { where(sold_at: start_date..end_date) }
  scope :last_30_days, -> { where("sold_at > ?", 30.days.ago) }
  scope :last_90_days, -> { where("sold_at > ?", 90.days.ago) }

  def amount_dollars
    amount_cents / 100.0
  end
end
