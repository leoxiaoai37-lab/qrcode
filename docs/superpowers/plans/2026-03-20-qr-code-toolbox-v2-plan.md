# QR Code Toolbox v2.0 实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 QR Code Toolbox 添加收款码、输入防抖、历史记录、批量生成功能

**Architecture:** 在现有 React 组件基础上，渐进式添加新功能。Phase 1 修改现有组件添加防抖和收款码，Phase 2 添加历史记录模块，Phase 3 添加批量生成模块。

**Tech Stack:** React 18 + TypeScript + Tailwind CSS + Vite + qr-code-styling + jszip

---

## 文件结构

### 新增文件
```
src/
├── hooks/
│   └── useDebounce.ts           # 防抖 Hook
├── utils/
│   ├── historyStorage.ts        # 历史记录存储
│   ├── csvParser.ts             # CSV 解析
│   └── zipDownload.ts           # ZIP 打包下载
├── components/
│   ├── History/
│   │   ├── index.tsx            # 历史记录面板
│   │   └── HistoryItem.tsx      # 历史记录条目
│   └── BatchGenerator/
│       ├── index.tsx            # 批量生成主组件
│       ├── CSVUploader.tsx      # CSV 上传
│       ├── BatchList.tsx        # 批量列表
│       └── BatchPreview.tsx     # 批量预览
```

### 修改文件
```
src/
├── types/qr.ts                  # 添加 'payment' 类型
├── utils/qrFormatters.ts        # 添加 formatPayment
├── components/QRGenerator/
│   ├── ContentInput.tsx         # 添加收款码类型 + 防抖
│   └── StylePanel.tsx           # 添加防抖
├── components/Layout/Header.tsx # 添加 Tab 切换
└── App.tsx                      # 添加路由/Tab
```

---

## Phase 1: 防抖 + 收款码

### Task 1: 添加 useDebounce Hook

**Files:**
- Create: `src/hooks/useDebounce.ts`

- [ ] **Step 1: 创建 useDebounce Hook**

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
npx tsc --noEmit
```

Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add src/hooks/useDebounce.ts
git commit -m "feat: add useDebounce hook"
```

---

### Task 2: 添加收款码类型到类型定义

**Files:**
- Modify: `src/types/qr.ts`

- [ ] **Step 1: 添加 payment 类型到 ContentType**

在 `ContentType` 类型中添加 `'payment'`:

```typescript
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
  | 'payment';  // 新增
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: 提交**

```bash
git add src/types/qr.ts
git commit -m "feat: add payment content type"
```

---

### Task 3: 添加 formatPayment 格式化函数

**Files:**
- Modify: `src/utils/qrFormatters.ts`

- [ ] **Step 1: 添加 PaymentData 接口和 formatPayment 函数**

```typescript
// 添加到 src/utils/qrFormatters.ts

interface PaymentData {
  platform: 'alipay' | 'wechat';
  link: string;
  amount?: string;
  note?: string;
}

export const formatPayment = (data: PaymentData): string => {
  if (data.platform === 'alipay') {
    // 支付宝：如果有金额，添加金额参数
    if (data.amount) {
      return `alipays://platformapi/startapp?appId=20000067&url=${encodeURIComponent(data.link)}&amount=${data.amount}`;
    }
    return data.link;
  }
  // 微信：直接使用原链接
  return data.link;
};
```

- [ ] **Step 2: 更新 formatContent 函数（在 useQRCode.ts 中使用）**

在 `src/hooks/useQRCode.ts` 的 `formatContent` 函数中添加 payment case:

```typescript
// 在 formatContent 函数的 switch 中添加
case 'payment':
  return formatPayment({
    platform: (data.platform as 'alipay' | 'wechat') || 'alipay',
    link: data.link || '',
    amount: data.amount,
    note: data.note,
  });
