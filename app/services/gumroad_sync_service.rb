class GumroadSyncService
  def initialize(user)
    @user = user
    @client = GumroadClient.new(user.gumroad_access_token)
  end

  def sync_all!
    sync_products!
    sync_sales!
    rebuild_customers!
    recalculate_health_scores!
  end

  def sync_products!
    remote_products = @client.products

    remote_products.each do |rp|
      product = Product.find_or_initialize_by(gumroad_id: rp["id"])
      product.assign_attributes(
        user: @user,
        name: rp["name"],
        description: rp["description"],
        price_cents: ((rp["price"] || 0).to_f * 100).to_i,
        currency: rp["currency"] || "usd",
        sales_count: rp["sales_count"] || 0,
        revenue_cents: ((rp["revenue"] || 0).to_f * 100).to_i,
        views_count: rp["views_count"] || 0,
        permalink: rp["short_url"],
        published: rp["published"],
        thumbnail_url: rp["thumbnail_url"]
      )
      product.save!
    end
  end

  def sync_sales!
    page = 1
    loop do
      response = @client.sales(page: page)
      sales = response["sales"] || []
      break if sales.empty?

      sales.each do |rs|
        product = Product.find_by(gumroad_id: rs["product_id"])
        next unless product

        sale = Sale.find_or_initialize_by(gumroad_sale_id: rs["id"])
        sale.assign_attributes(
          user: @user,
          product: product,
          email: rs["email"],
          amount_cents: ((rs["price"] || 0).to_f * 100).to_i,
          currency: rs["currency"] || "usd",
          refunded: rs["refunded"] || false,
          sold_at: rs["created_at"]
        )
        sale.save!
      end

      page += 1
      break if page > 100 # safety limit
    end
  end

  def rebuild_customers!
    customer_data = @user.sales.successful
                         .group(:email)
                         .select(
                           "email",
                           "SUM(amount_cents) as total",
                           "COUNT(*) as cnt",
                           "MIN(sold_at) as first_at",
                           "MAX(sold_at) as last_at"
                         )

    customer_data.each do |cd|
      customer = Customer.find_or_initialize_by(user: @user, email: cd.email)
      customer.assign_attributes(
        gumroad_customer_id: "cust_#{Digest::MD5.hexdigest(cd.email)[0..7]}",
        total_spent_cents: cd.total.to_i,
        purchase_count: cd.cnt.to_i,
        first_purchase_at: cd.first_at,
        last_purchase_at: cd.last_at
      )
      customer.save!
    end
  end

  def recalculate_health_scores!
    @user.products.find_each do |product|
      product.refund_count = product.sales.refunded.count
      product.sales_count = product.sales.count
      product.revenue_cents = product.sales.successful.sum(:amount_cents)
      product.save!
      product.calculate_health_score!
    end
  end
end
