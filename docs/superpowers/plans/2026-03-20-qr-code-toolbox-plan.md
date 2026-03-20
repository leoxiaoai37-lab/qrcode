# QR Code Toolbox 实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个支持10种内容类型、丰富自定义选项的二维码生成工具网站

**Architecture:** React SPA，左侧输入区+右侧预览区布局，使用 qr-code-styling 库生成二维码，实时预览，支持 PNG/SVG/JPG 下载

**Tech Stack:** React 18 + TypeScript + Tailwind CSS + Vite + qr-code-styling

---

## 文件结构

```
src/
├── components/
│   ├── QRGenerator/
│   │   ├── index.tsx           # 主组件，整合所有子组件
│   │   ├── ContentInput.tsx    # 内容类型选择+动态表单
│   │   ├── StylePanel.tsx      # 样式自定义面板
│   │   └── QRPreview.tsx       # 二维码预览+下载按钮
│   ├── Layout/
│   │   ├── Header.tsx          # 顶部导航
│   │   └── Footer.tsx          # 底部信息
│   └── ui/
│       ├── Button.tsx          # 通用按钮
│       ├── Input.tsx           # 通用输入框
│       ├── Select.tsx          # 通用下拉选择
│       ├── Slider.tsx          # 通用滑块
│       └── ColorPicker.tsx     # 颜色选择器
├── hooks/
│   └── useQRCode.ts            # 二维码生成 hook
├── types/
│   └── qr.ts                   # 类型定义
├── utils/
│   ├── qrFormatters.ts         # 内容格式化函数
│   └── download.ts             # 下载处理函数
├── App.tsx
├── main.tsx
└── index.css
```

---

## Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/index.css`

- [ ] **Step 1: 使用 Vite 创建 React + TypeScript 项目**

```bash
npm create vite@latest . -- --template react-ts
```

Expected: 项目初始化成功，生成基础文件

- [ ] **Step 2: 安装依赖**

```bash
npm install qr-code-styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Expected: 依赖安装成功

- [ ] **Step 3: 配置 Tailwind CSS**

修改 `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

修改 `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4: 验证项目可启动**

```bash
npm run dev
```

Expected: 开发服务器启动成功

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "chore: init project with Vite + React + TypeScript + Tailwind"
```

---

## Task 2: 类型定义

**Files:**
- Create: `src/types/qr.ts`

- [ ] **Step 1: 创建类型定义文件**

```typescript
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
  | 'app';

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
```

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
npx tsc --noEmit
```

Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add src/types/qr.ts
git commit -m "feat: add QR code type definitions"
```

---

## Task 3: 内容格式化工具函数

**Files:**
- Create: `src/utils/qrFormatters.ts`

- [ ] **Step 1: 创建格式化函数**

```typescript
// src/utils/qrFormatters.ts

interface WiFiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
}

interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  address: string;
  website: string;
}

interface EventData {
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  description: string;
}

interface GeoData {
  lat: string;
  lon: string;
}

interface SMSData {
  phone: string;
  message: string;
}

interface EmailData {
  email: string;
  subject: string;
  body: string;
}

interface AppData {
  iosUrl: string;
  androidUrl: string;
}

export const formatText = (text: string): string => text;

export const formatUrl = (url: string): string => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

export const formatEmail = (data: EmailData): string => {
  let result = `mailto:${data.email}`;
  const params: string[] = [];
  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
  if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);
  if (params.length > 0) result += '?' + params.join('&');
  return result;
};

export const formatPhone = (phone: string): string => `tel:${phone.replace(/\s/g, '')}`;

export const formatSMS = (data: SMSData): string => {
  const phone = data.phone.replace(/\s/g, '');
  return `smsto:${phone}:${data.message}`;
};

export const formatWiFi = (data: WiFiData): string => {
  return `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};;`;
};

export const formatVCard = (data: VCardData): string => {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${data.lastName};${data.firstName}`,
    `FN:${data.firstName} ${data.lastName}`,
  ];
  if (data.phone) lines.push(`TEL:${data.phone}`);
  if (data.email) lines.push(`EMAIL:${data.email}`);
  if (data.company) lines.push(`ORG:${data.company}`);
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.address) lines.push(`ADR:;;${data.address};;;`);
  if (data.website) lines.push(`URL:${data.website}`);
  lines.push('END:VCARD');
  return lines.join('\n');
};