```

- [ ] **Step 3: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: 提交**

```bash
git add src/utils/qrFormatters.ts src/hooks/useQRCode.ts
git commit -m "feat: add payment QR code formatter"
```

---

### Task 4: 更新 ContentInput 添加收款码类型和防抖

**Files:**
- Modify: `src/components/QRGenerator/ContentInput.tsx`

- [ ] **Step 1: 添加收款码到内容类型配置**

在 `CONTENT_TYPES` 数组中添加:

```typescript
{
  type: 'payment',
  label: '收款码',
  icon: '💰',
  fields: [
    { 
      name: 'platform', 
      label: '收款方式', 
      type: 'select', 
      required: true, 
      options: [
        { value: 'alipay', label: '支付宝' },
        { value: 'wechat', label: '微信' },
      ]
    },
    { name: 'link', label: '收款码链接', type: 'text', required: true, placeholder: '粘贴收款码链接' },
    { name: 'amount', label: '金额（可选）', type: 'number', required: false, placeholder: '固定金额' },
    { name: 'note', label: '备注（可选）', type: 'text', required: false, placeholder: '收款说明' },
  ],
},
```

- [ ] **Step 2: 添加本地状态和防抖**

修改组件实现防抖：

```typescript
// 在 ContentInput 组件内部

import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

export const ContentInput: React.FC<ContentInputProps> = ({
  contentType,
  contentData,
  onContentTypeChange,
  onContentDataChange,
}) => {
  // 本地状态（即时响应）
  const [localData, setLocalData] = useState(contentData);
  
  // 防抖后的数据
  const debouncedData = useDebounce(localData, 300);

  // 当防抖数据变化时，通知父组件
  useEffect(() => {
    onContentDataChange(debouncedData);
  }, [debouncedData]);

  // 本地更新函数
  const handleFieldChange = (fieldName: string, value: string) => {
    setLocalData(prev => ({ ...prev, [fieldName]: value }));
  };

  // 类型切换时重置本地数据
  useEffect(() => {
    setLocalData({});
  }, [contentType]);

  // ... 其余代码使用 handleFieldChange 和 localData
};
```

- [ ] **Step 3: 验证编译和运行**

```bash
npm run dev
```

Expected: 应用运行正常，收款码类型可选

- [ ] **Step 4: 提交**

```bash
git add src/components/QRGenerator/ContentInput.tsx
git commit -m "feat: add payment type and debounce to ContentInput"
```

---

### Task 5: 更新 StylePanel 添加防抖

**Files:**
- Modify: `src/components/QRGenerator/StylePanel.tsx`

- [ ] **Step 1: 添加防抖到 StylePanel**

```typescript
import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

export const StylePanel: React.FC<StylePanelProps> = ({ options, onOptionsChange }) => {
  // 本地状态
  const [localOptions, setLocalOptions] = useState(options);
  
  // 防抖后的选项
  const debouncedOptions = useDebounce(localOptions, 300);

  // 当防抖选项变化时，通知父组件
  useEffect(() => {
    onOptionsChange(debouncedOptions);
  }, [debouncedOptions]);

  // 本地更新函数
  const updateOption = <K extends keyof QROptions>(key: K, value: QROptions[K]) => {
    setLocalOptions(prev => ({ ...prev, [key]: value }));
  };

  // ... 其余代码使用 updateOption 和 localOptions
};
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: 提交**

```bash
git add src/components/QRGenerator/StylePanel.tsx
git commit -m "feat: add debounce to StylePanel"
```

---

## Phase 2: 历史记录

### Task 6: 添加 historyStorage 工具

**Files:**
- Create: `src/utils/historyStorage.ts`

- [ ] **Step 1: 创建历史记录存储工具**

```typescript
// src/utils/historyStorage.ts

const STORAGE_KEY = 'qr-toolbox-history';
const MAX_RECORDS = 30;

export interface HistoryRecord {
  id: string;
  createdAt: number;
  contentType: string;
  contentData: Record<string, string>;
  options: Record<string, unknown>;
  previewImage: string;
}

export const getHistory = (): HistoryRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addHistoryRecord = (
  record: Omit<HistoryRecord, 'id' | 'createdAt'>
): void => {
  const history = getHistory();
  
  const newRecord: HistoryRecord = {
    ...record,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };

  // 添加到开头
  history.unshift(newRecord);

  // 超出限制时删除最旧的
  if (history.length > MAX_RECORDS) {
    history.pop();
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const deleteHistoryRecord = (id: string): void => {
  const history = getHistory();
  const filtered = history.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
```

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: 提交**

