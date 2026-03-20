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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input area */}
        <div className="space-y-6">
          {/* CSV Upload */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">CSV 上传</h2>
            <CSVUploader onUpload={handleCSVUpload} />
            <p className="text-xs text-gray-400 mt-2">
              CSV 格式: type,content (type 为 url 或 text)
            </p>
          </div>

          {/* Batch List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">批量列表</h2>
            <BatchList items={items} onChange={setItems} />
          </div>

          {/* Style Panel */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">样式</h2>
            <StylePanel options={options} onOptionsChange={setOptions} />
          </div>
        </div>

        {/* Right: Preview area */}
        <div className="lg:sticky lg:top-8 h-fit">
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">批量预览</h2>
            <BatchPreview items={items} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { CSVUploader } from './CSVUploader';
export { BatchList, type BatchItem } from './BatchList';
export { BatchPreview } from './BatchPreview';
