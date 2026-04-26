import React, { useState } from 'react';
import type { LaunchResult } from '../types';
import { api } from '../lib/api';

export function LaunchAssistantPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [result, setResult] = useState<LaunchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'titles' | 'copy' | 'email' | 'pricing' | 'checklist'>('titles');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await api.getLaunchAssistant({ name, description, category });
      setResult(data);
      setActiveTab('titles');
    } catch (err) {
      console.error('Launch assistant failed:', err);
    }
    setLoading(false);
  };

  const categories = ['E-book', 'Course', 'Template', 'Software', 'Design Kit', 'Plugin', 'Music', 'Art', 'Other'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">🚀 Launch Assistant</h1>
        <p className="text-[#6B7280] text-sm">AI-powered launch strategy for your next product</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4">Product Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1.5 uppercase tracking-wider">Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Ultimate Design System"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#4A4A58] focus:outline-none focus:border-[#FF90E8]/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1.5 uppercase tracking-wider">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What does your product do? Who is it for?"
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#4A4A58] focus:outline-none focus:border-[#FF90E8]/50 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1.5 uppercase tracking-wider">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                        category === cat
                          ? 'bg-[#FF90E8]/20 text-[#FF90E8] border border-[#FF90E8]/30'
                          : 'bg-white/5 text-[#9CA3AF] border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0F0F14] border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>🧠 Generate Launch Strategy</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="glass-card p-12 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-2 border-[#FF90E8] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#9CA3AF] text-sm">Crafting your launch strategy...</p>
              <p className="text-[#4A4A58] text-xs">This takes a few seconds</p>
            </div>
          ) : result ? (
            <div className="glass-card overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-white/5 overflow-x-auto">
                {[
                  { key: 'titles', label: '✨ Titles' },
                  { key: 'copy', label: '📄 Landing Copy' },
                  { key: 'email', label: '📧 Email' },
                  { key: 'pricing', label: '💰 Pricing' },
                  { key: 'checklist', label: '✅ Checklist' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.key
                        ? 'text-[#FF90E8] border-b-2 border-[#FF90E8]'
                        : 'text-[#6B7280] hover:text-[#9CA3AF]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'titles' && (
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold mb-4">Product Title Options</h3>
                    {result.title_options.map((title, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[#FF90E8]/20 transition-all group">
                        <span className="text-lg text-[#FF90E8] font-bold">{i + 1}</span>
                        <p className="text-white flex-1">{title}</p>
                        <button
                          onClick={() => navigator.clipboard.writeText(title)}
                          className="text-xs text-[#6B7280] hover:text-[#FF90E8] opacity-0 group-hover:opacity-100 transition-all"
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'copy' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Landing Page Copy</h3>
                      <button
                        onClick={() => navigator.clipboard.writeText(result.landing_page_copy)}
                        className="text-xs text-[#6B7280] hover:text-[#FF90E8] transition-colors"
                      >
                        Copy All
                      </button>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                      <p className="text-[#9CA3AF] text-sm leading-relaxed whitespace-pre-wrap">{result.landing_page_copy}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'email' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Email Announcement</h3>
                      <button
                        onClick={() => navigator.clipboard.writeText(result.email_announcement)}
                        className="text-xs text-[#6B7280] hover:text-[#FF90E8] transition-colors"
                      >
                        Copy All
                      </button>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                      <p className="text-[#9CA3AF] text-sm leading-relaxed whitespace-pre-wrap">{result.email_announcement}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'pricing' && (
                  <div className="space-y-4">
                    <h3 className="text-white font-semibold">Pricing Strategy</h3>
                    <div className="p-4 rounded-xl bg-[#FF90E8]/5 border border-[#FF90E8]/10">
                      <p className="text-3xl font-bold text-[#FF90E8] mb-2">${result.suggested_price}</p>
                      <p className="text-sm text-[#9CA3AF]">{result.price_reasoning}</p>
                    </div>

                    <div>
                      <h4 className="text-sm text-white font-medium mb-3">Upsell Ideas</h4>
                      <ul className="space-y-2">
                        {result.upsell_ideas.map((idea, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[#9CA3AF]">
                            <span className="text-[#FF90E8] mt-0.5">💎</span>
                            {idea}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'checklist' && (
                  <div>
                    <h3 className="text-white font-semibold mb-4">Launch Checklist</h3>
                    <div className="space-y-2">
                      {result.launch_checklist.map((item, i) => (
                        <label key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group">
                          <input type="checkbox" className="mt-1 accent-[#FF90E8]" />
                          <span className="text-sm text-[#9CA3AF] group-hover:text-white transition-colors">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
              <span className="text-5xl mb-4">🚀</span>
              <h3 className="text-white font-semibold mb-2">Ready to launch?</h3>
              <p className="text-[#6B7280] text-sm max-w-sm">
                Enter your product details and get AI-generated titles, copy, email templates, pricing, and a launch checklist.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
