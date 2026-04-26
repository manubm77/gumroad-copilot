class Api::CustomersController < Api::BaseController
  def segments
    user = current_user
    customers = user.customers

    # Calculate segments
    vip_customers = Customer.vip(user).where(user: user)
    repeat_customers = customers.repeat
    one_time_customers = customers.one_time
    at_risk_customers = customers.at_risk

    segments = [
      {
        name: "VIP",
        key: "vip",
        count: vip_customers.count,
        total_ltv: vip_customers.sum(:total_spent_cents) / 100.0,
        avg_ltv: vip_customers.count > 0 ? vip_customers.average(:total_spent_cents).to_f / 100.0 : 0,
        color: "#FF90E8"
      },
      {
        name: "Repeat Buyers",
        key: "repeat",
        count: repeat_customers.count,
        total_ltv: repeat_customers.sum(:total_spent_cents) / 100.0,
        avg_ltv: repeat_customers.count > 0 ? repeat_customers.average(:total_spent_cents).to_f / 100.0 : 0,
        color: "#36D399"
      },
      {
        name: "One-Time Buyers",
        key: "one_time",
        count: one_time_customers.count,
        total_ltv: one_time_customers.sum(:total_spent_cents) / 100.0,
        avg_ltv: one_time_customers.count > 0 ? one_time_customers.average(:total_spent_cents).to_f / 100.0 : 0,
        color: "#FBBD23"
      },
      {
        name: "At Risk",
        key: "at_risk",
        count: at_risk_customers.count,
        total_ltv: at_risk_customers.sum(:total_spent_cents) / 100.0,
        avg_ltv: at_risk_customers.count > 0 ? at_risk_customers.average(:total_spent_cents).to_f / 100.0 : 0,
        color: "#F87272"
      }
    ]

    # Top customers
    top_customers = customers.order(total_spent_cents: :desc).limit(20).map do |c|
      {
        id: c.id,
        email: c.email,
        total_spent: c.total_spent_dollars,
        purchase_count: c.purchase_count,
        first_purchase_at: c.first_purchase_at&.iso8601,
        last_purchase_at: c.last_purchase_at&.iso8601,
        segment: c.segment(user)
      }
    end

    render json: {
      segments: segments,
      total_customers: customers.count,
      top_customers: top_customers
    }
  end
end
