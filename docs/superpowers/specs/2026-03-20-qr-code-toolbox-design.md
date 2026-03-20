# QR Code Toolbox 设计文档

## 概述

QR Code Toolbox 是一个纯前端的二维码生成工具网站，支持多种内容类型和丰富的自定义选项。

## 项目定位

- **类型**: 个人项目
- **目标**: 简单实用的二维码生成工具
- **部署**: 静态托管（Vercel/Netlify/GitHub Pages）

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | 前端框架 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 3.x | 样式 |
| Vite | 5.x | 构建工具 |
| qr-code-styling | 1.6.x | 二维码生成 |

## 项目结构

```
qrcode/
├── src/
│   ├── components/
│   │   ├── QRGenerator/          # 二维码生成器主组件
│   │   │   ├── index.tsx         # 主入口
│   │   │   ├── ContentInput.tsx  # 内容输入区
│   │   │   ├── StylePanel.tsx    # 样式自定义面板
│   │   │   └── QRPreview.tsx     # 二维码预览+下载
│   │   ├── Layout/
│   │   │   ├── Header.tsx        # 顶部导航
│   │   │   └── Footer.tsx        # 底部信息
│   │   └── ui/                   # 通用UI组件
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       └── ColorPicker.tsx
│   ├── hooks/
│   │   └── useQRCode.ts          # 二维码生成逻辑
│   ├── types/
│   │   └── qr.ts                 # 类型定义
│   ├── utils/
│   │   ├── qrFormatters.ts       # 各类型内容格式化
│   │   └── download.ts           # 下载处理
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## 页面布局

单页应用，左右分栏布局：

```
┌─────────────────────────────────────────────────┐
│  Header: QR Code Toolbox                        │
├─────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────────┐  │
│  │   内容输入区     │  │    二维码预览区      │  │
│  │   - 类型选择    │  │                     │  │
│  │   - 动态表单    │  │    [QR Code]        │  │
│  │                 │  │                     │  │
│  │   样式自定义面板 │  │    下载按钮         │  │
│  │   - 尺寸/颜色   │  │    [PNG][SVG][JPG]  │  │
│  │   - 样式/Logo   │  │                     │  │
│  └─────────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────┤
│  Footer                                          │
└─────────────────────────────────────────────────┘
```

**设计风格**: 简约现代
- 白色/浅灰背景
- 清晰的表单布局
- 工具感强

## 功能设计

### 内容类型（10种）

| 类型 | 表单字段 | 必填 |
|------|----------|------|
| 纯文本 | 文本内容 | 是 |
| 网址 | URL | 是 |
| 邮箱 | 邮箱地址、主题、正文 | 邮箱 |
| 电话 | 电话号码 | 是 |
| 短信 | 电话号码、短信内容 | 电话 |
| WiFi | 网络名称、密码、加密类型(WPA/WEP/无) | 名称 |
| vCard名片 | 姓名、电话、邮箱、公司、职位、地址、网站 | 姓名 |
| 日历事件 | 标题、地点、开始/结束时间、描述 | 标题、开始时间 |
| 地理位置 | 经度、纬度 | 是 |
| App下载 | iOS链接、Android链接 | 至少一个 |

### 样式自定义选项

#### 基础设置
- **尺寸**: 128-1024px（默认 300px）
- **边距**: 0-10（默认 2）
- **纠错等级**: L/M/Q/H（默认 Q）

#### 颜色设置
- **点颜色**: 纯色或渐变
  - 纯色: 单个颜色选择器
  - 渐变: 起始色 + 结束色 + 渐变类型(线性/径向)
- **背景色**: 单个颜色选择器（默认 #FFFFFF）

#### 点样式
- 方形 (square)
- 圆角 (rounded)
- 圆点 (dots)
- 优雅 (classy)
- 优雅圆角 (classy-rounded)
- 额外圆角 (extra-rounded)

#### 码眼样式
- **外框**: 方形/圆角/圆点
- **内点**: 方形/圆点

#### Logo设置
- 上传图片（PNG/JPG/SVG，最大 2MB）
- Logo大小: 10%-40%（默认 25%）
- Logo边距: 0-10（默认 2）
- Logo背景色（默认 #FFFFFF）

### 下载功能

| 格式 | 特点 | 实现方式 |
|------|------|----------|
| PNG | 通用，支持透明 | qr-code-styling 内置 |
| SVG | 矢量，可缩放 | qr-code-styling 内置 |
| JPG | 文件小 | Canvas 转换 |

**文件命名**:
- 默认: `qrcode_YYYYMMDD_HHMMSS.格式`
- 可自定义文件名

## 数据结构

### 状态定义

```typescript
type ContentType =
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

interface QRState {
  contentType: ContentType;
  contentData: Record<string, string>;
  options: {
    size: number;
    margin: number;
    errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
    dotsColor: string;
    dotsColorType: 'solid' | 'gradient';
    gradient?: {
      type: 'linear' | 'radial';
      startColor: string;
      endColor: string;
    };
    backgroundColor: string;
    dotsStyle: 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded';
    cornersSquareStyle: 'square' | 'extra-rounded' | 'dot';
    cornersDotStyle: 'square' | 'dot';
    logoImage: string | null;
    logoSize: number;
    logoMargin: number;
    logoBackgroundColor: string;
  };
}
```

### 数据流

```
用户输入 → contentData 更新 → 格式化函数 → 二维码字符串 → qr-code-styling 渲染 → 预览
    ↓
样式修改 → options 更新 → 触发重新渲染 → 实时更新预览
    ↓
点击下载 → 根据格式调用下载方法 → 保存文件
```

## 内容格式化

各类型转换为二维码字符串的格式：

### WiFi
```
WIFI:T:<encryption>;S:<ssid>;P:<password>;;
```

### vCard
```
BEGIN:VCARD
VERSION:3.0
N:<lastName>;<firstName>
FN:<firstName> <lastName>
TEL:<phone>
EMAIL:<email>
ORG:<company>
TITLE:<title>
ADR:;;<address>;;;
URL:<website>
END:VCARD
```

### 日历事件
```
BEGIN:VEVENT
SUMMARY:<title>
LOCATION:<location>
DTSTART:<startTime>
DTEND:<endTime>
DESCRIPTION:<description>
END:VEVENT
```

### 地理位置
```
geo:<lat>,<lon>
```

### 短信
```
smsto:<phone>:<message>
```

## 错误处理

### 表单验证

| 类型 | 规则 |
|------|------|
| 网址 | 必须以 http:// 或 https:// 开头 |
| 邮箱 | 标准邮箱格式 |
| 电话 | 允许数字、空格、+、-、() |
| 地理位置 | 经度 -180~180，纬度 -90~90 |

### 错误提示

- 输入框下方红色文字
- 实时验证 + 提交时验证
- 预览区显示占位符

### 边界情况

- 内容过长 → 提示提高纠错等级
- Logo过大 → 限制最大40%，提示可能影响扫描
- 图片上传失败 → 提示支持的格式和大小限制

## 依赖清单

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "qr-code-styling": "^1.6.0-rc.1"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}
```

## 构建与部署

### 构建
```bash
npm run build
```

### 部署
- Vercel: 连接 GitHub 仓库自动部署
- Netlify: 拖拽 dist 文件夹或连接仓库
- GitHub Pages: 使用 gh-pages 或 GitHub Actions

### 构建产物
- 预计大小: 100-150KB (gzip)
- 静态资源，无需服务器

## 后续扩展（可选）

1. 批量生成二维码
2. 二维码解析（扫描识别）
3. 历史记录（本地存储）
4. 更多工具（短链、图片压缩等）
5. 多语言支持
