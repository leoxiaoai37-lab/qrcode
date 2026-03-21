// src/components/History/index.tsx

import React, { useState, useEffect } from 'react';
import { HistoryItem } from './HistoryItem';
import {
  getHistory,
  clearHistory,
  deleteRecord,
  type HistoryRecord,
} from '../../utils/historyStorage';

interface HistoryPanelProps {
  onRestore: (record: HistoryRecord) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ onRestore }) => {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setRecords(getHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteRecord(id);
    setRecords(getHistory());
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有历史记录吗？')) {
      clearHistory();
      setRecords([]);
    }
  };

  if (records.length === 0) {
    return null;
  }

  return (
    <div className="glass-card rounded-2xl shadow-card mt-8 overflow-hidden animate-fade-in">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="
          w-full px-6 py-4 flex items-center justify-between
          hover:bg-brand-bg-tertiary/30
          transition-colors duration-200
          group
        "
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-accent-muted flex items-center justify-center">
            <svg className="w-4 h-4 text-brand-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-medium text-brand-text-primary">历史记录</span>
          <span className="text-sm text-brand-text-muted bg-brand-bg-tertiary px-2 py-0.5 rounded-md">
            {records.length}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-brand-text-muted transition-transform duration-300 group-hover:text-brand-accent ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="border-t border-brand-border px-6 py-4">
          <div className="grid grid-cols-3 gap-3">
            {records.map((record) => (
              <HistoryItem
                key={record.id}
                record={record}
                onRestore={onRestore}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Clear button */}
          <div className="mt-4 text-center">
            <button
              onClick={handleClearAll}
              className="
                text-sm text-brand-text-muted
                hover:text-red-400
                transition-colors duration-200
                flex items-center gap-1.5 mx-auto
              "
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              清空历史记录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const useHistoryRefresh = () => {
  return () => {};
};
