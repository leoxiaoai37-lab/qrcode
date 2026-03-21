import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-brand-border bg-brand-bg-secondary/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-brand-text-muted">
            QR Code Toolbox — 免费在线二维码生成工具
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-brand-text-muted font-mono">
              Built with
              <span className="text-brand-accent mx-1">♦</span>
              React + Vite
            </span>
            <div className="w-1 h-1 rounded-full bg-brand-border" />
            <span className="text-xs text-brand-text-muted">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
