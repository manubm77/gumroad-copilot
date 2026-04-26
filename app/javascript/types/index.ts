export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  has_gumroad: boolean;
}

export interface AuthStatus {
  authenticated: boolean;
  user?: User;
}

export interface Product {
  id: number;
  gumroad_id: string;
  name: string;
  description: string;
  price: number;
  price_cents: number;
  sales_count: number;
  revenue: number;
  revenue_cents: number;
  refund_count: number;
  refund_rate: number;
  views_count: number;
  conversion_rate: number;
  health_score: number;
  health_status: 'healthy' | 'warning' | 'critical';
  permalink: string;
  published: boolean;
}

export interface Sale {
  id: number;
  product_name: string;
  email: string;
  amount: number;
  refunded: boolean;
  sold_at: string;
}

export interface DashboardData {
  total_revenue: number;
  mrr: number;
  total_sales: number;
  refund_rate: number;
  revenue_over_time: { month: string; revenue: number }[];
  top_products: Product[];
  recent_sales: Sale[];
  refund_alerts: { product_id: number; product_name: string; refund_rate: number }[];
}

export interface CustomerSegment {
  name: string;
  key: string;
  count: number;
  total_ltv: number;
  avg_ltv: number;
  color: string;
}

export interface Customer {
  id: number;
  email: string;
  total_spent: number;
  purchase_count: number;
  first_purchase_at: string;
  last_purchase_at: string;
  segment: string;
}

export interface CustomersData {
  segments: CustomerSegment[];
  total_customers: number;
  top_customers: Customer[];
}

export interface PricingResult {
  suggested_price: number;
  reasoning: string;
  projected_conversion_change: string;
  projected_revenue_change: string;
  bundle_suggestions: string[];
  confidence: string;
}

export interface LaunchResult {
  title_options: string[];
  landing_page_copy: string;
  email_announcement: string;
  suggested_price: number;
  price_reasoning: string;
  upsell_ideas: string[];
  launch_checklist: string[];
}

export interface RefundAnalysis {
  severity: 'critical' | 'warning' | 'normal';
  likely_causes: string[];
  recommended_fixes: string[];
  quick_wins: string[];
  summary: string;
}
