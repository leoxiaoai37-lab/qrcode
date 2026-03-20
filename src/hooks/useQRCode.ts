// src/hooks/useQRCode.ts

import { useEffect, useRef, useState, useCallback } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { QROptions, ContentType } from '../types/qr';
import {
  formatText,
  formatUrl,
  formatEmail,
  formatPhone,
  formatSMS,
  formatWiFi,
  formatVCard,
  formatEvent,
  formatGeo,
  formatApp,
} from '../utils/qrFormatters';

const formatContent = (type: ContentType, data: Record<string, string>): string => {
  switch (type) {
    case 'text':
      return formatText(data.text || '');
    case 'url':
      return formatUrl(data.url || '');
    case 'email':
      return formatEmail({
        email: data.email || '',
        subject: data.subject || '',
        body: data.body || '',
      });
    case 'phone':
      return formatPhone(data.phone || '');
    case 'sms':
      return formatSMS({
        phone: data.phone || '',
        message: data.message || '',
      });
    case 'wifi':
      return formatWiFi({
        ssid: data.ssid || '',
        password: data.password || '',
        encryption: (data.encryption as 'WPA' | 'WEP' | 'nopass') || 'WPA',
      });
    case 'vcard':
      return formatVCard({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        email: data.email || '',
        company: data.company || '',
        title: data.title || '',
        address: data.address || '',
        website: data.website || '',
      });
    case 'event':
      return formatEvent({
        title: data.title || '',
        location: data.location || '',
        startTime: data.startTime || '',
        endTime: data.endTime || '',
        description: data.description || '',
      });
    case 'geo':
      return formatGeo({
        lat: data.lat || '',
        lon: data.lon || '',
      });
    case 'app':
      return formatApp({
        iosUrl: data.iosUrl || '',
        androidUrl: data.androidUrl || '',
      });
    default:
      return '';
  }
};

export const useQRCode = (
  contentType: ContentType,
  contentData: Record<string, string>,
  options: QROptions
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);

  // Initialize QR code instance
  useEffect(() => {
    const qr = new QRCodeStyling({
      width: options.size,
      height: options.size,
      type: 'svg',
      data: 'https://example.com',
      dotsOptions: {
        color: options.dotsColor,
        type: options.dotsStyle,
      },
      backgroundOptions: {
        color: options.backgroundColor,
      },
    });
    setQrCode(qr);
  }, []);

  // Update QR code content
  useEffect(() => {
    if (qrCode) {
      const content = formatContent(contentType, contentData);
      if (content) {
        qrCode.update({ data: content });
      }
    }
  }, [qrCode, contentType, contentData]);

  // Update QR code style
  useEffect(() => {
    if (qrCode) {
      const dotsOptions: Record<string, unknown> = {
        type: options.dotsStyle,
      };

      if (options.dotsColorType === 'gradient' && options.gradient) {
        dotsOptions.gradient = {
          type: options.gradient.type,
          colorStops: [
            { offset: 0, color: options.gradient.startColor },
            { offset: 1, color: options.gradient.endColor },
          ],
        };
      } else {
        dotsOptions.color = options.dotsColor;
      }

      qrCode.update({
        width: options.size,
        height: options.size,
        margin: options.margin,
        qrOptions: {
          errorCorrectionLevel: options.errorCorrectionLevel,
        },
        dotsOptions,
        backgroundOptions: {
          color: options.backgroundColor,
        },
        cornersSquareOptions: {
          type: options.cornersSquareStyle,
        },
        cornersDotOptions: {
          type: options.cornersDotStyle,
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: options.logoMargin,
          imageSize: options.logoSize / 100,
        },
        image: options.logoImage || undefined,
      });
    }
  }, [qrCode, options]);

  // Mount to DOM
  useEffect(() => {
    if (ref.current && qrCode) {
      ref.current.innerHTML = '';
      qrCode.append(ref.current);
    }
  }, [qrCode]);

  const download = useCallback(
    async (format: 'png' | 'svg' | 'jpeg', filename: string) => {
      if (qrCode) {
        if (format === 'jpeg') {
          await qrCode.download({
            name: filename,
            extension: 'png',
          });
          // Note: qr-code-styling doesn't directly support jpeg, using png instead
        } else {
          await qrCode.download({
            name: filename,
            extension: format,
          });
        }
      }
    },
    [qrCode]
  );

  return { ref, qrCode, download };
};
