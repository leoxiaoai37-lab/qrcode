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
      {items.length === 0 && (
        <p className="text-sm text-brand-text-muted text-center py-4">
          暂无数据，请上传 CSV 或手动添加
        </p>
      )}
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-2 items-center group">
          <span className="
            text-xs font-mono text-brand-text-muted
            w-6 h-6 flex items-center justify-center
            bg-brand-bg-tertiary rounded-md
          ">
            {index + 1}
          </span>
          <div className="w-20">
            <Select
              value={item.type}
              onChange={(e) => updateItem(item.id, 'type', e.target.value)}
              options={CONTENT_TYPES}
            />
          </div>
          <input
            type="text"
            value={item.content}
            onChange={(e) => updateItem(item.id, 'content', e.target.value)}
            placeholder="输入内容..."
            className="
              flex-1 px-3 py-2
              bg-white
              border border-brand-border
              rounded-xl
              text-sm text-gray-800
              placeholder:text-gray-400
              transition-all duration-200
              hover:border-brand-border-hover
              focus:outline-none focus:border-brand-accent/50 focus:ring-2 focus:ring-brand-accent/20
            "
          />
          <button
            onClick={() => removeItem(item.id)}
            className="
              p-2 rounded-lg
              text-brand-text-muted
              hover:text-red-400 hover:bg-red-400/10
              transition-all duration-200
              opacity-0 group-hover:opacity-100
            "
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="
          w-full py-3
          border border-dashed border-brand-border
          rounded-xl
          text-sm text-brand-text-muted
          hover:border-brand-accent/50 hover:text-brand-accent hover:bg-brand-accent-muted/20
          transition-all duration-200
          flex items-center justify-center gap-2
        "
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        添加更多
      </button>
    </div>
  );
};
