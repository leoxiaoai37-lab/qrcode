import React, { useState } from 'react';
import { CSVUploader } from './CSVUploader';
import { BatchList, type BatchItem } from './BatchList';
import { BatchPreview } from './BatchPreview';
import { StylePanel } from '../QRGenerator/StylePanel';
import { DEFAULT_OPTIONS, type QROptions } from '../../types/qr';
import type { CSVRow } from '../../utils/csvParser';

export const BatchGenerator: React.FC = () => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [options, setOptions] = useState<QROptions>(DEFAULT_OPTIONS);

  const handleCSVUpload = (rows: CSVRow[]) => {
    const newItems: BatchItem[] = rows.map(row => ({
      id: crypto.randomUUID(),
      type: (row.type === 'text' ? 'text' : 'url') as 'url' | 'text',
      content: row.content,
    }));
    setItems(newItems);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Input area */}
        <div className="lg:col-span-3 space-y-6">
          {/* CSV Upload */}
          <div className="glass-card p-6 rounded-2xl shadow-card animate-slide-up">
            <h2 className="text-base font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-accent rounded-full" />
              CSV 上传
            </h2>
            <CSVUploader onUpload={handleCSVUpload} />
            <p className="text-xs text-brand-text-muted mt-3 font-mono">
              CSV 格式: type,content (type 为 url 或 text)
            </p>
          </div>

          {/* Batch List */}
          <div className="glass-card p-6 rounded-2xl shadow-card animate-slide-up stagger-2">
            <h2 className="text-base font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-orange-400 rounded-full" />
              批量列表
            </h2>
            <BatchList items={items} onChange={setItems} />
          </div>

          {/* Style Panel */}
          <div className="glass-card p-6 rounded-2xl shadow-card animate-slide-up stagger-3">
            <h2 className="text-base font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-purple-400 rounded-full" />
              样式
            </h2>
            <StylePanel options={options} onOptionsChange={setOptions} />
          </div>
        </div>

        {/* Right: Preview area */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="glass-card p-6 rounded-2xl shadow-card animate-slide-up stagger-4">
              <h2 className="text-base font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-green-400 rounded-full" />
                批量预览
              </h2>
              <BatchPreview items={items} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CSVUploader } from './CSVUploader';
export { BatchList, type BatchItem } from './BatchList';
export { BatchPreview } from './BatchPreview';
