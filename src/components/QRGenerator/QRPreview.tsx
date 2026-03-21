import React, { useState } from 'react';
import { Button, Input } from '../ui';
import { generateFileName } from '../../utils/download';

interface QRPreviewProps {
  qrRef: React.RefObject<HTMLDivElement>;
  onDownload: (format: 'png' | 'svg' | 'jpeg', filename: string) => void;
}

export const QRPreview: React.FC<QRPreviewProps> = ({ qrRef, onDownload }) => {
  const [customFilename, setCustomFilename] = useState('');

  const handleDownload = (format: 'png' | 'svg' | 'jpeg') => {
    const filename = customFilename || generateFileName();
    onDownload(format, filename);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* QR Code Preview */}
      <div className="relative group">
        {/* Glow effect behind QR */}
        <div className="absolute inset-0 bg-brand-accent/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* QR container */}
        <div className="relative glass-card p-6 rounded-2xl shadow-card">
          <div
            ref={qrRef}
            className="qr-container flex items-center justify-center min-w-[200px] min-h-[200px]"
          />
        </div>
      </div>

      {/* Custom filename */}
      <div className="w-full max-w-xs">
        <Input
          label="文件名（可选）"
          value={customFilename}
          onChange={(e) => setCustomFilename(e.target.value)}
          placeholder="qrcode_20240101"
        />
      </div>

      {/* Download buttons */}
      <div className="flex flex-col items-center gap-4 w-full">
        <p className="text-sm font-medium text-brand-text-secondary">下载二维码</p>
        <div className="flex gap-3">
          <Button onClick={() => handleDownload('png')} variant="primary">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              PNG
            </span>
          </Button>
          <Button onClick={() => handleDownload('svg')} variant="secondary">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              SVG
            </span>
          </Button>
          <Button onClick={() => handleDownload('jpeg')} variant="secondary">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              JPG
            </span>
          </Button>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-brand-text-muted">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
            PNG - 通用格式
          </span>
          <span className="w-px h-3 bg-brand-border" />
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            SVG - 矢量图
          </span>
          <span className="w-px h-3 bg-brand-border" />
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            JPG - 小文件
          </span>
        </div>
      </div>
    </div>
  );
};