export const formatEvent = (data: EventData): string => {
  const lines = [
    'BEGIN:VEVENT',
    `SUMMARY:${data.title}`,
  ];
  if (data.location) lines.push(`LOCATION:${data.location}`);
  if (data.startTime) lines.push(`DTSTART:${data.startTime.replace(/[-:]/g, '').replace('T', 'T')}`);
  if (data.endTime) lines.push(`DTEND:${data.endTime.replace(/[-:]/g, '').replace('T', 'T')}`);
  if (data.description) lines.push(`DESCRIPTION:${data.description}`);
  lines.push('END:VEVENT');
  return lines.join('\n');
};

export const formatGeo = (data: GeoData): string => {
  return `geo:${data.lat},${data.lon}`;
};

export const formatApp = (data: AppData): string => {
  // 使用通用跳转服务格式
  if (data.iosUrl && data.androidUrl) {
    return data.iosUrl; // 默认返回 iOS 链接
  }
  return data.iosUrl || data.androidUrl || '';
};
```

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
npx tsc --noEmit
```

Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add src/utils/qrFormatters.ts
git commit -m "feat: add QR content formatters"
```

---

## Task 4: 下载工具函数

**Files:**
- Create: `src/utils/download.ts`

- [ ] **Step 1: 创建下载函数**

```typescript
// src/utils/download.ts

export const generateFileName = (customName?: string): string => {
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '_')
    .slice(0, 15);
  return customName || `qrcode_${timestamp}`;
};

export const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const canvasToJpeg = (canvas: HTMLCanvasElement, quality = 0.9): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to JPEG'));
        }
      },
      'image/jpeg',
      quality
    );
  });
};
```

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
npx tsc --noEmit
```

Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add src/utils/download.ts
git commit -m "feat: add download utility functions"
```

---

## Task 5: 通用 UI 组件

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Input.tsx`
- Create: `src/components/ui/Select.tsx`
- Create: `src/components/ui/Slider.tsx`
- Create: `src/components/ui/ColorPicker.tsx`

- [ ] **Step 1: 创建 Button 组件**

```tsx
// src/components/ui/Button.tsx

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

- [ ] **Step 2: 创建 Input 组件**

```tsx
// src/components/ui/Input.tsx

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
```

- [ ] **Step 3: 创建 Select 组件**

```tsx
// src/components/ui/Select.tsx

import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
```

- [ ] **Step 4: 创建 Slider 组件**

```tsx
// src/components/ui/Slider.tsx

import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
}) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-500">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  );
};
```

- [ ] **Step 5: 创建 ColorPicker 组件**

```tsx
// src/components/ui/ColorPicker.tsx

import React from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border border-gray-300"
      />
      <span className="text-sm text-gray-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm font-mono"
      />
    </div>
  );
};
```

- [ ] **Step 6: 创建 UI 组件索引**

```tsx
// src/components/ui/index.ts

export { Button } from './Button';
export { Input } from './Input';
export { Select } from './Select';
export { Slider } from './Slider';
export { ColorPicker } from './ColorPicker';
```

- [ ] **Step 7: 验证编译**

```bash
npm run build
```

Expected: 编译成功

- [ ] **Step 8: 提交**

```bash
git add src/components/ui/
git commit -m "feat: add UI components (Button, Input, Select, Slider, ColorPicker)"
```

---

## Task 6: useQRCode Hook

**Files:**
- Create: `src/hooks/useQRCode.ts`

- [ ] **Step 1: 创建 useQRCode Hook**

```tsx
// src/hooks/useQRCode.ts

import { useEffect, useRef, useState, useCallback } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QROptions, ContentType } from '../types/qr';
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

  // 初始化二维码实例
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

  // 更新二维码内容
  useEffect(() => {
    if (qrCode) {
      const content = formatContent(contentType, contentData);
      if (content) {
        qrCode.update({ data: content });
      }
    }
  }, [qrCode, contentType, contentData]);

  // 更新二维码样式
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

  // 挂载到 DOM
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
          // 注意: qr-code-styling 不直接支持 jpeg，这里用 png 替代
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
```

- [ ] **Step 2: 验证编译**

```bash
npm run build
```

Expected: 编译成功

- [ ] **Step 3: 提交**

```bash
git add src/hooks/useQRCode.ts
git commit -m "feat: add useQRCode hook"
```

---

## Task 7: Layout 组件

**Files:**
- Create: `src/components/Layout/Header.tsx`
- Create: `src/components/Layout/Footer.tsx`

- [ ] **Step 1: 创建 Header 组件**

```tsx
// src/components/Layout/Header.tsx

