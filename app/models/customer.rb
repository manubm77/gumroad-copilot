class Customer < ApplicationRecord
  belongs_to :user

  validates :email, presence: true
  validates :email, uniqueness: { scope: :user_id }

  # VIP: top 20% by spending
  scope :vip, ->(user) {
    threshold = user.customers.order(total_spent_cents: :desc)
                    .limit((user.customers.count * 0.2).ceil)
                    .last&.total_spent_cents || 0
    where("total_spent_cents >= ?", threshold).where("total_spent_cents > 0")
  }

  scope :repeat, -> { where("purchase_count > 1") }
  scope :one_time, -> { where(purchase_count: 1) }
  scope :at_risk, -> { where("last_purchase_at < ?", 90.days.ago) }

  def total_spent_dollars
    total_spent_cents / 100.0
  end

  def ltv
    total_spent_dollars
  end

  def segment(user)
    if total_spent_cents >= (user.customers.order(total_spent_cents: :desc)
                                .limit((user.customers.count * 0.2).ceil)
                                .last&.total_spent_cents || Float::INFINITY)
      "vip"
    elsif last_purchase_at && last_purchase_at < 90.days.ago
      "at_risk"
    elsif purchase_count > 1
      "repeat"
    else
      "one_time"
    end
  end
end
