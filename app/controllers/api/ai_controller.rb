class Api::AiController < Api::BaseController
  # POST /api/ai/pricing
  def pricing
    product = current_user.products.find(params[:product_id])

    product_data = {
      name: product.name,
      current_price: product.price_dollars,
      sales_count: product.sales_count,
      revenue: product.revenue_dollars,
      refund_rate: product.refund_rate,
      conversion_rate: product.conversion_rate,
      views_count: product.views_count
    }

    result = ai_service.optimize_pricing(product_data)
    render json: result
  end

  # POST /api/ai/launch
  def launch
    product_info = {
      name: params[:name],
      description: params[:description],
      category: params[:category]
    }

    result = ai_service.launch_assistant(product_info)
    render json: result
  end

  # POST /api/ai/refund_analysis
  def refund_analysis
    product = current_user.products.find(params[:product_id])

    refund_data = {
      name: product.name,
      price: product.price_dollars,
      refund_rate: product.refund_rate,
      refund_count: product.refund_count,
      sales_count: product.sales_count,
      recent_refunds: product.sales.refunded.recent.limit(10).map { |s|
        { email: s.email, amount: s.amount_dollars, sold_at: s.sold_at&.iso8601 }
      }
    }

    result = ai_service.analyze_refunds(refund_data)
    render json: result
  end

  private

  def ai_service
    if ENV["GEMINI_API_KEY"].present?
      GeminiService.new
    else
      HeuristicAdvisor.new
    end
  end
end
