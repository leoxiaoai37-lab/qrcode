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
    // Generate preview for each item
    items.forEach(item => {
      const container = previewRefs.current.get(item.id);
      if (container && item.content) {
        container.innerHTML = '';
        const qr = new QRCodeStyling({
          width: 100,
          height: 100,
          data: item.content,
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

        const qr = new QRCodeStyling({
          width: options.size,
          height: options.size,
          type: 'canvas',
          data: item.content,
          dotsOptions: { color: options.dotsColor, type: options.dotsStyle },
          backgroundOptions: { color: options.backgroundColor },
        });

        // Get raw data as blob and convert to data URL
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

  // Helper function to convert Blob to Data URL
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
      <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto">
        {validItems.map(item => (
          <div
            key={item.id}
            ref={el => { if (el) previewRefs.current.set(item.id, el); }}
            className="aspect-square bg-white border rounded flex items-center justify-center"
          />
        ))}
      </div>

      <Button
        onClick={handleDownloadAll}
        disabled={validItems.length === 0 || isGenerating}
        className="w-full"
      >
        {isGenerating ? '生成中...' : `下载全部 (${validItems.length})`}
      </Button>
    </div>
  );
};
