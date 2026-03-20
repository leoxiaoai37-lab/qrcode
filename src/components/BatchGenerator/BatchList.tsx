import React from 'react';
import { Select } from '../ui';

export interface BatchItem {
  id: string;
  type: 'url' | 'text';
  content: string;
}

interface BatchListProps {
  items: BatchItem[];
  onChange: (items: BatchItem[]) => void;
}

const CONTENT_TYPES = [
  { value: 'url', label: '网址' },
  { value: 'text', label: '文本' },
];

export const BatchList: React.FC<BatchListProps> = ({ items, onChange }) => {
  const addItem = () => {
    onChange([...items, { id: crypto.randomUUID(), type: 'url', content: '' }]);
  };

  const updateItem = (id: string, field: 'type' | 'content', value: string) => {
    onChange(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-2 items-center">
          <span className="text-sm text-gray-400 w-6">{index + 1}</span>
          <Select
            value={item.type}
            onChange={(e) => updateItem(item.id, 'type', e.target.value)}
            options={CONTENT_TYPES}
            className="w-24"
          />
          <input
            type="text"
            value={item.content}
            onChange={(e) => updateItem(item.id, 'content', e.target.value)}
            placeholder="输入内容"
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => removeItem(item.id)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
      >
        + 添加更多
      </button>
    </div>
  );
};
