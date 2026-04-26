import React, { useEffect, useState } from 'react';
import type { Product, RefundAnalysis } from '../types';
import { api } from '../lib/api';

export function RefundDetectorPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysisMap, setAnalysisMap] = useState<Record<number, RefundAnalysis>>({});
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);

  useEffect(() => {
    api.getProducts().then((data) => {
      setProducts(data.products.sort((a, b) => b.refund_rate - a.refund_rate));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const analyze = async (productId: number) => {
    setAnalyzingId(productId);
    try {
      const result = await api.getRefundAnalysis(productId);
      setAnalysisMap(prev => ({ ...prev, [productId]: result }));
    } catch (err) { console.error(err); }
    setAnalyzingId(null);
  };

  if (loading) return <div className="shimmer h-96 rounded-2xl" />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">🛡️ Refund Detector</h1>
        <p className="text-[#6B7280] text-sm">Monitor refund rates and get AI-powered fix suggestions</p>
      </div>

      <div className="space-y-4">
        {products.map((product) => {
          const isAlert = product.refund_rate > 10;
          const analysis = analysisMap[product.id];
          return (
            <div key={product.id} className={`glass-card p-5 ${isAlert ? 'border-[#F87272]/30' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {isAlert && <span className="text-lg animate-pulse">🔴</span>}
                  <div>
                    <h3 className="text-white font-semibold">{product.name}</h3>
                    <p className="text-xs text-[#6B7280]">{product.sales_count} sales · {product.refund_count} refunds</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`text-right px-3 py-1.5 rounded-lg ${isAlert ? 'bg-[#F87272]/10' : product.refund_rate > 5 ? 'bg-[#FBBD23]/10' : 'bg-[#36D399]/10'}`}>
                    <p className={`text-lg font-bold ${isAlert ? 'text-[#F87272]' : product.refund_rate > 5 ? 'text-[#FBBD23]' : 'text-[#36D399]'}`}>{product.refund_rate}%</p>
                    <p className="text-[8px] uppercase tracking-wider text-[#6B7280]">Refund Rate</p>
                  </div>
                  <button onClick={() => analyze(product.id)} disabled={analyzingId === product.id} className="btn-secondary text-xs py-2 px-3">
                    {analyzingId === product.id ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                    ) : '🧠 Analyze'}
                  </button>
                </div>
              </div>

              {/* Refund rate bar */}
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1">
                <div className={`h-full rounded-full transition-all duration-500 ${isAlert ? 'bg-[#F87272]' : product.refund_rate > 5 ? 'bg-[#FBBD23]' : 'bg-[#36D399]'}`} style={{ width: `${Math.min(product.refund_rate * 5, 100)}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-[#4A4A58]"><span>0%</span><span className="text-[#F87272]">10% threshold</span><span>20%</span></div>

              {/* Analysis results */}
              {analysis && (
                <div className="mt-4 pt-4 border-t border-white/5 animate-slide-up space-y-3">
                  <div className={`p-3 rounded-lg ${analysis.severity === 'critical' ? 'bg-[#F87272]/10' : analysis.severity === 'warning' ? 'bg-[#FBBD23]/10' : 'bg-[#36D399]/10'}`}>
                    <p className="text-sm text-white">{analysis.summary}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white mb-2">Likely Causes</p>
                    {analysis.likely_causes.map((c, i) => <p key={i} className="text-xs text-[#9CA3AF] flex items-start gap-2 mb-1"><span className="text-[#F87272]">•</span>{c}</p>)}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white mb-2">Recommended Fixes</p>
                    {analysis.recommended_fixes.map((f, i) => <p key={i} className="text-xs text-[#9CA3AF] flex items-start gap-2 mb-1"><span className="text-[#36D399]">✓</span>{f}</p>)}
                  </div>
                  {analysis.quick_wins.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-white mb-2">⚡ Quick Wins</p>
                      {analysis.quick_wins.map((q, i) => <p key={i} className="text-xs text-[#9CA3AF] flex items-start gap-2 mb-1"><span className="text-[#FF90E8]">→</span>{q}</p>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
