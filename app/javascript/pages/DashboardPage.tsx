import React, { useEffect, useState } from 'react';
import type { DashboardData } from '../types';
import { api } from '../lib/api';

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard().then((d) => {
      setData(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (!data) return <p className="text-[#9CA3AF]">Failed to load dashboard data.</p>;

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-[#6B7280] text-sm">Your revenue intelligence at a glance</p>
      </div>

      {/* Refund alerts */}
      {data.refund_alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {data.refund_alerts.map((alert) => (
            <div key={alert.product_id} className="flex items-center gap-3 bg-[#F87272]/10 border border-[#F87272]/20 rounded-xl px-4 py-3">
              <span className="text-lg">⚠️</span>
              <p className="text-sm text-[#F87272]">
                <span className="font-semibold">{alert.product_name}</span> has a {alert.refund_rate}% refund rate — above the 10% threshold
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <StatCard
          label="Total Revenue"
          value={`$${formatNumber(data.total_revenue)}`}
          icon="💰"
          accent="#36D399"
        />
        <StatCard
          label="Monthly Revenue"
          value={`$${formatNumber(data.mrr)}`}
          icon="📈"
          accent="#FF90E8"
        />
        <StatCard
          label="Total Sales"
          value={formatNumber(data.total_sales)}
          icon="🛒"
          accent="#60A5FA"
        />
        <StatCard
          label="Refund Rate"
          value={`${data.refund_rate}%`}
          icon="🔄"
          accent={data.refund_rate > 10 ? '#F87272' : data.refund_rate > 5 ? '#FBBD23' : '#36D399'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-white font-semibold text-base mb-4">Revenue Over Time</h2>
          <RevenueChart data={data.revenue_over_time} />
        </div>

        {/* Top products */}
        <div className="glass-card p-6">
          <h2 className="text-white font-semibold text-base mb-4">Top Products</h2>
          <div className="space-y-3">
            {data.top_products.map((product, i) => (
              <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <span className="text-[#6B7280] text-xs font-mono w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate font-medium">{product.name}</p>
                  <p className="text-xs text-[#6B7280]">{product.sales_count} sales</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#36D399]">${formatNumber(product.revenue)}</p>
                  <HealthBadge score={product.health_score} status={product.health_status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent sales */}
      <div className="glass-card p-6 mt-6">
        <h2 className="text-white font-semibold text-base mb-4">Recent Sales</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#6B7280] text-xs uppercase tracking-wider border-b border-white/5">
                <th className="text-left py-3 px-2">Product</th>
                <th className="text-left py-3 px-2">Customer</th>
                <th className="text-right py-3 px-2">Amount</th>
                <th className="text-right py-3 px-2">Status</th>
                <th className="text-right py-3 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_sales.map((sale) => (
                <tr key={sale.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-2 text-white font-medium">{sale.product_name}</td>
                  <td className="py-3 px-2 text-[#9CA3AF]">{sale.email}</td>
                  <td className="py-3 px-2 text-right text-white">${sale.amount.toFixed(2)}</td>
                  <td className="py-3 px-2 text-right">
                    {sale.refunded ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#F87272]/10 text-[#F87272]">Refunded</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#36D399]/10 text-[#36D399]">Completed</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right text-[#6B7280] text-xs">
                    {sale.sold_at ? new Date(sale.sold_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, accent }: { label: string; value: string; icon: string; accent: string }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-[#6B7280] uppercase tracking-wider">{label}</p>
    </div>
  );
}

function HealthBadge({ score, status }: { score: number; status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full health-${status}`}>
      {score}
    </span>
  );
}

function RevenueChart({ data }: { data: { month: string; revenue: number }[] }) {
  if (data.length === 0) return <p className="text-[#6B7280] text-sm">No revenue data yet.</p>;

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  const chartHeight = 200;

  return (
    <div>
      <div className="flex items-end gap-1 h-[200px]">
        {data.map((d, i) => {
          const height = (d.revenue / maxRevenue) * chartHeight;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end group relative">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#1E1E28] border border-white/10 rounded-lg px-3 py-2 text-xs whitespace-nowrap z-10">
                <p className="text-white font-medium">${formatNumber(d.revenue)}</p>
                <p className="text-[#6B7280]">{d.month}</p>
              </div>
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-[#FF90E8]/60 to-[#FF90E8] transition-all duration-300 hover:from-[#FF90E8]/80 hover:to-[#FFB8F0] min-h-[4px]"
                style={{ height: `${Math.max(height, 4)}px` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-1 mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <p className="text-[10px] text-[#4A4A58] truncate">{d.month.split(' ')[0]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <div className="shimmer h-8 w-48 mb-2" />
        <div className="shimmer h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => <div key={i} className="shimmer h-28 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 shimmer h-72 rounded-2xl" />
        <div className="shimmer h-72 rounded-2xl" />
      </div>
    </div>
  );
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toFixed(n % 1 === 0 ? 0 : 2);
}
