import type { AuthStatus, DashboardData, CustomersData, Product, PricingResult, LaunchResult, RefundAnalysis } from '../types';

const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': CSRF_TOKEN,
      ...options.headers,
    },
    credentials: 'same-origin',
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  getAuthStatus: () => request<AuthStatus>('/api/auth/me'),
  demoLogin: () => request<{ success: boolean; user: AuthStatus['user'] }>('/auth/demo', { method: 'POST' }),
  logout: () => request<void>('/auth/logout', { method: 'DELETE' }),

  // Dashboard
  getDashboard: () => request<DashboardData>('/api/dashboard'),

  // Products
  getProducts: () => request<{ products: Product[] }>('/api/products'),
  getProduct: (id: number) => request<{ product: Product; monthly_revenue: { month: string; revenue: number }[]; health_issues: string[] }>(`/api/products/${id}`),

  // Customers
  getCustomerSegments: () => request<CustomersData>('/api/customers/segments'),

  // AI
  getPricingSuggestion: (productId: number) => request<PricingResult>('/api/ai/pricing', {
    method: 'POST',
    body: JSON.stringify({ product_id: productId }),
  }),
  getLaunchAssistant: (data: { name: string; description: string; category: string }) => request<LaunchResult>('/api/ai/launch', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getRefundAnalysis: (productId: number) => request<RefundAnalysis>('/api/ai/refund_analysis', {
    method: 'POST',
    body: JSON.stringify({ product_id: productId }),
  }),

  // Sync
  syncData: () => request<{ success: boolean; message: string }>('/api/sync', { method: 'POST' }),
};