```bash
git add src/utils/historyStorage.ts
git commit -m "feat: add history storage utility"
```

---

### Task 7: 创建 HistoryItem 组件

**Files:**
- Create: `src/components/History/HistoryItem.tsx`

- [ ] **Step 1: 创建 HistoryItem 组件**

```typescript
// src/components/History/HistoryItem.tsx

import React from 'react';
import { HistoryRecord } from '../../utils/historyStorage';
import { Button } from '../ui';

interface HistoryItemProps {
  record: HistoryRecord;
  onRestore: (record: HistoryRecord) => void;
  onDelete: (id: string) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
  record,
  onRestore,
  onDelete,
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* 缩略图 */}
        <img
          src={record.previewImage}
          alt="QR Code"
          className="w-16 h-16 rounded border"
        />
        
        {/* 信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              {record.contentType}
            </span>
            <span className="text-xs text-gray-400">
              {formatDate(record.createdAt)}
            </span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRestore(record)}
          >
            恢复
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onDelete(record.id)}
          >
            删除
          </Button>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: 提交**

```bash
git add src/components/History/HistoryItem.tsx
git commit -m "feat: add HistoryItem component"
```

---

### Task 8: 创建 History 面板组件

**Files:**
- Create: `src/components/History/index.tsx`

- [ ] **Step 1: 创建 History 组件**

```typescript
// src/components/History/index.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  getHistory,
  deleteHistoryRecord,
  clearHistory,
  HistoryRecord,
} from '../../utils/historyStorage';
import { HistoryItem } from './HistoryItem';
import { Button } from '../ui';

interface HistoryProps {
  onRestore: (record: HistoryRecord) => void;
}

