import React, { useState } from 'react';
import type { User } from '../types';

type Page = 'dashboard' | 'products' | 'customers' | 'launch' | 'refunds';

interface LayoutProps {
  user: User;
  currentPage: Page | string;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS: { key: Page; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
  { key: 'products', label: 'Products', icon: '📦' },
  { key: 'customers', label: 'Customers', icon: '👥' },
  { key: 'launch', label: 'Launch Assistant', icon: '🚀' },
  { key: 'refunds', label: 'Refund Detector', icon: '🛡️' },
];

export function Layout({ user, currentPage, onNavigate, onLogout, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#16161D] border-r border-white/5
        flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF90E8] to-[#FF6ADE] flex items-center justify-center text-[#0F0F14] font-bold text-lg">
              G
            </div>
            <div>
              <h1 className="text-white font-bold text-base leading-tight">Gumroad Copilot</h1>
              <p className="text-[#6B7280] text-xs">Revenue Intelligence</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => { onNavigate(item.key); setSidebarOpen(false); }}
              className={`nav-link w-full text-left ${currentPage === item.key ? 'active' : ''}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF90E8]/30 to-[#FF6ADE]/30 flex items-center justify-center text-sm">
              {user.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-[#6B7280] truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full text-left text-xs text-[#6B7280] hover:text-[#F87272] transition-colors py-1"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#0F0F14]/90 backdrop-blur-lg border-b border-white/5 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-[#9CA3AF] hover:text-white"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF90E8] to-[#FF6ADE] flex items-center justify-center text-[#0F0F14] font-bold text-xs">
                G
              </div>
              <span className="text-sm font-semibold text-white">Copilot</span>
            </div>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-slide-up">
          {children}
        </div>
      </main>
    </div>
  );
}
