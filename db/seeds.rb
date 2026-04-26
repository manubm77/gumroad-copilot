# Seed data for development
puts "🌱 Seeding Gumroad Copilot..."

user = User.find_or_create_by!(email: "creator@example.com") do |u|
  u.name = "Alex Creator"
  u.gumroad_user_id = "demo_user_001"
end

puts "  ✅ User: #{user.email}"

# Products
products_data = [
  { name: "Ultimate Design System", price_cents: 4900, sales_count: 847, revenue_cents: 4_150_300, refund_count: 12, views_count: 28_400, health_score: 92, permalink: "design-system", description: "Complete design system with 500+ components for Figma" },
  { name: "React Component Library", price_cents: 2900, sales_count: 1_243, revenue_cents: 3_604_700, refund_count: 31, views_count: 45_200, health_score: 85, permalink: "react-components", description: "Production-ready React components with TypeScript" },
  { name: "Freelance Proposal Templates", price_cents: 1900, sales_count: 2_156, revenue_cents: 4_096_400, refund_count: 43, views_count: 72_100, health_score: 78, permalink: "proposal-templates", description: "Win more clients with proven proposal templates" },
  { name: "SaaS Marketing Playbook", price_cents: 3900, sales_count: 534, revenue_cents: 2_082_600, refund_count: 28, views_count: 18_900, health_score: 65, permalink: "saas-playbook", description: "Step-by-step guide to marketing your SaaS product" },
  { name: "Icon Pack Pro", price_cents: 900, sales_count: 3_892, revenue_cents: 3_502_800, refund_count: 195, views_count: 89_300, health_score: 42, permalink: "icon-pack", description: "3000+ pixel-perfect icons in SVG format" },
  { name: "Newsletter Growth Course", price_cents: 7900, sales_count: 189, revenue_cents: 1_493_100, refund_count: 24, views_count: 6_200, health_score: 55, permalink: "newsletter-course", description: "Grow your newsletter to 10K subscribers" },
]

products = products_data.map.with_index do |data, i|
  Product.find_or_create_by!(gumroad_id: "prod_#{i + 1}") do |p|
    p.user = user
    p.assign_attributes(data)
  end
end

puts "  ✅ #{products.size} products created"

# Sales (generate realistic distribution over past 12 months)
sale_count = 0
products.each_with_index do |product, pi|
  num_sales = [product.sales_count, 60].min # Cap for seed speed

  num_sales.times do |i|
    days_ago = rand(0..365)
    sold_at = days_ago.days.ago

    Sale.find_or_create_by!(gumroad_sale_id: "sale_#{pi}_#{i}") do |s|
      s.user = user
      s.product = product
      s.email = "buyer#{rand(1..500)}@example.com"
      s.amount_cents = product.price_cents + rand(-200..500)
      s.currency = "usd"
      s.refunded = i < (num_sales * product.refund_count.to_f / product.sales_count).ceil
      s.sold_at = sold_at
    end
    sale_count += 1
  end
end

puts "  ✅ #{sale_count} sales created"

# Customers (aggregate from sales)
customer_emails = Sale.where(user: user).pluck(:email).uniq
customer_emails.each do |email|
  user_sales = Sale.where(user: user, email: email)

  Customer.find_or_create_by!(user: user, email: email) do |c|
    c.gumroad_customer_id = "cust_#{Digest::MD5.hexdigest(email)[0..7]}"
    c.total_spent_cents = user_sales.successful.sum(:amount_cents)
    c.purchase_count = user_sales.successful.count
    c.first_purchase_at = user_sales.minimum(:sold_at)
    c.last_purchase_at = user_sales.maximum(:sold_at)
  end
end

puts "  ✅ #{customer_emails.size} customers created"
puts "🎉 Seeding complete!"
