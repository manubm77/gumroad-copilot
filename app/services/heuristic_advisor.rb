class HeuristicAdvisor
  # Zero-dependency fallback when no AI API key is configured.
  # Uses statistical heuristics to provide reasonable suggestions.

  def optimize_pricing(product_data)
    price = product_data[:current_price].to_f
    refund_rate = product_data[:refund_rate].to_f
    conversion_rate = product_data[:conversion_rate].to_f
    revenue = product_data[:revenue].to_f

    # Pricing heuristic: if refund rate is high, price may be too high
    # If conversion rate is low, price may be too high
    suggested = price
    reasoning_parts = []

    if refund_rate > 10
      suggested = (price * 0.85).round(0)
      reasoning_parts << "High refund rate (#{refund_rate}%) suggests the product may not meet expectations at the current price"
    elsif refund_rate > 5 && conversion_rate < 2
      suggested = (price * 0.90).round(0)
      reasoning_parts << "Moderate refund rate with low conversion suggests a slight price reduction could help"
    elsif conversion_rate > 5 && refund_rate < 3
      suggested = (price * 1.15).round(0)
      reasoning_parts << "Strong conversion with low refunds indicates room for a price increase"
    else
      reasoning_parts << "Current pricing appears well-calibrated for your market"
    end

    conv_change = conversion_rate > 0 ? ((suggested - price) / price * -15).round(0) : 0
    rev_change = ((suggested * (1 + conv_change / 100.0)) / price * 100 - 100).round(0)

    {
      "suggested_price" => suggested,
      "reasoning" => reasoning_parts.join(". ") + ".",
      "projected_conversion_change" => "#{conv_change >= 0 ? '+' : ''}#{conv_change}%",
      "projected_revenue_change" => "#{rev_change >= 0 ? '+' : ''}#{rev_change}%",
      "bundle_suggestions" => generate_bundle_suggestions(product_data[:name]),
      "confidence" => refund_rate > 8 || conversion_rate < 1 ? "high" : "medium"
    }
  end

  def launch_assistant(product_info)
    name = product_info[:name] || "Your Product"
    description = product_info[:description] || ""
    category = product_info[:category] || "digital product"

    {
      "title_options" => [
        "#{name}: The Complete Guide",
        "Master #{name} — Everything You Need",
        "#{name} Pro: Level Up Your #{category.capitalize}"
      ],
      "landing_page_copy" => generate_landing_copy(name, description, category),
      "email_announcement" => generate_email(name, description),
      "suggested_price" => suggest_price_for_category(category),
      "price_reasoning" => "Based on typical #{category} pricing in the Gumroad marketplace, this price balances accessibility with perceived value.",
      "upsell_ideas" => [
        "Premium tier with 1-on-1 support or consultation",
        "Bundle with complementary #{category} resources",
        "Lifetime updates package at a higher price point"
      ],
      "launch_checklist" => [
        "Create a compelling product thumbnail (1280x720)",
        "Write 3 social media posts for launch day",
        "Email your existing audience 48 hours before launch",
        "Set up a limited-time launch discount (20% off first 48h)",
        "Prepare 2-3 testimonials or case studies",
        "Schedule follow-up email 7 days post-launch"
      ]
    }
  end

  def analyze_refunds(refund_data)
    rate = refund_data[:refund_rate].to_f
    price = refund_data[:price].to_f

    severity = if rate > 15
                 "critical"
               elsif rate > 8
                 "warning"
               else
                 "normal"
               end

    causes = []
    fixes = []
    quick_wins = []

    if rate > 10
      causes << "Product may not match customer expectations set by the sales page"
      causes << "Price point could be higher than perceived value"
      fixes << "Revise your product description to set clearer expectations"
      fixes << "Add a detailed table of contents or feature list to the sales page"
      fixes << "Consider adding a preview or free sample"
      quick_wins << "Add a FAQ section addressing common concerns"
      quick_wins << "Include a satisfaction guarantee with specific terms"
    elsif rate > 5
      causes << "Some buyers may be impulse purchasing without understanding the product"
      causes << "Product formatting or delivery might have issues"
      fixes << "Add more social proof (testimonials, reviews)"
      fixes << "Ensure the product delivers immediately and clearly"
      quick_wins << "Send a welcome email with getting-started tips"
      quick_wins << "Add a short video walkthrough of the product"
    else
      causes << "Refund rate is within healthy range for digital products"
      fixes << "Continue monitoring — no immediate action needed"
      quick_wins << "Consider collecting feedback from refund requesters"
    end

    {
      "severity" => severity,
      "likely_causes" => causes,
      "recommended_fixes" => fixes,
      "quick_wins" => quick_wins,
      "summary" => "Your product '#{refund_data[:name]}' has a #{rate}% refund rate. #{severity == 'critical' ? 'This needs immediate attention.' : severity == 'warning' ? 'This is worth investigating.' : 'This is within normal range.'}"
    }
  end

  private

  def generate_bundle_suggestions(product_name)
    [
      "Create a #{product_name} + Templates bundle at 20% discount",
      "Offer a #{product_name} Pro edition with bonus content"
    ]
  end

  def suggest_price_for_category(category)
    case category.downcase
    when /course/, /tutorial/ then 49
    when /template/, /kit/ then 29
    when /ebook/, /guide/ then 19
    when /software/, /tool/, /plugin/ then 39
    when /design/, /ui/ then 35
    else 29
    end
  end

  def generate_landing_copy(name, description, category)
    <<~COPY
      Introducing #{name} — your shortcut to mastering #{category}.

      #{description.presence || "Whether you're just starting out or looking to level up, this #{category} gives you everything you need to succeed."}

      Built from real-world experience and designed for immediate impact. Stop struggling with #{category} — start creating with confidence.

      Join hundreds of creators who've already transformed their workflow. Get instant access today.
    COPY
  end

  def generate_email(name, description)
    <<~EMAIL
      Hey there! 👋

      I just launched something I've been working on for months — #{name}.

      #{description.presence || "It's packed with actionable insights and ready-to-use resources."} I built this because I wished it existed when I was getting started.

      For the first 48 hours, I'm offering an exclusive launch discount. Grab it now before the price goes up!
    EMAIL
  end
end
