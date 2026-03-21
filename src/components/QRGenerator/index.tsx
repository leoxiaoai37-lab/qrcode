import React, { useState } from 'react';
import { ContentType, QRState, DEFAULT_OPTIONS, QROptions } from '../../types/qr';
import { useQRCode } from '../../hooks/useQRCode';
import { ContentInput } from './ContentInput';
import { StylePanel } from './StylePanel';
import { QRPreview } from './QRPreview';
import { HistoryPanel } from '../History';
import { addRecord, type HistoryRecord } from '../../utils/historyStorage';

export const QRGenerator: React.FC = () => {
  const [state, setState] = useState<QRState>({
    contentType: 'url',
    contentData: {},
    options: DEFAULT_OPTIONS,
  });

  const { ref, qrCode, download } = useQRCode(
    state.contentType,
    state.contentData,
    state.options
  );

  const handleContentTypeChange = (type: ContentType) => {
    setState((prev) => ({
      ...prev,
      contentType: type,
      contentData: {},
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

  const handleRestoreFromHistory = (record: HistoryRecord) => {
    handleContentTypeChange(record.contentType as ContentType);
    handleContentDataChange(record.contentData);
    handleOptionsChange(record.options as unknown as QROptions);
  };

  const handleDownload = async (format: 'png' | 'svg' | 'jpeg', filename: string) => {
    await download(format, filename);

    if (qrCode) {
      const blob = await qrCode.getRawData('png');
      if (blob) {
        const previewImage = await blobToDataURL(blob as Blob);
        addRecord({
          contentType: state.contentType,
          contentData: state.contentData,
          options: state.options as unknown as Record<string, unknown>,
          previewImage,
        });
      }
    }
  };

  const blobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Input area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Content Input */}
          <div className="glass-card p-6 rounded-2xl shadow-card animate-slide-up">
            <h2 className="text-base font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-brand-accent rounded-full" />
              内容
            </h2>
            <ContentInput
              contentType={state.contentType}
              contentData={state.contentData}
              onContentTypeChange={handleContentTypeChange}
              onContentDataChange={handleContentDataChange}
            />
          </div>

          {/* Style Panel */}
          <div className="glass-card p-6 rounded-2xl shadow-card animate-slide-up stagger-2">
            <h2 className="text-base font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-purple-400 rounded-full" />
              样式
            </h2>
            <StylePanel
              options={state.options}
              onOptionsChange={handleOptionsChange}
            />
          </div>
        </div>

        {/* Right: Preview area */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24 h-fit space-y-6">
            {/* Preview */}
            <div className="glass-card p-6 rounded-2xl shadow-card animate-slide-up stagger-3">
              <h2 className="text-base font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-green-400 rounded-full" />
                预览
              </h2>
              <QRPreview
                qrRef={ref as React.RefObject<HTMLDivElement>}
                onDownload={handleDownload}
              />
            </div>

            {/* History */}
            <HistoryPanel onRestore={handleRestoreFromHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};
