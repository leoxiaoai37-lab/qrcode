import React, { useCallback } from 'react';
import { parseCSV, type CSVRow } from '../../utils/csvParser';

interface CSVUploaderProps {
  onUpload: (rows: CSVRow[]) => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onUpload }) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const rows = parseCSV(content);
      onUpload(rows);
    };
    reader.readAsText(file);
  }, [onUpload]);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
        id="csv-upload"
      />
      <label htmlFor="csv-upload" className="cursor-pointer">
        <div className="text-gray-500">
          <span className="text-2xl">📁</span>
          <p className="mt-2">点击上传 CSV 文件</p>
          <p className="text-xs mt-1">或拖拽文件到此处</p>
        </div>
      </label>
    </div>
  );
};
