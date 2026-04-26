import React, { useEffect, useState } from 'react';
import type { CustomersData, CustomerSegment, Customer } from '../types';
import { api } from '../lib/api';

export function CustomersPage() {
  const [data, setData] = useState<CustomersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSegment, setActiveSegment] = useState<string>('all');

  useEffect(() => {
    api.getCustomerSegments().then((d) => {
      setData(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <CustomersSkeleton />;
  if (!data) return <p className="text-[#9CA3AF]">Failed to load customer data.</p>;

  const filteredCustomers = activeSegment === 'all'
    ? data.top_customers
    : data.top_customers.filter(c => c.segment === activeSegment);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Customers</h1>
        <p className="text-[#6B7280] text-sm">
          {data.total_customers} total customers segmented by behavior
        </p>
      </div>

      {/* Segment cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        {data.segments.map((seg) => (
          <SegmentCard
            key={seg.key}
            segment={seg}
            active={activeSegment === seg.key}
            onClick={() => setActiveSegment(activeSegment === seg.key ? 'all' : seg.key)}
          />
        ))}
      </div>

      {/* Segment distribution bar */}
      <div className="glass-card p-5 mb-6">
        <h2 className="text-sm font-medium text-white mb-3">Segment Distribution</h2>
        <div className="flex h-3 rounded-full overflow-hidden bg-white/5">
          {data.segments.map((seg) => {
            const pct = data.total_customers > 0 ? (seg.count / data.total_customers) * 100 : 0;
            return (
              <div
                key={seg.key}
                className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                style={{ width: `${pct}%`, backgroundColor: seg.color }}
                title={`${seg.name}: ${seg.count} (${pct.toFixed(1)}%)`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-4 mt-3">
          {data.segments.map((seg) => (
            <div key={seg.key} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="text-xs text-[#9CA3AF]">{seg.name} ({seg.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer list */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-white">
            {activeSegment === 'all' ? 'Top Customers' : data.segments.find(s => s.key === activeSegment)?.name}
          </h2>
          <span className="text-xs text-[#6B7280]">{filteredCustomers.length} customers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#6B7280] text-xs uppercase tracking-wider border-b border-white/5">
                <th className="text-left py-3 px-2">Email</th>
                <th className="text-right py-3 px-2">LTV</th>
                <th className="text-right py-3 px-2">Purchases</th>
                <th className="text-right py-3 px-2">Segment</th>
                <th className="text-right py-3 px-2">Last Purchase</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-2 text-white">{customer.email}</td>
                  <td className="py-3 px-2 text-right font-medium text-[#36D399]">${customer.total_spent.toFixed(2)}</td>
                  <td className="py-3 px-2 text-right text-[#9CA3AF]">{customer.purchase_count}</td>
                  <td className="py-3 px-2 text-right">
                    <SegmentBadge segment={customer.segment} />
                  </td>
                  <td className="py-3 px-2 text-right text-[#6B7280] text-xs">
                    {customer.last_purchase_at ? new Date(customer.last_purchase_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[#6B7280]">No customers in this segment</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SegmentCard({ segment, active, onClick }: { segment: CustomerSegment; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`glass-card p-4 text-left transition-all duration-200 w-full ${
        active ? 'ring-1' : ''
      }`}
      style={active ? { borderColor: segment.color, boxShadow: `0 0 20px ${segment.color}20` } : {}}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
        <span className="text-xs text-[#9CA3AF] font-medium">{segment.name}</span>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{segment.count}</p>
      <p className="text-xs text-[#6B7280]">Avg LTV: ${segment.avg_ltv.toFixed(2)}</p>
    </button>
  );
}

function SegmentBadge({ segment }: { segment: string }) {
  const config: Record<string, { label: string; color: string }> = {
    vip: { label: 'VIP', color: '#FF90E8' },
    repeat: { label: 'Repeat', color: '#36D399' },
    one_time: { label: 'One-time', color: '#FBBD23' },
    at_risk: { label: 'At Risk', color: '#F87272' },
  };
  const c = config[segment] || { label: segment, color: '#6B7280' };

  return (
    <span
      className="inline-flex text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: `${c.color}15`, color: c.color }}
    >
      {c.label}
    </span>
  );
}

function CustomersSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <div className="shimmer h-8 w-40 mb-2" />
        <div className="shimmer h-4 w-64" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map(i => <div key={i} className="shimmer h-28 rounded-2xl" />)}
      </div>
      <div className="shimmer h-64 rounded-2xl" />
    </div>
  );
}
