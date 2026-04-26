class GeminiService
  BASE_URL = "https://generativelanguage.googleapis.com/v1beta"
  MODEL = "gemini-flash-latest"

  def initialize
    @api_key = ENV.fetch("GEMINI_API_KEY")
    @conn = Faraday.new(url: BASE_URL) do |f|
      f.request :json
      f.response :json
      f.options.timeout = 30
    end
  end

  def optimize_pricing(product_data)
    prompt = <<~PROMPT
      You are an expert pricing strategist for digital products on Gumroad.
      Analyze this product and suggest an optimal price.

      Product: #{product_data[:name]}
      Current Price: $#{product_data[:current_price]}
      Total Sales: #{product_data[:sales_count]}
      Total Revenue: $#{product_data[:revenue]}
      Refund Rate: #{product_data[:refund_rate]}%
      Conversion Rate: #{product_data[:conversion_rate]}%
      Total Views: #{product_data[:views_count]}

      Respond in JSON format:
      {
        "suggested_price": <number>,
        "reasoning": "<2-3 sentence explanation>",
        "projected_conversion_change": "<e.g. +18%>",
        "projected_revenue_change": "<e.g. +12%>",
        "bundle_suggestions": ["<suggestion 1>", "<suggestion 2>"],
        "confidence": "<high/medium/low>"
      }
    PROMPT

    response = generate(prompt)
    parse_json_response(response)
  end

  def launch_assistant(product_info)
    prompt = <<~PROMPT
      You are a product launch strategist for Gumroad creators.
      Help this creator launch their product successfully.

      Product Name: #{product_info[:name]}
      Description: #{product_info[:description]}
      Category: #{product_info[:category]}

      Respond in JSON format:
      {
        "title_options": ["<title 1>", "<title 2>", "<title 3>"],
        "landing_page_copy": "<compelling 3-4 paragraph landing page copy>",
        "email_announcement": "<email announcement text, 2-3 paragraphs>",
        "suggested_price": <number>,
        "price_reasoning": "<brief reasoning>",
        "upsell_ideas": ["<idea 1>", "<idea 2>", "<idea 3>"],
        "launch_checklist": ["<step 1>", "<step 2>", "<step 3>", "<step 4>"]
      }
    PROMPT

    response = generate(prompt)
    parse_json_response(response)
  end

  def analyze_refunds(refund_data)
    prompt = <<~PROMPT
      You are an e-commerce analyst specializing in refund reduction for digital products.
      Analyze this product's refund data and provide actionable insights.

      Product: #{refund_data[:name]}
      Price: $#{refund_data[:price]}
      Refund Rate: #{refund_data[:refund_rate]}%
      Refund Count: #{refund_data[:refund_count]}
      Total Sales: #{refund_data[:sales_count]}

      Recent refunds:
      #{refund_data[:recent_refunds].map { |r| "- $#{r[:amount]} on #{r[:sold_at]}" }.join("\n")}

      Respond in JSON format:
      {
        "severity": "<critical/warning/normal>",
        "likely_causes": ["<cause 1>", "<cause 2>"],
        "recommended_fixes": ["<fix 1>", "<fix 2>", "<fix 3>"],
        "quick_wins": ["<quick win 1>", "<quick win 2>"],
        "summary": "<2-3 sentence summary>"
      }
    PROMPT

    response = generate(prompt)
    parse_json_response(response)
  end

  private

  def generate(prompt)
    response = @conn.post(
      "models/#{MODEL}:generateContent?key=#{@api_key}",
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: "application/json"
        }
      }
    )

    unless response.success?
      raise "Gemini API error #{response.status}: #{response.body}"
    end

    body = response.body
    body.dig("candidates", 0, "content", "parts", 0, "text") || "{}"
  end

  def parse_json_response(text)
    # Clean markdown code fences if present
    cleaned = text.gsub(/```json\n?/, "").gsub(/```\n?/, "").strip
    JSON.parse(cleaned)
  rescue JSON::ParserError
    { error: "Failed to parse AI response", raw: text }
  end
end
