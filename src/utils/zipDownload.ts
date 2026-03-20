// src/utils/zipDownload.ts

import JSZip from 'jszip';
import { downloadFile } from './download';

interface ZipImage {
  name: string;
  dataUrl: string;
}

export const downloadAsZip = async (images: ZipImage[], filename: string = 'qrcodes_batch.zip'): Promise<void> => {
  const zip = new JSZip();

  for (const img of images) {
    // Extract base64 data from data URL
    const base64 = img.dataUrl.split(',')[1];
    zip.file(`${img.name}.png`, base64, { base64: true });
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  downloadFile(blob, filename);
};

export const generateBatchFilename = (index: number, prefix: string = 'qrcode'): string => {
  return `${prefix}_${String(index + 1).padStart(3, '0')}`;
};
