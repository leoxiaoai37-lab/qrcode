// src/components/History/HistoryItem.tsx

import React from 'react';
import { HistoryRecord } from '../../utils/historyStorage';

interface HistoryItemProps {
  record: HistoryRecord;
  onRestore: (record: HistoryRecord) => void;
  onDelete: (id: string) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
  record,
  onRestore,
  onDelete,
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="group relative glass-card-light rounded-xl p-2 hover:border-brand-accent/30 transition-all duration-200">
      {/* 缩略图 */}
      <div className="aspect-square bg-brand-bg-tertiary/50 rounded-lg overflow-hidden mb-2">
        <img
          src={record.previewImage}
          alt="QR Code"
          className="w-full h-full object-contain"
        />
      </div>

      {/* 信息 */}
      <div className="text-[10px] text-brand-text-muted font-mono truncate">
        {formatDate(record.createdAt)}
      </div>

      {/* 操作按钮 - 悬停显示 */}
      <div className="
        absolute top-2 right-2
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        flex gap-1
      ">
        <button
          onClick={() => onRestore(record)}
          className="
            p-1.5 rounded-lg
            bg-brand-accent text-brand-bg-primary
            hover:bg-brand-accent-hover
            transition-colors duration-200
          "
          title="恢复"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(record.id)}
          className="
            p-1.5 rounded-lg
            bg-red-500/80 text-white
            hover:bg-red-500
            transition-colors duration-200
          "
          title="删除"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
