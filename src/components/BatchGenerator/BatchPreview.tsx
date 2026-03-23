import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Button } from '../ui';
import { downloadAsZip, generateBatchFilename } from '../../utils/zipDownload';
import type { BatchItem } from './BatchList';
import type { QROptions } from '../../types/qr';

interface BatchPreviewProps {
  items: BatchItem[];
  options: QROptions;
}

export const BatchPreview: React.FC<BatchPreviewProps> = ({ items, options }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    items.forEach(item => {
      const container = previewRefs.current.get(item.id);
      if (container && item.content) {
        container.innerHTML = '';
        
        let encodedContent = item.content;
        try {
          encodedContent = unescape(encodeURIComponent(item.content));
        } catch (e) {
          console.error('Error encoding batch item content:', e);
        }

        const qr = new QRCodeStyling({
          width: 100,
          height: 100,
          data: encodedContent,
          qrOptions: {
            typeNumber: 0,
            mode: 'Byte',
          },
          dotsOptions: { color: options.dotsColor, type: options.dotsStyle },
          backgroundOptions: { color: options.backgroundColor },
        });
        qr.append(container);
      }
    });
  }, [items, options]);

  const handleDownloadAll = async () => {
    const validItems = items.filter(i => i.content);
    if (validItems.length === 0) return;
    setIsGenerating(true);

    try {
      const images: { name: string; dataUrl: string }[] = [];

      for (let i = 0; i < validItems.length; i++) {
        const item = validItems[i];

        let encodedContent = item.content;
        try {
          encodedContent = unescape(encodeURIComponent(item.content));
        } catch (e) {
          console.error('Error encoding batch download content:', e);
        }

        const qr = new QRCodeStyling({
          width: options.size,
          height: options.size,
          type: 'canvas',
          data: encodedContent,
          qrOptions: {
            typeNumber: 0,
            mode: 'Byte',
            errorCorrectionLevel: options.errorCorrectionLevel,
          },
          dotsOptions: { color: options.dotsColor, type: options.dotsStyle },
          backgroundOptions: { color: options.backgroundColor },
        });

        const blob = await qr.getRawData('png');
        if (blob) {
          const dataUrl = await blobToDataURL(blob as Blob);
          images.push({
            name: generateBatchFilename(i),
            dataUrl,
          });
        }
      }

      await downloadAsZip(images);
    } finally {
      setIsGenerating(false);
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

  const validItems = items.filter(i => i.content);

  return (
    <div className="space-y-4">
      {/* Preview grid */}
      <div className="
        grid grid-cols-3 gap-3 max-h-80 overflow-y-auto
        pr-1
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-brand-bg-elevated
        [&::-webkit-scrollbar-thumb]:rounded-full
      ">
        {validItems.length === 0 && (
          <div className="col-span-3 py-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-brand-bg-tertiary flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-brand-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <p className="text-sm text-brand-text-muted">
              添加内容后预览二维码
            </p>
          </div>
        )}
        {validItems.map(item => (
          <div
            key={item.id}
            ref={el => { if (el) previewRefs.current.set(item.id, el); }}
            className="
              aspect-square glass-card-light
              rounded-xl flex items-center justify-center
              transition-all duration-200
              hover:border-brand-accent/30
            "
          />
        ))}
      </div>

      {/* Download button */}
      <Button
        onClick={handleDownloadAll}
        disabled={validItems.length === 0 || isGenerating}
        className="w-full"
        size="lg"
      >
        <span className="flex items-center justify-center gap-2">
          {isGenerating ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              生成中...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              下载全部 ({validItems.length})
            </>
          )}
        </span>
      </Button>

      {/* Info */}
      <p className="text-xs text-brand-text-muted text-center">
        下载为 ZIP 压缩包，包含所有二维码 PNG 图片
      </p>
    </div>
  );
};
