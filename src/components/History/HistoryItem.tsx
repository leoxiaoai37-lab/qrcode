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
    <div className="group relative bg-white rounded-lg border border-gray-200 p-2 hover:shadow-md transition-shadow">
      {/* 缩略图 */}
      <div className="aspect-square bg-gray-50 rounded overflow-hidden mb-2">
        <img
          src={record.previewImage}
          alt="QR Code"
          className="w-full h-full object-contain"
        />
      </div>

      {/* 信息 */}
      <div className="text-xs text-gray-500 truncate">
        {formatDate(record.createdAt)}
      </div>

      {/* 操作按钮 - 悬停显示 */}
      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={() => onRestore(record)}
          className="p-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          title="恢复"
        >
          ↺
        </button>
        <button
          onClick={() => onDelete(record.id)}
          className="p-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
          title="删除"
        >
          ×
        </button>
      </div>
    </div>
  );
};
