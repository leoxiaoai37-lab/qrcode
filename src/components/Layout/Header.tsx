import React from 'react';

export type TabType = 'single' | 'batch';

interface HeaderProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab = 'single', onTabChange }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg-secondary/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent to-purple-500 flex items-center justify-center shadow-glow transition-all duration-300 group-hover:shadow-[0_0_25px_-5px_rgba(34,211,238,0.5)]">
              {/* QR Code Icon */}
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="3" height="3" />
                <rect x="18" y="14" width="3" height="3" />
                <rect x="14" y="18" width="3" height="3" />
                <rect x="18" y="18" width="3" height="3" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight text-brand-text-primary">
                QR Toolbox
              </h1>
              <span className="text-[10px] text-brand-text-muted font-mono tracking-wider uppercase">
                Generator
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          {onTabChange && (
            <nav className="flex items-center p-1 rounded-xl bg-brand-bg-tertiary/50 border border-brand-border">
              <button
                onClick={() => onTabChange('single')}
                className={`
                  relative px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300
                  ${activeTab === 'single'
                    ? 'text-brand-bg-primary'
                    : 'text-brand-text-secondary hover:text-brand-text-primary'
                  }
                `}
              >
                {activeTab === 'single' && (
                  <span className="absolute inset-0 rounded-lg bg-brand-accent animate-scale-in" />
                )}
                <span className="relative flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                  单个生成
                </span>
              </button>
              <button
                onClick={() => onTabChange('batch')}
                className={`
                  relative px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300
                  ${activeTab === 'batch'
                    ? 'text-brand-bg-primary'
                    : 'text-brand-text-secondary hover:text-brand-text-primary'
                  }
                `}
              >
                {activeTab === 'batch' && (
                  <span className="absolute inset-0 rounded-lg bg-brand-accent animate-scale-in" />
                )}
                <span className="relative flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="5" height="5" rx="1" />
                    <rect x="9.5" y="2" width="5" height="5" rx="1" />
                    <rect x="17" y="2" width="5" height="5" rx="1" />
                    <rect x="2" y="9.5" width="5" height="5" rx="1" />
                    <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
                    <rect x="17" y="9.5" width="5" height="5" rx="1" />
                    <rect x="2" y="17" width="5" height="5" rx="1" />
                    <rect x="9.5" y="17" width="5" height="5" rx="1" />
                    <rect x="17" y="17" width="5" height="5" rx="1" />
                  </svg>
                  批量生成
                </span>
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};
