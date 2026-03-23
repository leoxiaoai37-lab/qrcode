# QR Code Toolbox

一个功能强大的纯前端二维码生成工具，支持多种内容类型和丰富的样式自定义。

## 功能特性

### 多种内容类型支持

| 类型 | 说明 |
|------|------|
| 文本 | 任意文本内容 |
| 网址 | URL链接 |
| 邮箱 | 邮件地址（支持主题和正文） |
| 电话 | 电话号码 |
| 短信 | SMS消息（含收件人和内容） |
| WiFi | WiFi连接信息（SSID、密码、加密方式） |
| vCard | 电子名片（姓名、电话、邮箱、公司等） |
| 日历事件 | 日历事件（标题、时间、地点） |
| 地理位置 | GPS坐标 |
| 应用链接 | iOS/Android应用链接 |
| 收款码 | 支付宝/微信收款码 |

### 样式自定义

- **尺寸调整**: 支持自定义二维码大小
- **颜色设置**: 纯色/渐变色填充
- **点阵样式**: square、rounded、dots、classy、classy-rounded、extra-rounded
- **角标样式**: square、extra-rounded、dot
- **Logo嵌入**: 支持上传自定义Logo
- **容错级别**: L、M、Q、H 四档可选

### 批量功能

- CSV文件上传批量生成
- 批量导出为ZIP压缩包
- 历史记录本地存储

## 技术栈

- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Tailwind CSS 3** - 样式方案
- **Vite 6** - 构建工具
- **qr-code-styling** - 二维码生成核心库
- **JSZip** - 批量下载打包

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 项目结构

```
src/
├── components/
│   ├── QRGenerator/        # 单个二维码生成
│   │   ├── index.tsx       # 主组件
│   │   ├── ContentInput.tsx    # 内容输入表单
│   │   ├── StylePanel.tsx      # 样式配置面板
│   │   └── QRPreview.tsx       # 预览和下载
│   ├── BatchGenerator/     # 批量生成
│   │   ├── index.tsx
│   │   ├── CSVUploader.tsx     # CSV上传
│   │   ├── BatchList.tsx       # 批量列表
│   │   └── BatchPreview.tsx    # 批量预览
│   ├── History/            # 历史记录
│   ├── Layout/             # 布局组件
│   └── ui/                 # 通用UI组件
├── hooks/
│   ├── useQRCode.ts        # 二维码生成Hook
│   └── useDebounce.ts      # 防抖Hook
├── types/
│   └── qr.ts               # 类型定义
└── utils/
    ├── qrFormatters.ts     # 内容格式化
    ├── download.ts         # 下载工具
    ├── csvParser.ts        # CSV解析
    ├── zipDownload.ts      # ZIP打包
    └── historyStorage.ts   # 历史存储
```

## 导出格式

支持以下图片格式导出：

- PNG
- SVG
- JPEG

## 许可证

MIT
