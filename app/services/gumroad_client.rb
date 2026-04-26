class GumroadClient
  BASE_URL = "https://api.gumroad.com/v2/"

  def initialize(access_token)
    @access_token = access_token
    @conn = Faraday.new(url: BASE_URL) do |f|
      f.request :json
      f.response :json
      f.adapter Faraday.default_adapter
    end
  end

  def user_info
    get("user")["user"]
  end

  def products
    get("products")["products"] || []
  end

  def sales(page: 1, after: nil, before: nil)
    params = { page: page }
    params[:after] = after.strftime("%Y-%m-%d") if after
    params[:before] = before.strftime("%Y-%m-%d") if before
    get("sales", params)
  end

  def product(product_id)
    get("products/#{product_id}")["product"]
  end

  private

  def get(path, params = {})
    params[:access_token] = @access_token
    response = @conn.get(path, params)

    unless response.success?
      raise GumroadApiError, "Gumroad API error #{response.status}: #{response.body}"
    end

    response.body
  end
end

class GumroadApiError < StandardError; end
