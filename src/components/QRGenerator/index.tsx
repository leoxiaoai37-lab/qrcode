import React, { useState } from 'react';
import { ContentType, QRState, DEFAULT_OPTIONS } from '../../types/qr';
import { useQRCode } from '../../hooks/useQRCode';
import { ContentInput } from './ContentInput';
import { StylePanel } from './StylePanel';
import { QRPreview } from './QRPreview';

export const QRGenerator: React.FC = () => {
  const [state, setState] = useState<QRState>({
    contentType: 'url',
    contentData: {},
    options: DEFAULT_OPTIONS,
  });

  const { ref, download } = useQRCode(
    state.contentType,
    state.contentData,
    state.options
  );

  const handleContentTypeChange = (type: ContentType) => {
    setState((prev) => ({
      ...prev,
      contentType: type,
      contentData: {}, // Clear data when type changes
    }));
  };

  const handleContentDataChange = (data: Record<string, string>) => {
    setState((prev) => ({
      ...prev,
      contentData: data,
    }));
  };

  const handleOptionsChange = (options: typeof DEFAULT_OPTIONS) => {
    setState((prev) => ({
      ...prev,
      options,
    }));
  };

  const handleDownload = async (format: 'png' | 'svg' | 'jpeg', filename: string) => {
    await download(format, filename);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input area */}
        <div className="space-y-6">
          {/* Content Input */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">内容</h2>
            <ContentInput
              contentType={state.contentType}
              contentData={state.contentData}
              onContentTypeChange={handleContentTypeChange}
              onContentDataChange={handleContentDataChange}
            />
          </div>

          {/* Style Panel */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">样式</h2>
            <StylePanel
              options={state.options}
              onOptionsChange={handleOptionsChange}
            />
          </div>
        </div>

        {/* Right: Preview area */}
        <div className="lg:sticky lg:top-8 h-fit">
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">预览</h2>
            <QRPreview
              qrRef={ref as React.RefObject<HTMLDivElement>}
              onDownload={handleDownload}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
