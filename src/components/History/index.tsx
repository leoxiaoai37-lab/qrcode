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

  // Load history on mount
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
    return null; // 无历史记录时不显示
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📚</span>
          <span className="font-medium text-gray-900">历史记录</span>
          <span className="text-sm text-gray-500">({records.length})</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
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
              className="text-sm text-red-500 hover:text-red-600"
            >
              清空历史记录
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Export refresh function for external use
export const useHistoryRefresh = () => {
  return () => {
    // This will be called after generating a QR code
    // The parent component should handle this
  };
};
