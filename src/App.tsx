import { useState } from 'react';
import { Header, type TabType } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { QRGenerator } from './components/QRGenerator';
import { BatchGenerator } from './components/BatchGenerator';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('single');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1">
        {activeTab === 'single' ? <QRGenerator /> : <BatchGenerator />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
