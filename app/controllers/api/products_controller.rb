class Api::ProductsController < Api::BaseController
  def index
    products = current_user.products.by_revenue.map do |p|
      product_json(p)
    end

    render json: { products: products }
  end

  def show
    product = current_user.products.find(params[:id])

    # Monthly revenue for this product
    monthly_revenue = product.sales.successful
      .where("sold_at > ?", 6.months.ago)
      .group("DATE_TRUNC('month', sold_at)")
      .order(Arel.sql("DATE_TRUNC('month', sold_at)"))
      .sum(:amount_cents)
      .map { |month, cents| { month: month.strftime("%b %Y"), revenue: cents / 100.0 } }

    render json: {
      product: product_json(product),
      monthly_revenue: monthly_revenue,
      health_issues: product.health_issues
    }
  end

  private

  def product_json(p)
    {
      id: p.id,
      gumroad_id: p.gumroad_id,
      name: p.name,
      description: p.description,
      price: p.price_dollars,
      price_cents: p.price_cents,
      sales_count: p.sales_count,
      revenue: p.revenue_dollars,
      revenue_cents: p.revenue_cents,
      refund_count: p.refund_count,
      refund_rate: p.refund_rate,
      views_count: p.views_count,
      conversion_rate: p.conversion_rate,
      health_score: p.health_score,
      health_status: p.health_status,
      permalink: p.permalink,
      published: p.published
    }
  end
end
