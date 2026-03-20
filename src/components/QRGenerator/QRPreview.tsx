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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div
          ref={qrRef}
          className="flex items-center justify-center min-w-[200px] min-h-[200px]"
        />
      </div>

      {/* Custom filename */}
      <div className="w-full max-w-xs">
        <Input
          label="文件名（可选）"
          value={customFilename}
          onChange={(e) => setCustomFilename(e.target.value)}
          placeholder="自定义文件名"
        />
      </div>

      {/* Download buttons */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm font-medium text-gray-700">下载二维码</p>
        <div className="flex gap-3">
          <Button onClick={() => handleDownload('png')} variant="primary">
            PNG
          </Button>
          <Button onClick={() => handleDownload('svg')} variant="secondary">
            SVG
          </Button>
          <Button onClick={() => handleDownload('jpeg')} variant="secondary">
            JPG
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          PNG - 通用格式 | SVG - 矢量图 | JPG - 小文件
        </p>
      </div>
    </div>
  );
};