import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">QR Code Toolbox</h1>
          </div>
        </div>
      </div>
    </header>
  );
};
```

- [ ] **Step 2: 创建 Footer 组件**

```tsx
// src/components/Layout/Footer.tsx

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-center text-sm text-gray-500">
          QR Code Toolbox - 免费在线二维码生成工具
        </p>
      </div>
    </footer>
  );
};
```

- [ ] **Step 3: 提交**

```bash
git add src/components/Layout/
git commit -m "feat: add Header and Footer components"
```

---

## Task 8: ContentInput 组件

**Files:**
- Create: `src/components/QRGenerator/ContentInput.tsx`

- [ ] **Step 1: 创建内容类型配置**

```tsx
// src/components/QRGenerator/ContentInput.tsx

import React from 'react';
import { ContentType, ContentTypeInfo, FieldConfig } from '../../types/qr';
import { Input, Select } from '../ui';

const CONTENT_TYPES: ContentTypeInfo[] = [
  {
    type: 'text',
    label: '纯文本',
    icon: '📝',
    fields: [
      { name: 'text', label: '文本内容', type: 'textarea', required: true, placeholder: '输入任意文本' },
    ],
  },
  {
    type: 'url',
    label: '网址',
    icon: '🔗',
    fields: [
      { name: 'url', label: 'URL', type: 'url', required: true, placeholder: 'https://example.com' },
    ],
  },
  {
    type: 'email',
    label: '邮箱',
    icon: '📧',
    fields: [
      { name: 'email', label: '邮箱地址', type: 'email', required: true, placeholder: 'example@email.com' },
      { name: 'subject', label: '主题', type: 'text', required: false, placeholder: '邮件主题' },
      { name: 'body', label: '正文', type: 'textarea', required: false, placeholder: '邮件内容' },
    ],
  },
  {
    type: 'phone',
    label: '电话',
    icon: '📱',
    fields: [
      { name: 'phone', label: '电话号码', type: 'tel', required: true, placeholder: '+86 138 0000 0000' },
    ],
  },
  {
    type: 'sms',
    label: '短信',
    icon: '💬',
    fields: [
      { name: 'phone', label: '电话号码', type: 'tel', required: true, placeholder: '+86 138 0000 0000' },
      { name: 'message', label: '短信内容', type: 'textarea', required: false, placeholder: '短信内容' },
    ],
  },
  {
    type: 'wifi',
    label: 'WiFi',
    icon: '📶',
    fields: [
      { name: 'ssid', label: '网络名称', type: 'text', required: true, placeholder: 'WiFi名称' },
      { name: 'password', label: '密码', type: 'text', required: false, placeholder: 'WiFi密码' },
      {
        name: 'encryption',
        label: '加密类型',
        type: 'select',
        required: true,
        options: [
          { value: 'WPA', label: 'WPA/WPA2' },
          { value: 'WEP', label: 'WEP' },
          { value: 'nopass', label: '无密码' },
        ],
      },
    ],
  },
  {
    type: 'vcard',
    label: '名片',
    icon: '👤',
    fields: [
      { name: 'firstName', label: '名', type: 'text', required: true, placeholder: '三' },
      { name: 'lastName', label: '姓', type: 'text', required: true, placeholder: '张' },
      { name: 'phone', label: '电话', type: 'tel', required: false, placeholder: '电话号码' },
      { name: 'email', label: '邮箱', type: 'email', required: false, placeholder: '邮箱地址' },
      { name: 'company', label: '公司', type: 'text', required: false, placeholder: '公司名称' },
      { name: 'title', label: '职位', type: 'text', required: false, placeholder: '职位' },
      { name: 'address', label: '地址', type: 'text', required: false, placeholder: '地址' },
      { name: 'website', label: '网站', type: 'url', required: false, placeholder: 'https://example.com' },
    ],
  },
  {
    type: 'event',
    label: '日历',
    icon: '📅',
    fields: [
      { name: 'title', label: '标题', type: 'text', required: true, placeholder: '事件标题' },
      { name: 'location', label: '地点', type: 'text', required: false, placeholder: '事件地点' },
      { name: 'startTime', label: '开始时间', type: 'text', required: true, placeholder: '2024-01-01T10:00' },
      { name: 'endTime', label: '结束时间', type: 'text', required: false, placeholder: '2024-01-01T12:00' },
      { name: 'description', label: '描述', type: 'textarea', required: false, placeholder: '事件描述' },
    ],
  },
  {
    type: 'geo',
    label: '位置',
    icon: '📍',
    fields: [
      { name: 'lat', label: '纬度', type: 'text', required: true, placeholder: '39.9042' },
      { name: 'lon', label: '经度', type: 'text', required: true, placeholder: '116.4074' },
    ],
  },
  {
    type: 'app',
    label: 'App',
    icon: '📲',
    fields: [
      { name: 'iosUrl', label: 'iOS 链接', type: 'url', required: false, placeholder: 'https://apps.apple.com/...' },
      { name: 'androidUrl', label: 'Android 链接', type: 'url', required: false, placeholder: 'https://play.google.com/...' },
    ],
  },
];

