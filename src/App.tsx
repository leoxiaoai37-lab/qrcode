import { useState } from 'react';
import { Header, type TabType } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { QRGenerator } from './components/QRGenerator';
import { BatchGenerator } from './components/BatchGenerator';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('single');

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'var(--gradient-mesh)' }} />

      {/* Noise overlay for texture */}
      <div className="noise-overlay" />

      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 relative z-10">
        {activeTab === 'single' ? <QRGenerator /> : <BatchGenerator />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
