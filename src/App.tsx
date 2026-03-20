import React from 'react';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { QRGenerator } from './components/QRGenerator';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <QRGenerator />
      </main>
      <Footer />
    </div>
  );
}

export default App;