interface ContentInputProps {
  contentType: ContentType;
  contentData: Record<string, string>;
  onContentTypeChange: (type: ContentType) => void;
  onContentDataChange: (data: Record<string, string>) => void;
}

export const ContentInput: React.FC<ContentInputProps> = ({
  contentType,
  contentData,
  onContentTypeChange,
  onContentDataChange,
}) => {
  const currentType = CONTENT_TYPES.find((t) => t.type === contentType) || CONTENT_TYPES[0];

  const handleFieldChange = (fieldName: string, value: string) => {
    onContentDataChange({
      ...contentData,
      [fieldName]: value,
    });
  };

  return (
    <div className="space-y-4">
      {/* 类型选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">内容类型</label>
        <div className="grid grid-cols-5 gap-2">
          {CONTENT_TYPES.map((type) => (
            <button
              key={type.type}
              onClick={() => onContentTypeChange(type.type)}
              className={`p-2 rounded-lg border text-center transition-colors ${
                contentType === type.type
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <span className="text-lg">{type.icon}</span>
              <span className="block text-xs mt-1">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 动态表单 */}
      <div className="space-y-3">
        {currentType.fields.map((field) => (
          <div key={field.name}>
            {field.type === 'select' ? (
              <Select
                label={field.label}
                value={contentData[field.name] || field.options?.[0]?.value || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                options={field.options || []}
              />
            ) : field.type === 'textarea' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <textarea
                  value={contentData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <Input
                label={field.label}
                type={field.type}
                value={contentData[field.name] || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: 验证编译**

```bash
npm run build
```

Expected: 编译成功

- [ ] **Step 3: 提交**

```bash
git add src/components/QRGenerator/ContentInput.tsx
git commit -m "feat: add ContentInput component with 10 content types"
```

---

## Task 9: StylePanel 组件

**Files:**
- Create: `src/components/QRGenerator/StylePanel.tsx`

- [ ] **Step 1: 创建 StylePanel 组件**

```tsx
// src/components/QRGenerator/StylePanel.tsx

import React, { useRef } from 'react';
import { QROptions, DotsStyle, CornersStyle, ErrorCorrectionLevel } from '../../types/qr';
import { Slider, Select, ColorPicker } from '../ui';

interface StylePanelProps {
  options: QROptions;
  onOptionsChange: (options: QROptions) => void;
}

const DOTS_STYLES: { value: DotsStyle; label: string }[] = [
  { value: 'square', label: '方形' },
  { value: 'rounded', label: '圆角' },
  { value: 'dots', label: '圆点' },
  { value: 'classy', label: '优雅' },
  { value: 'classy-rounded', label: '优雅圆角' },
  { value: 'extra-rounded', label: '额外圆角' },
];

const CORNERS_STYLES: { value: CornersStyle; label: string }[] = [
  { value: 'square', label: '方形' },
  { value: 'extra-rounded', label: '圆角' },
  { value: 'dot', label: '圆点' },
];

const ERROR_LEVELS: { value: ErrorCorrectionLevel; label: string }[] = [
  { value: 'L', label: 'L - 7%' },
  { value: 'M', label: 'M - 15%' },
  { value: 'Q', label: 'Q - 25%' },
  { value: 'H', label: 'H - 30%' },
];

export const StylePanel: React.FC<StylePanelProps> = ({ options, onOptionsChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateOption = <K extends keyof QROptions>(key: K, value: QROptions[K]) => {
    onOptionsChange({ ...options, [key]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo 文件大小不能超过 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        updateOption('logoImage', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    updateOption('logoImage', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* 基础设置 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">基础设置</h3>

        <Slider
          label="尺寸"
          value={options.size}
          min={128}
          max={1024}
          step={32}
          unit="px"
          onChange={(value) => updateOption('size', value)}
        />

        <Slider
          label="边距"
          value={options.margin}
          min={0}
          max={10}
          unit=""
          onChange={(value) => updateOption('margin', value)}
        />

        <Select
          label="纠错等级"
          value={options.errorCorrectionLevel}
          onChange={(e) => updateOption('errorCorrectionLevel', e.target.value as ErrorCorrectionLevel)}
          options={ERROR_LEVELS}
        />
      </div>

      {/* 颜色设置 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">颜色设置</h3>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="colorType"
              checked={options.dotsColorType === 'solid'}
              onChange={() => updateOption('dotsColorType', 'solid')}
            />
            <span className="text-sm">纯色</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="colorType"
              checked={options.dotsColorType === 'gradient'}
              onChange={() => updateOption('dotsColorType', 'gradient')}
            />
            <span className="text-sm">渐变</span>
          </label>
        </div>

        {options.dotsColorType === 'solid' ? (
          <ColorPicker
            label="点颜色"
            value={options.dotsColor}
            onChange={(value) => updateOption('dotsColor', value)}
          />
        ) : (
          <div className="space-y-3">
            <Select
              label="渐变类型"
              value={options.gradient?.type || 'linear'}
              onChange={(e) =>
                updateOption('gradient', {
                  ...options.gradient,
                  type: e.target.value as 'linear' | 'radial',
                  startColor: options.gradient?.startColor || '#000000',
                  endColor: options.gradient?.endColor || '#ffffff',
                })
              }
              options={[
                { value: 'linear', label: '线性渐变' },
                { value: 'radial', label: '径向渐变' },
              ]}
            />
            <ColorPicker
              label="起始色"
              value={options.gradient?.startColor || '#000000'}
              onChange={(value) =>
                updateOption('gradient', {
                  ...options.gradient,
                  type: options.gradient?.type || 'linear',
                  startColor: value,
                  endColor: options.gradient?.endColor || '#ffffff',
                })
              }
            />
            <ColorPicker
              label="结束色"
              value={options.gradient?.endColor || '#ffffff'}
              onChange={(value) =>
                updateOption('gradient', {
                  ...options.gradient,
                  type: options.gradient?.type || 'linear',
                  startColor: options.gradient?.startColor || '#000000',
                  endColor: value,
                })
              }
            />
          </div>
        )}

        <ColorPicker
          label="背景色"
          value={options.backgroundColor}
          onChange={(value) => updateOption('backgroundColor', value)}
        />
      </div>

      {/* 样式设置 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">样式设置</h3>

        <Select
          label="点样式"
          value={options.dotsStyle}
          onChange={(e) => updateOption('dotsStyle', e.target.value as DotsStyle)}
          options={DOTS_STYLES}
        />

        <Select
          label="码眼外框"
          value={options.cornersSquareStyle}
          onChange={(e) => updateOption('cornersSquareStyle', e.target.value as CornersStyle)}
          options={CORNERS_STYLES}
        />

        <Select
          label="码眼内点"
          value={options.cornersDotStyle}
          onChange={(e) => updateOption('cornersDotStyle', e.target.value as CornersStyle)}
          options={CORNERS_STYLES}
        />
      </div>

      {/* Logo 设置 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Logo 设置</h3>

        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml"
            onChange={handleLogoUpload}
            className="hidden"
          />

          {options.logoImage ? (
            <div className="flex items-center gap-3">
              <img
                src={options.logoImage}
                alt="Logo"
                className="w-12 h-12 object-contain border rounded"
              />
              <button
                onClick={removeLogo}
                className="text-sm text-red-600 hover:text-red-700"
              >
                移除 Logo
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              上传 Logo (PNG/JPG/SVG, 最大 2MB)
            </button>
          )}

          {options.logoImage && (
            <>
              <Slider
                label="Logo 大小"
                value={options.logoSize}
                min={10}
                max={40}
                unit="%"
                onChange={(value) => updateOption('logoSize', value)}
              />

              <Slider
                label="Logo 边距"
                value={options.logoMargin}
                min={0}
                max={10}
                unit=""
                onChange={(value) => updateOption('logoMargin', value)}
              />

              <ColorPicker
                label="Logo 背景"
                value={options.logoBackgroundColor}
                onChange={(value) => updateOption('logoBackgroundColor', value)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: 验证编译**

```bash
npm run build
```

Expected: 编译成功

- [ ] **Step 3: 提交**

```bash
git add src/components/QRGenerator/StylePanel.tsx
git commit -m "feat: add StylePanel component with full customization options"
```

---

## Task 10: QRPreview 组件

**Files:**
- Create: `src/components/QRGenerator/QRPreview.tsx`

- [ ] **Step 1: 创建 QRPreview 组件**

```tsx
// src/components/QRGenerator/QRPreview.tsx

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
      {/* 二维码预览区 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div
          ref={qrRef}
          className="flex items-center justify-center min-w-[200px] min-h-[200px]"
        />
      </div>

      {/* 自定义文件名 */}
      <div className="w-full max-w-xs">
        <Input
          label="文件名（可选）"
          value={customFilename}
          onChange={(e) => setCustomFilename(e.target.value)}
          placeholder="自定义文件名"
        />
      </div>

      {/* 下载按钮 */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm font-medium text-gray-700">下载二维码</p>
        <div className="flex gap-3">
          <Button
            onClick={() => handleDownload('png')}
            variant="primary"
          >
            PNG
          </Button>
          <Button
            onClick={() => handleDownload('svg')}
            variant="secondary"
          >
            SVG
          </Button>
          <Button
            onClick={() => handleDownload('jpeg')}
            variant="secondary"
          >
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
```

- [ ] **Step 2: 验证编译**

```bash
npm run build
```

Expected: 编译成功

- [ ] **Step 3: 提交**

```bash
git add src/components/QRGenerator/QRPreview.tsx
git commit -m "feat: add QRPreview component with download buttons"
```

---

## Task 11: QRGenerator 主组件

**Files:**
- Create: `src/components/QRGenerator/index.tsx`

- [ ] **Step 1: 创建 QRGenerator 主组件**

```tsx
// src/components/QRGenerator/index.tsx

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
      // 切换类型时清空内容数据
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

  const handleDownload = async (format: 'png' | 'svg' | 'jpeg', filename: string) => {
    await download(format, filename);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：输入区 */}
        <div className="space-y-6">
          {/* 内容输入 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">内容</h2>
            <ContentInput
              contentType={state.contentType}
              contentData={state.contentData}
              onContentTypeChange={handleContentTypeChange}
              onContentDataChange={handleContentDataChange}
            />
          </div>

          {/* 样式面板 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">样式</h2>
            <StylePanel
              options={state.options}
              onOptionsChange={handleOptionsChange}
            />
          </div>
        </div>

        {/* 右侧：预览区 */}
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
```

- [ ] **Step 2: 验证编译**

```bash
npm run build
```

Expected: 编译成功

- [ ] **Step 3: 提交**

```bash
git add src/components/QRGenerator/index.tsx
git commit -m "feat: add QRGenerator main component"
```

---

## Task 12: App 整合

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: 修改 App.tsx**

```tsx
// src/App.tsx

import React from 'react';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { QRGenerator } from './components/QRGenerator';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <QRGenerator />
      </main>
      <Footer />
    </div>
  );
}

export default App;
```

- [ ] **Step 2: 验证应用可运行**

```bash
npm run dev
```

Expected: 应用启动成功，可在浏览器访问

- [ ] **Step 3: 提交**

```bash
git add src/App.tsx
git commit -m "feat: integrate all components in App"
```

---

## Task 13: 最终验证与构建

- [ ] **Step 1: 运行 TypeScript 检查**

```bash
npx tsc --noEmit
```

Expected: 无错误

- [ ] **Step 2: 构建生产版本**

```bash
npm run build
```

Expected: 构建成功，生成 dist 目录

- [ ] **Step 3: 预览生产构建**

```bash
npm run preview
```

Expected: 预览服务器启动，应用正常运行

- [ ] **Step 4: 最终提交**

```bash
git add .
git commit -m "feat: complete QR Code Toolbox implementation

- 10 content types support (text, url, email, phone, sms, wifi, vcard, event, geo, app)
- Full customization options (size, color, gradient, dots style, corners style, logo)
- Download in PNG/SVG/JPG formats
- React + Tailwind + Vite + TypeScript
- qr-code-styling library for QR generation

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## 实现检查清单

- [ ] 项目初始化完成（Vite + React + TypeScript + Tailwind）
- [ ] 类型定义完成
- [ ] 内容格式化函数完成
- [ ] 下载工具函数完成
- [ ] UI 组件完成（Button, Input, Select, Slider, ColorPicker）
- [ ] useQRCode Hook 完成
- [ ] Layout 组件完成（Header, Footer）
- [ ] ContentInput 组件完成（10种内容类型）
- [ ] StylePanel 组件完成（完整自定义选项）
- [ ] QRPreview 组件完成（预览+下载）
- [ ] QRGenerator 主组件完成
- [ ] App 整合完成
- [ ] 构建验证通过
