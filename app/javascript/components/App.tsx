import React, { useState, useEffect } from 'react';
import type { AuthStatus } from '../types';
import { api } from '../lib/api';
import { Layout } from './Layout';
import { LandingPage } from '../pages/LandingPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CustomersPage } from '../pages/CustomersPage';
import { LaunchAssistantPage } from '../pages/LaunchAssistantPage';
import { RefundDetectorPage } from '../pages/RefundDetectorPage';

type Page = 'landing' | 'dashboard' | 'products' | 'customers' | 'launch' | 'refunds';

export default function App() {
  const [auth, setAuth] = useState<AuthStatus | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAuthStatus().then((status) => {
      setAuth(status);
      if (status.authenticated) {
        // Determine page from URL
        const path = window.location.pathname;
        if (path.startsWith('/dashboard')) setCurrentPage('dashboard');
        else if (path.startsWith('/products')) setCurrentPage('products');
        else if (path.startsWith('/customers')) setCurrentPage('customers');
        else if (path.startsWith('/launch')) setCurrentPage('launch');
        else if (path.startsWith('/refunds')) setCurrentPage('refunds');
        else setCurrentPage('dashboard');
      }
      setLoading(false);
    }).catch(() => {
      setAuth({ authenticated: false });
      setLoading(false);
    });
  }, []);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    const paths: Record<Page, string> = {
      landing: '/',
      dashboard: '/dashboard',
      products: '/products',
      customers: '/customers',
      launch: '/launch',
      refunds: '/refunds',
    };
    window.history.pushState({}, '', paths[page]);
  };

  const handleRealLogin = () => {
    window.location.href = '/auth/gumroad';
  };

  const handleDemoLogin = async () => {
    try {
      const result = await api.demoLogin();
      if (result.success) {
        setAuth({ authenticated: true, user: result.user });
        navigate('dashboard');
      }
    } catch (err) {
      alert("Please run 'rails db:seed' first to enable demo mode.");
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setAuth({ authenticated: false });
    navigate('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#FF90E8] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#9CA3AF] text-sm">Loading Copilot...</p>
        </div>
      </div>
    );
  }

  if (!auth?.authenticated) {
    return <LandingPage onConnect={handleRealLogin} onDemo={handleDemoLogin} />;
  }

  return (
    <Layout
      user={auth.user!}
      currentPage={currentPage}
      onNavigate={navigate}
      onLogout={handleLogout}
    >
      {currentPage === 'dashboard' && <DashboardPage />}
      {currentPage === 'products' && <ProductsPage />}
      {currentPage === 'customers' && <CustomersPage />}
      {currentPage === 'launch' && <LaunchAssistantPage />}
      {currentPage === 'refunds' && <RefundDetectorPage />}
    </Layout>
  );
}
