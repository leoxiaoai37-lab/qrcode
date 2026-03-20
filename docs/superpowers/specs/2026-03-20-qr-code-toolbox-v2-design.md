# QR Code Toolbox v2.0 设计文档

## 概述

在 v1.0 基础上新增收款码、输入防抖、历史记录、批量生成功能，保持纯前端静态部署。

## 项目定位

- **类型**: 个人项目
- **目标**: 功能完善的二维码生成工具
- **部署**: 静态托管（Vercel/Netlify/GitHub Pages）
- **架构**: 纯前端，无后端

## 新增功能概览

| 功能 | 优先级 | 复杂度 |
|------|--------|--------|
| 输入防抖 | Phase 1 | 低 |
| 收款码 | Phase 1 | 低 |
| 历史记录 | Phase 2 | 中 |
| 批量生成 | Phase 3 | 高 |

---

## 1. 收款码功能

### 支持平台
- 支付宝
- 微信

### 表单字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 收款方式 | 选择 | 是 | 支付宝/微信 |
| 收款码链接 | 文本 | 是 | 粘贴收款码链接 |
| 金额 | 数字 | 否 | 固定收款金额 |
| 备注 | 文本 | 否 | 收款说明 |

### 格式化函数

```typescript
export const formatPayment = (data: PaymentData): string => {
  if (data.platform === 'alipay') {
    return data.amount
      ? `alipays://platformapi/startapp?appId=20000067&url=${encodeURIComponent(data.link)}&amount=${data.amount}`
      : data.link;
  }
  return data.link; // 微信收款码直接使用原链接
};
```

---

## 2. 输入防抖

### 参数
- **延迟时间**: 300ms
- **位置**: ContentInput.tsx, StylePanel.tsx

### Hook 实现

```typescript
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
```

---

## 3. 历史记录功能

### 数据结构

```typescript
interface HistoryRecord {
  id: string;
  createdAt: number;
  contentType: ContentType;
  contentData: Record<string, string>;
  options: QROptions;
  previewImage: string;  // Base64
}
```

### 存储方案
- **位置**: localStorage
- **Key**: `qr-toolbox-history`
- **限制**: 最多 30 条

---

## 4. 批量生成功能

### 输入方式
1. **CSV 上传**: 解析 CSV 批量导入
2. **手动添加**: 逐条添加到列表

### 批量下载
- 使用 jszip 打包为 ZIP
- 文件名: `qrcodes_batch.zip`

---

## 5. 项目结构更新

```
src/
├── components/
│   ├── BatchGenerator/       # 批量生成（新增）
│   ├── History/              # 历史记录（新增）
│   └── QRGenerator/          # 修改：添加收款码+防抖
├── hooks/
│   ├── useDebounce.ts        # 防抖（新增）
│   └── useHistory.ts         # 历史记录（新增）
└── utils/
    ├── csvParser.ts          # CSV 解析（新增）
    ├── historyStorage.ts     # 历史存储（新增）
    └── zipDownload.ts        # ZIP 下载（新增）
```

## 6. 新增依赖

```json
{ "jszip": "^3.10.1" }
```

---

## 7. 渐进式开发计划

### Phase 1: 防抖 + 收款码（1-2天）
- useDebounce hook
- ContentInput 防抖
- StylePanel 防抖
- 收款码类型和表单

### Phase 2: 历史记录（1天）
- historyStorage 工具
- useHistory hook
- History 组件
- 集成到主界面

### Phase 3: 批量生成（2-3天）
- jszip 依赖
- csvParser 工具
- BatchGenerator 组件
- Header Tab 切换
