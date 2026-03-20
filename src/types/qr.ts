// src/types/qr.ts

export type ContentType =
  | 'text'
  | 'url'
  | 'email'
  | 'phone'
  | 'sms'
  | 'wifi'
  | 'vcard'
  | 'event'
  | 'geo'
  | 'app'
  | 'payment';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type DotsStyle = 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';

export type CornersStyle = 'square' | 'extra-rounded' | 'dot';

export type GradientType = 'linear' | 'radial';

export interface QRGradient {
  type: GradientType;
  startColor: string;
  endColor: string;
}

export interface QROptions {
  size: number;
  margin: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  dotsColor: string;
  dotsColorType: 'solid' | 'gradient';
  gradient?: QRGradient;
  backgroundColor: string;
  dotsStyle: DotsStyle;
  cornersSquareStyle: CornersStyle;
  cornersDotStyle: CornersStyle;
  logoImage: string | null;
  logoSize: number;
  logoMargin: number;
  logoBackgroundColor: string;
}

export interface QRState {
  contentType: ContentType;
  contentData: Record<string, string>;
  options: QROptions;
}

export interface ContentTypeInfo {
  type: ContentType;
  label: string;
  icon: string;
  fields: FieldConfig[];
}

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'url' | 'tel' | 'number' | 'select';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

// 默认选项
export const DEFAULT_OPTIONS: QROptions = {
  size: 300,
  margin: 2,
  errorCorrectionLevel: 'Q',
  dotsColor: '#000000',
  dotsColorType: 'solid',
  backgroundColor: '#FFFFFF',
  dotsStyle: 'square',
  cornersSquareStyle: 'square',
  cornersDotStyle: 'square',
  logoImage: null,
  logoSize: 25,
  logoMargin: 2,
  logoBackgroundColor: '#FFFFFF',
};
