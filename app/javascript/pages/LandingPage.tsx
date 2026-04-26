import React from 'react';

interface LandingPageProps {
  onConnect: () => void;
  onDemo: () => void;
}

export function LandingPage({ onConnect, onDemo }: LandingPageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="float-orb w-[500px] h-[500px] bg-[#FF90E8]/20 top-[-100px] right-[-100px]" style={{ animationDelay: '0s' }} />
      <div className="float-orb w-[400px] h-[400px] bg-[#A855F7]/15 bottom-[-50px] left-[-50px]" style={{ animationDelay: '5s' }} />
      <div className="float-orb w-[300px] h-[300px] bg-[#FF90E8]/10 top-[40%] left-[30%]" style={{ animationDelay: '10s' }} />

      {/* Top nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF90E8] to-[#FF6ADE] flex items-center justify-center text-[#0F0F14] font-bold text-xl">
            G
          </div>
          <span className="text-white font-bold text-lg">Gumroad Copilot</span>
        </div>
        <button onClick={onConnect} className="btn-secondary text-sm">
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-16 md:pt-28 pb-20 text-center">
        <div className="animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#36D399] animate-pulse" />
            <span className="text-sm text-[#9CA3AF]">AI-powered business intelligence</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            <span className="gradient-text">Gumroad Copilot</span>
            <br />
            <span className="text-white/90">Revenue Intelligence</span>
            <br />
            <span className="text-white/70 text-3xl md:text-5xl lg:text-5xl">for Creators</span>
          </h1>

          <p className="text-lg md:text-xl text-[#9CA3AF] max-w-2xl mx-auto mb-4 leading-relaxed">
            You create. <span className="text-[#FF90E8]">Copilot optimizes.</span>
          </p>
          <p className="text-base text-[#6B7280] max-w-xl mx-auto mb-10">
            Connect your Gumroad account and get smarter business decisions —
            AI pricing optimizer, customer segmentation, refund detection, and more.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onConnect} className="btn-primary text-base px-8 py-4 glow-pink">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Connect with Gumroad
            </button>
            <button onClick={onDemo} className="btn-secondary text-sm">
              Try with Demo Data →
            </button>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 stagger-children">
          <FeatureCard
            icon="📊"
            title="Revenue Dashboard"
            description="Total revenue, MRR, sales trends, and product performance at a glance."
          />
          <FeatureCard
            icon="🧠"
            title="AI Pricing Optimizer"
            description="Get data-driven price suggestions that maximize your conversion rate."
          />
          <FeatureCard
            icon="🛡️"
            title="Refund Detector"
            description="Catch refund spikes early with smart alerts and actionable fixes."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 stagger-children">
          <FeatureCard
            icon="👥"
            title="Customer Segments"
            description="Identify your VIPs, repeat buyers, and at-risk customers automatically."
          />
          <FeatureCard
            icon="🚀"
            title="Launch Assistant"
            description="AI-generated titles, landing page copy, and email announcements."
          />
          <FeatureCard
            icon="💡"
            title="Health Scores"
            description="Every product scored 0-100 with clear insights on what needs attention."
          />
        </div>

        {/* Social proof */}
        <div className="mt-20 pt-10 border-t border-white/5">
          <p className="text-[#6B7280] text-sm mb-6">Built for Gumroad creators making $1K – $100K/year</p>
          <div className="flex items-center justify-center gap-8 text-[#4A4A58]">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">6</p>
              <p className="text-xs text-[#6B7280]">AI Features</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">Free</p>
              <p className="text-xs text-[#6B7280]">AI Tier</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">∞</p>
              <p className="text-xs text-[#6B7280]">Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 border-t border-white/5">
        <p className="text-[#4A4A58] text-sm">
          Gumroad Copilot · Built with ❤️ for creators
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="glass-card p-6 text-left">
      <span className="text-2xl mb-3 block">{icon}</span>
      <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
      <p className="text-[#9CA3AF] text-sm leading-relaxed">{description}</p>
    </div>
  );
}
