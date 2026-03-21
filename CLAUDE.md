# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

QR Code Toolbox - 纯前端二维码生成工具，支持多种内容类型（文本、网址、邮箱、电话、WiFi、vCard等）和丰富的样式自定义。

## 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 代码检查
npm run lint

# 预览构建结果
npm run preview
```

## 技术栈

- React 18 + TypeScript
- Tailwind CSS 3
- Vite 6
- qr-code-styling（二维码生成核心库）
- JSZip（批量下载打包）

## 架构

```
src/
├── components/
│   ├── QRGenerator/     # 单个二维码生成
│   │   ├── index.tsx    # 主组件，管理 QRState
│   │   ├── ContentInput.tsx  # 内容类型选择 + 动态表单
│   │   ├── StylePanel.tsx    # 样式配置面板
│   │   └── QRPreview.tsx     # 预览 + 下载
│   ├── BatchGenerator/  # 批量生成（CSV上传 → 批量导出ZIP）
│   ├── History/         # 本地存储历史记录
│   ├── Layout/          # Header + Footer
│   └── ui/              # Button, Input, Select, ColorPicker, Slider
├── hooks/
│   ├── useQRCode.ts     # 封装 qr-code-styling，返回 ref + download
│   └── useDebounce.ts
├── types/
│   └── qr.ts            # ContentType, QROptions, QRState, DEFAULT_OPTIONS
└── utils/
    ├── qrFormatters.ts  # 各类型 → 二维码字符串格式化
    ├── download.ts      # 下载工具函数
    ├── csvParser.ts     # CSV解析
    ├── zipDownload.ts   # ZIP打包下载
    └── historyStorage.ts # localStorage 历史记录
```

## 核心数据流

1. **内容输入**: 用户选择 ContentType → 动态渲染表单 → 更新 contentData
2. **格式化**: qrFormatters 根据 ContentType 将 contentData 转为标准二维码字符串格式
3. **渲染**: useQRCode hook 将格式化内容 + 样式选项传给 qr-code-styling
4. **下载**: 调用 qrCode.download() 支持 PNG/SVG/JPEG

## 状态结构

```typescript
interface QRState {
  contentType: ContentType;  // 11种类型
  contentData: Record<string, string>;
  options: QROptions;  // 尺寸、颜色、样式、Logo等
}
```

## 内容类型

text, url, email, phone, sms, wifi, vcard, event, geo, app, payment（收款码）

## 组件约定

- 组件使用 `React.FC` + props interface
- 样式使用 Tailwind CSS
- 表单组件受控模式，父组件管理状态
