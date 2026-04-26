import React, { useEffect, useState } from 'react';
import type { Product, PricingResult } from '../types';
import { api } from '../lib/api';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);

  useEffect(() => {
    api.getProducts().then((data) => {
      setProducts(data.products);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handlePricingOptimize = async (product: Product) => {
    setSelectedProduct(product);
    setPricingResult(null);
    setPricingLoading(true);
    try {
      const result = await api.getPricingSuggestion(product.id);
      setPricingResult(result);
    } catch (err) {
      console.error('Pricing optimization failed:', err);
    }
    setPricingLoading(false);
  };

  if (loading) return <ProductsSkeleton />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Products</h1>
        <p className="text-[#6B7280] text-sm">Health scores and AI pricing optimizer for your products</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="glass-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-white font-semibold text-base truncate">{product.name}</h3>
                <p className="text-[#6B7280] text-xs mt-1 line-clamp-2">{product.description}</p>
              </div>
              <HealthScoreBadge score={product.health_score} status={product.health_status} />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <MiniStat label="Price" value={`$${product.price}`} />
              <MiniStat label="Sales" value={product.sales_count.toLocaleString()} />
              <MiniStat label="Revenue" value={`$${formatNum(product.revenue)}`} />
              <MiniStat label="Refund" value={`${product.refund_rate}%`} color={product.refund_rate > 10 ? '#F87272' : product.refund_rate > 5 ? '#FBBD23' : '#36D399'} />
            </div>

            {/* Conversion rate bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#6B7280]">Conversion Rate</span>
                <span className="text-xs text-white font-medium">{product.conversion_rate}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF90E8] to-[#FF6ADE] transition-all duration-500"
                  style={{ width: `${Math.min(product.conversion_rate * 10, 100)}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => handlePricingOptimize(product)}
              className="w-full btn-secondary text-xs py-2 flex items-center justify-center gap-2"
            >
              <span>🧠</span>
              <span>AI Pricing Optimizer</span>
            </button>
          </div>
        ))}
      </div>

      {/* Pricing Result Modal */}
      {selectedProduct && (
        <PricingModal
          product={selectedProduct}
          result={pricingResult}
          loading={pricingLoading}
          onClose={() => { setSelectedProduct(null); setPricingResult(null); }}
        />
      )}
    </div>
  );
}

function HealthScoreBadge({ score, status }: { score: number; status: string }) {
  const colors = {
    healthy: { bg: 'rgba(54,211,153,0.1)', border: 'rgba(54,211,153,0.3)', text: '#36D399' },
    warning: { bg: 'rgba(251,189,35,0.1)', border: 'rgba(251,189,35,0.3)', text: '#FBBD23' },
    critical: { bg: 'rgba(248,114,114,0.1)', border: 'rgba(248,114,114,0.3)', text: '#F87272' },
  };
  const c = colors[status as keyof typeof colors] || colors.warning;

  return (
    <div
      className="flex flex-col items-center justify-center w-14 h-14 rounded-xl"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <span className="text-lg font-bold" style={{ color: c.text }}>{score}</span>
      <span className="text-[8px] uppercase tracking-wider" style={{ color: c.text }}>Score</span>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-semibold" style={{ color: color || '#E4E4ED' }}>{value}</p>
    </div>
  );
}

function PricingModal({ product, result, loading, onClose }: {
  product: Product;
  result: PricingResult | null;
  loading: boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto animate-slide-up" style={{ background: 'rgba(22,22,29,0.95)' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">AI Pricing Optimizer</h2>
            <p className="text-sm text-[#6B7280]">{product.name}</p>
          </div>
          <button onClick={onClose} className="text-[#6B7280] hover:text-white text-xl">✕</button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-12 gap-4">
            <div className="w-10 h-10 border-2 border-[#FF90E8] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#9CA3AF]">Analyzing pricing data...</p>
          </div>
        ) : result ? (
          <div className="space-y-5">
            {/* Price comparison */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03]">
              <div className="flex-1 text-center">
                <p className="text-xs text-[#6B7280] mb-1">Current Price</p>
                <p className="text-xl font-bold text-white">${product.price}</p>
              </div>
              <div className="text-2xl text-[#FF90E8]">→</div>
              <div className="flex-1 text-center">
                <p className="text-xs text-[#6B7280] mb-1">Suggested Price</p>
                <p className="text-xl font-bold text-[#36D399]">${result.suggested_price}</p>
              </div>
            </div>

            {/* Projections */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/[0.03]">
                <p className="text-xs text-[#6B7280]">Conversion Change</p>
                <p className="text-base font-semibold text-[#36D399]">{result.projected_conversion_change}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.03]">
                <p className="text-xs text-[#6B7280]">Revenue Change</p>
                <p className="text-base font-semibold text-[#FF90E8]">{result.projected_revenue_change}</p>
              </div>
            </div>

            {/* Reasoning */}
            <div>
              <p className="text-sm text-white font-medium mb-2">💡 Reasoning</p>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">{result.reasoning}</p>
            </div>

            {/* Bundle suggestions */}
            {result.bundle_suggestions && result.bundle_suggestions.length > 0 && (
              <div>
                <p className="text-sm text-white font-medium mb-2">📦 Bundle Opportunities</p>
                <ul className="space-y-2">
                  {result.bundle_suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-[#9CA3AF] flex items-start gap-2">
                      <span className="text-[#FF90E8] mt-0.5">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Confidence */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <span className="text-xs text-[#6B7280]">Confidence:</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                result.confidence === 'high' ? 'bg-[#36D399]/10 text-[#36D399]' :
                result.confidence === 'medium' ? 'bg-[#FBBD23]/10 text-[#FBBD23]' :
                'bg-[#F87272]/10 text-[#F87272]'
              }`}>{result.confidence}</span>
            </div>
          </div>
        ) : (
          <p className="text-[#9CA3AF] text-center py-8">Failed to get pricing suggestion.</p>
        )}
      </div>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <div className="shimmer h-8 w-40 mb-2" />
        <div className="shimmer h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="shimmer h-56 rounded-2xl" />)}
      </div>
    </div>
  );
}

function formatNum(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toFixed(0);
}