export const History: React.FC<HistoryProps> = ({ onRestore }) => {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setRecords(getHistory());
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteHistoryRecord(id);
    setRecords(getHistory());
  }, []);

  const handleClear = useCallback(() => {
    if (confirm('确定要清空所有历史记录吗？')) {
      clearHistory();
      setRecords([]);
    }
  }, []);

  const handleRestore = useCallback((record: HistoryRecord) => {
    onRestore(record);
  }, [onRestore]);

  if (records.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      {/* 标题栏 */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">
            历史记录
          </span>
          <span className="text-sm text-gray-500">
            ({records.length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded && (
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            >
              清空
            </Button>
          )}
          <span className="text-gray-400">
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>
      </div>

      {/* 记录列表 */}
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {records.map(record => (
            <HistoryItem
              key={record.id}
              record={record}
              onRestore={handleRestore}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: 提交**

```bash
git add src/components/History/index.tsx
git commit -m "feat: add History panel component"
```

---

### Task 9: 集成历史记录到 QRGenerator

**Files:**
- Modify: `src/components/QRGenerator/index.tsx`

- [ ] **Step 1: 导入并添加 History 组件**

```typescript
// 在 src/components/QRGenerator/index.tsx 中添加

import { History } from '../History';
import { addHistoryRecord, HistoryRecord } from '../../utils/historyStorage';

// 在组件内部，添加保存到历史的函数
const handleSaveToHistory = useCallback(async () => {
  if (qrCode) {
    // 获取二维码图片
    const dataUrl = await qrCode.toDataURL();
    
    addHistoryRecord({
      contentType: state.contentType,
      contentData: state.contentData,
      options: state.options,
      previewImage: dataUrl,
    });
  }
}, [qrCode, state]);

// 添加恢复历史记录的函数
const handleRestoreFromHistory = useCallback((record: HistoryRecord) => {
  setState({
    contentType: record.contentType as ContentType,
    contentData: record.contentData,
    options: record.options as QROptions,
  });
}, []);

// 在 JSX 中，在组件末尾添加 History 组件
// </div> 之前添加:
// <History onRestore={handleRestoreFromHistory} />
```

- [ ] **Step 2: 在 QRPreview 中添加"保存到历史"按钮**

修改 `src/components/QRGenerator/QRPreview.tsx`:

```typescript
interface QRPreviewProps {
  qrRef: React.RefObject<HTMLDivElement>;
  onDownload: (format: 'png' | 'svg' | 'jpeg', filename: string) => void;
  onSaveToHistory?: () => void;  // 新增
}

// 在下载按钮下方添加:
{onSaveToHistory && (
  <Button onClick={onSaveToHistory} variant="outline">
    保存到历史
  </Button>
)}
```

- [ ] **Step 3: 验证功能**

```bash
npm run dev
```

Expected: 
- 生成二维码后可点击"保存到历史"
- 历史记录面板可展开/折叠
- 点击"恢复"可恢复之前的内容

- [ ] **Step 4: 提交**

```bash
git add src/components/QRGenerator/index.tsx src/components/QRGenerator/QRPreview.tsx
git commit -m "feat: integrate history into QRGenerator"
```

---

## Phase 3: 批量生成

### Task 10: 安装 jszip 依赖

- [ ] **Step 1: 安装 jszip**

```bash
npm install jszip
```

- [ ] **Step 2: 验证安装**

```bash
npm ls jszip
```

Expected: jszip@3.x.x

---

### Task 11: 添加 csvParser 工具

**Files:**
- Create: `src/utils/csvParser.ts`

- [ ] **Step 1: 创建 CSV 解析工具**

```typescript
// src/utils/csvParser.ts

export interface CSVRow {
  type: string;
  content: string;
}

export const parseCSV = (content: string): CSVRow[] => {
  const lines = content.trim().split('\n');
  const results: CSVRow[] = [];

  for (const line of lines) {
    // 跳过空行和注释行
    if (!line.trim() || line.startsWith('#')) continue;

    const parts = line.split(',').map(p => p.trim());
    
    if (parts.length >= 2) {
      const type = parts[0];
      // 合并剩余部分作为内容（处理内容中包含逗号的情况）
      const content = parts.slice(1).join(',');
      
      results.push({ type, content });
    }
  }

  return results;
};

export const generateCSVTemplate = (): string => {
  return `# QR Code Batch Template
# Format: type,content
# Types: text, url, email, phone, sms, wifi, vcard, event, geo, app, payment

url,https://example1.com
url,https://example2.com
text,Hello World
text,测试文本`;
};
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: 提交**

```bash
git add src/utils/csvParser.ts
git commit -m "feat: add CSV parser utility"
```

---

### Task 12: 添加 zipDownload 工具

**Files:**
- Create: `src/utils/zipDownload.ts`

- [ ] **Step 1: 创建 ZIP 下载工具**

```typescript
// src/utils/zipDownload.ts

import JSZip from 'jszip';
import { downloadFile } from './download';

export interface ZipImage {
  name: string;
  dataUrl: string;
}

export const downloadAsZip = async (images: ZipImage[]): Promise<void> => {
  const zip = new JSZip();

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    // 从 dataUrl 提取 base64 部分
    const base64 = img.dataUrl.split(',')[1];
    
    // 文件名：使用提供的名称或序号
    const filename = img.name || `qrcode_${i + 1}`;
    
    zip.file(`${filename}.png`, base64, { base64: true });
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  
  const timestamp = new Date().toISOString().slice(0, 10);
  downloadFile(blob, `qrcodes_${timestamp}.zip`);
};
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: 提交**

```bash
git add src/utils/zipDownload.ts
git commit -m "feat: add ZIP download utility"
```

---

### Task 13: 创建 CSVUploader 组件

**Files:**
- Create: `src/components/BatchGenerator/CSVUploader.tsx`

- [ ] **Step 1: 创建 CSV 上传组件**

```typescript
// src/components/BatchGenerator/CSVUploader.tsx

import React, { useRef } from 'react';
import { parseCSV, generateCSVTemplate, CSVRow } from '../../utils/csvParser';
import { Button } from '../ui';

interface CSVUploaderProps {
  onUpload: (rows: CSVRow[]) => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const rows = parseCSV(content);
      onUpload(rows);
    };
    reader.readAsText(file);

    // 重置 input 以允许重复上传同一文件
    e.target.value = '';
  };

  const handleDownloadTemplate = () => {
    const template = generateCSVTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr_batch_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex gap-2">
        <Button
          variant="primary"
          onClick={() => fileInputRef.current?.click()}
        >
          📁 上传 CSV
        </Button>
        <Button
          variant="outline"
          onClick={handleDownloadTemplate}
        >
          📥 下载模板
        </Button>
      </div>

      <p className="text-xs text-gray-500">
        CSV 格式：每行 "类型,内容"，如 "url,https://example.com"
      </p>
    </div>
  );
};
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: 提交**

```bash
git add src/components/BatchGenerator/CSVUploader.tsx
git commit -m "feat: add CSVUploader component"
```

---

### Task 14: 创建 BatchList 组件

**Files:**
- Create: `src/components/BatchGenerator/BatchList.tsx`

- [ ] **Step 1: 创建批量列表组件**

```typescript
// src/components/BatchGenerator/BatchList.tsx

import React from 'react';
import { ContentType } from '../../types/qr';
import { Select, Input, Button } from '../ui';

export interface BatchItem {
  id: string;
  type: ContentType;
  content: string;
}

interface BatchListProps {
  items: BatchItem[];
  onChange: (items: BatchItem[]) => void;
}

const CONTENT_TYPE_OPTIONS = [
  { value: 'text', label: '文本' },
  { value: 'url', label: '网址' },
  { value: 'email', label: '邮箱' },
  { value: 'phone', label: '电话' },
  { value: 'sms', label: '短信' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'vcard', label: '名片' },
  { value: 'event', label: '日历' },
  { value: 'geo', label: '位置' },
  { value: 'app', label: '应用' },
  { value: 'payment', label: '收款码' },
];

export const BatchList: React.FC<BatchListProps> = ({ items, onChange }) => {
  const addItem = () => {
    const newItem: BatchItem = {
      id: crypto.randomUUID(),
      type: 'url',
      content: '',
    };
    onChange([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<BatchItem>) => {
    onChange(items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.id} className="flex items-start gap-2">
          <span className="text-sm text-gray-400 w-6 pt-2">{index + 1}</span>
          
          <div className="flex-1 flex gap-2">
            <div className="w-28">
              <Select
                value={item.type}
                onChange={(e) => updateItem(item.id, { type: e.target.value as ContentType })}
                options={CONTENT_TYPE_OPTIONS}
              />
            </div>
            
            <div className="flex-1">
              <Input
                value={item.content}
                onChange={(e) => updateItem(item.id, { content: e.target.value })}
                placeholder="输入内容..."
              />
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => removeItem(item.id)}
          >
            ✕
          </Button>
        </div>
      ))}

      <Button variant="outline" onClick={addItem}>
        + 添加更多
      </Button>
    </div>
  );
};
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: 提交**

```bash
git add src/components/BatchGenerator/BatchList.tsx
git commit -m "feat: add BatchList component"
```

---

### Task 15: 创建 BatchPreview 组件

**Files:**
- Create: `src/components/BatchGenerator/BatchPreview.tsx`

- [ ] **Step 1: 创建批量预览组件**

```typescript
// src/components/BatchGenerator/BatchPreview.tsx

import React, { useRef, useEffect, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { BatchItem } from './BatchList';
import { QROptions } from '../../types/qr';
import { Button } from '../ui';

interface BatchPreviewProps {
  items: BatchItem[];
  options: QROptions;
  onDownloadAll: () => void;
}

export const BatchPreview: React.FC<BatchPreviewProps> = ({
  items,
  options,
  onDownloadAll,
}) => {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [qrCodes, setQrCodes] = useState<QRCodeStyling[]>([]);

  useEffect(() => {
    // 清理旧的 QR 码
    containerRefs.current.forEach(ref => {
      if (ref) ref.innerHTML = '';
    });

    // 创建新的 QR 码
    const codes = items.map((item, index) => {
      const qr = new QRCodeStyling({
        width: 150,
        height: 150,
        type: 'svg',
        data: item.content,
        dotsOptions: {
          color: options.dotsColor,
          type: options.dotsStyle,
        },
        backgroundOptions: {
          color: options.backgroundColor,
        },
      });

      // 渲染到容器
      setTimeout(() => {
        if (containerRefs.current[index]) {
          qr.append(containerRefs.current[index]!);
        }
      }, 0);

      return qr;
    });

    setQrCodes(codes);
  }, [items, options]);

  if (items.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        添加内容后这里会显示预览
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-3 bg-white"
          >
            <div
              ref={el => { containerRefs.current[index] = el; }}
              className="flex justify-center"
            />
            <div className="mt-2 text-xs text-gray-500 truncate text-center">
              {item.content || '(空)'}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button onClick={onDownloadAll} variant="primary">
          📦 下载全部 (ZIP)
        </Button>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: 提交**

```bash
git add src/components/BatchGenerator/BatchPreview.tsx
git commit -m "feat: add BatchPreview component"
```

---

### Task 16: 创建 BatchGenerator 主组件

**Files:**
- Create: `src/components/BatchGenerator/index.tsx`

- [ ] **Step 1: 创建批量生成主组件**

```typescript
// src/components/BatchGenerator/index.tsx

import React, { useState, useCallback } from 'react';
import { BatchList, BatchItem } from './BatchList';
import { BatchPreview } from './BatchPreview';
import { CSVUploader } from './CSVUploader';
import { StylePanel } from '../QRGenerator/StylePanel';
import { DEFAULT_OPTIONS, QROptions } from '../../types/qr';
import { parseCSV, CSVRow } from '../../utils/csvParser';
import { downloadAsZip } from '../../utils/zipDownload';
import QRCodeStyling from 'qr-code-styling';

export const BatchGenerator: React.FC = () => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [options, setOptions] = useState<QROptions>(DEFAULT_OPTIONS);

  const handleCSVUpload = useCallback((rows: CSVRow[]) => {
    const newItems: BatchItem[] = rows.map(row => ({
      id: crypto.randomUUID(),
      type: row.type as BatchItem['type'],
      content: row.content,
    }));
    setItems(prev => [...prev, ...newItems]);
  }, []);

  const handleDownloadAll = useCallback(async () => {
    if (items.length === 0) return;

    const images: { name: string; dataUrl: string }[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      const qr = new QRCodeStyling({
        width: options.size,
        height: options.size,
        type: 'canvas',
        data: item.content,
        dotsOptions: {
          color: options.dotsColor,
          type: options.dotsStyle,
        },
        backgroundOptions: {
          color: options.backgroundColor,
        },
      });

      const dataUrl = await qr.toDataURL();
      images.push({
        name: `qrcode_${i + 1}`,
        dataUrl: dataUrl as string,
      });
    }

    await downloadAsZip(images);
  }, [items, options]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：输入区 */}
        <div className="space-y-6">
          {/* CSV 上传 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">批量导入</h2>
            <CSVUploader onUpload={handleCSVUpload} />
          </div>

          {/* 手动添加 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              条目列表 ({items.length})
            </h2>
            <BatchList items={items} onChange={setItems} />
          </div>

          {/* 统一样式 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">统一样式</h2>
            <StylePanel options={options} onOptionsChange={setOptions} />
          </div>
        </div>

        {/* 右侧：预览区 */}
        <div className="lg:sticky lg:top-8 h-fit">
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">预览</h2>
            <BatchPreview
              items={items}
              options={options}
              onDownloadAll={handleDownloadAll}
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
npx tsc --noEmit
```

- [ ] **Step 3: 提交**

```bash
git add src/components/BatchGenerator/index.tsx
git commit -m "feat: add BatchGenerator main component"
```

---

### Task 17: 更新 Header 添加 Tab 切换

**Files:**
- Modify: `src/components/Layout/Header.tsx`

- [ ] **Step 1: 添加 Tab 切换到 Header**

```typescript
// 修改 src/components/Layout/Header.tsx

import React from 'react';

interface HeaderProps {
  activeTab: 'single' | 'batch';
  onTabChange: (tab: 'single' | 'batch') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">QR Code Toolbox</h1>
          </div>

          {/* Tab 切换 */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => onTabChange('single')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'single'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              单个生成
            </button>
            <button
              onClick={() => onTabChange('batch')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'batch'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              批量生成
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
```

- [ ] **Step 2: 验证编译**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: 提交**

```bash
git add src/components/Layout/Header.tsx
git commit -m "feat: add tab switching to Header"
```

---

### Task 18: 更新 App 整合所有功能

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: 更新 App.tsx 整合所有功能**

```typescript
// src/App.tsx

import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { QRGenerator } from './components/QRGenerator';
import { BatchGenerator } from './components/BatchGenerator';

function App() {
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1">
        {activeTab === 'single' ? <QRGenerator /> : <BatchGenerator />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
```

- [ ] **Step 2: 验证应用运行**

```bash
npm run dev
```

Expected: 
- 应用启动成功
- Tab 切换正常
- 单个生成和批量生成都可访问

- [ ] **Step 3: 构建验证**

```bash
npm run build
```

Expected: 构建成功

- [ ] **Step 4: 提交**

```bash
git add src/App.tsx
git commit -m "feat: integrate all v2 features in App"
```

---

### Task 19: 最终验证

- [ ] **Step 1: TypeScript 检查**

```bash
npx tsc --noEmit
```

Expected: 无错误

- [ ] **Step 2: 构建测试**

```bash
npm run build
```

Expected: 构建成功

- [ ] **Step 3: 功能验证**

手动验证：
1. 单个生成 - 收款码类型可用
2. 输入防抖 - 快速输入不卡顿
3. 历史记录 - 保存/恢复/删除正常
4. 批量生成 - CSV上传/手动添加/ZIP下载正常
5. Tab 切换 - 单个/批量切换正常

- [ ] **Step 4: 最终提交**

```bash
git add .
git commit -m "feat: complete QR Code Toolbox v2.0

- Add payment QR code type (Alipay/WeChat)
- Add input debounce (300ms)
- Add history records (localStorage, max 30)
- Add batch generation (CSV upload + manual input + ZIP download)
- Add tab navigation between single and batch modes

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## 实现检查清单

### Phase 1: 防抖 + 收款码
- [ ] Task 1: useDebounce Hook
- [ ] Task 2: 收款码类型定义
- [ ] Task 3: formatPayment 函数
- [ ] Task 4: ContentInput 防抖 + 收款码
- [ ] Task 5: StylePanel 防抖

### Phase 2: 历史记录
- [ ] Task 6: historyStorage 工具
- [ ] Task 7: HistoryItem 组件
- [ ] Task 8: History 面板组件
- [ ] Task 9: QRGenerator 集成历史记录

### Phase 3: 批量生成
- [ ] Task 10: 安装 jszip
- [ ] Task 11: csvParser 工具
- [ ] Task 12: zipDownload 工具
- [ ] Task 13: CSVUploader 组件
- [ ] Task 14: BatchList 组件
- [ ] Task 15: BatchPreview 组件
- [ ] Task 16: BatchGenerator 主组件
- [ ] Task 17: Header Tab 切换
- [ ] Task 18: App 整合
- [ ] Task 19: 最终验证
