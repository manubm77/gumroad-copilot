class Api::DashboardController < Api::BaseController
  def show
    user = current_user

    # Revenue metrics
    total_revenue = user.sales.successful.sum(:amount_cents)
    total_sales = user.sales.successful.count
    total_refunds = user.sales.refunded.count
    refund_rate = total_sales > 0 ? (total_refunds.to_f / (total_sales + total_refunds) * 100).round(1) : 0.0

    # MRR (estimate from last 30 days, annualized / 12)
    last_30_revenue = user.sales.successful.where("sold_at > ?", 30.days.ago).sum(:amount_cents)
    mrr = last_30_revenue

    # Revenue over time (last 12 months, grouped by month)
    revenue_over_time = user.sales.successful
      .where("sold_at > ?", 12.months.ago)
      .group_by_month
      .map { |month, cents| { month: month, revenue: cents / 100.0 } }

    # Top products
    top_products = user.products.by_revenue.limit(5).map do |p|
      {
        id: p.id,
        name: p.name,
        revenue: p.revenue_dollars,
        sales_count: p.sales_count,
        health_score: p.health_score,
        health_status: p.health_status,
        refund_rate: p.refund_rate
      }
    end

    # Recent sales
    recent_sales = user.sales.recent.limit(10).includes(:product).map do |s|
      {
        id: s.id,
        product_name: s.product.name,
        email: s.email,
        amount: s.amount_dollars,
        refunded: s.refunded,
        sold_at: s.sold_at&.iso8601
      }
    end

    # Refund alerts
    refund_alerts = user.products.select { |p| p.refund_rate > 10 }.map do |p|
      { product_id: p.id, product_name: p.name, refund_rate: p.refund_rate }
    end

    render json: {
      total_revenue: total_revenue / 100.0,
      mrr: mrr / 100.0,
      total_sales: total_sales,
      refund_rate: refund_rate,
      revenue_over_time: revenue_over_time,
      top_products: top_products,
      recent_sales: recent_sales,
      refund_alerts: refund_alerts
    }
  end

  private

  # Group sales by month helper
  module SalesGrouping
    def group_by_month
      group("DATE_TRUNC('month', sold_at)")
        .order(Arel.sql("DATE_TRUNC('month', sold_at)"))
        .sum(:amount_cents)
        .transform_keys { |k| k.strftime("%b %Y") }
    end
  end
end

# Extend ActiveRecord relation with grouping
ActiveRecord::Relation.include(Api::DashboardController::SalesGrouping)
