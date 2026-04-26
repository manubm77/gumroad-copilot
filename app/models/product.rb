class Product < ApplicationRecord
  belongs_to :user
  has_many :sales, dependent: :destroy

  validates :gumroad_id, presence: true, uniqueness: true
  validates :name, presence: true

  scope :published, -> { where(published: true) }
  scope :by_revenue, -> { order(revenue_cents: :desc) }
  scope :by_health, -> { order(health_score: :asc) }

  def price_dollars
    price_cents / 100.0
  end

  def revenue_dollars
    revenue_cents / 100.0
  end

  def refund_rate
    return 0.0 if sales_count.zero?
    (refund_count.to_f / sales_count * 100).round(1)
  end

  def conversion_rate
    return 0.0 if views_count.zero?
    (sales_count.to_f / views_count * 100).round(1)
  end

  def calculate_health_score!
    score = 100

    # Refund penalty: -2 points per 1% refund rate
    score -= (refund_rate * 2).to_i

    # Low conversion penalty
    if views_count > 100
      score -= 20 if conversion_rate < 1.0
      score -= 10 if conversion_rate < 2.0
    end

    # Revenue trend bonus
    recent_sales = sales.where("sold_at > ?", 30.days.ago).count
    older_sales = sales.where(sold_at: 60.days.ago..30.days.ago).count
    if older_sales > 0 && recent_sales < older_sales * 0.5
      score -= 15 # declining trend
    elsif recent_sales > older_sales * 1.5
      score += 5 # growing trend
    end

    # Repeat purchase bonus
    repeat_buyers = sales.group(:email).having("COUNT(*) > 1").count.size
    score += [repeat_buyers, 10].min

    update!(health_score: score.clamp(0, 100))
  end

  def health_status
    case health_score
    when 80..100 then "healthy"
    when 50..79  then "warning"
    else "critical"
    end
  end

  def health_issues
    issues = []
    issues << "High refund rate (#{refund_rate}%)" if refund_rate > 10
    issues << "Low conversion rate (#{conversion_rate}%)" if views_count > 100 && conversion_rate < 2
    issues << "Declining sales trend" if sales.where("sold_at > ?", 30.days.ago).count < sales.where(sold_at: 60.days.ago..30.days.ago).count * 0.5
    issues << "No repeat buyers" if sales.group(:email).having("COUNT(*) > 1").count.empty?
    issues
  end
end
