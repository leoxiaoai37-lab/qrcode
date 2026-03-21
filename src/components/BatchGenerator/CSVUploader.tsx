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
    <div className="
      relative border-2 border-dashed border-brand-border
      rounded-xl p-8 text-center
      hover:border-brand-accent/50 hover:bg-brand-accent-muted/20
      transition-all duration-300
      group cursor-pointer
    ">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
        id="csv-upload"
      />
      <label htmlFor="csv-upload" className="cursor-pointer block">
        <div className="flex flex-col items-center gap-3">
          <div className="
            w-14 h-14 rounded-xl bg-brand-bg-tertiary
            flex items-center justify-center
            group-hover:bg-brand-accent-muted group-hover:scale-110
            transition-all duration-300
          ">
            <svg className="w-7 h-7 text-brand-text-muted group-hover:text-brand-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-brand-text-primary group-hover:text-brand-accent transition-colors">
              点击上传 CSV 文件
            </p>
            <p className="text-xs text-brand-text-muted mt-1">
              或拖拽文件到此处
            </p>
          </div>
        </div>
      </label>
    </div>
  );
};
