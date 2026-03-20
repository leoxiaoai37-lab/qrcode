import React, { useRef, useState } from 'react';
import {
  QROptions,
  DotsStyle,
  CornersStyle,
  ErrorCorrectionLevel,
  GradientType,
} from '../../types/qr';
import { Slider } from '../ui/Slider';
import { Select } from '../ui/Select';
import { ColorPicker } from '../ui/ColorPicker';
import { Button } from '../ui/Button';

interface StylePanelProps {
  options: QROptions;
  onOptionsChange: (options: QROptions) => void;
}

// 折叠面板组件
interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  defaultOpen = true,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-gray-800">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 py-4 space-y-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

export const StylePanel: React.FC<StylePanelProps> = ({
  options,
  onOptionsChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 更新单个选项
  const updateOption = <K extends keyof QROptions>(key: K, value: QROptions[K]) => {
    onOptionsChange({ ...options, [key]: value });
  };

  // 处理 Logo 上传
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('请上传 PNG、JPG 或 SVG 格式的图片');
      return;
    }

    // 检查文件大小（2MB）
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('图片大小不能超过 2MB');
      return;
    }

    // 读取文件并转为 base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      updateOption('logoImage', base64);
    };
    reader.readAsDataURL(file);
  };

  // 移除 Logo
  const handleRemoveLogo = () => {
    updateOption('logoImage', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 错误校正级别选项
  const errorCorrectionOptions = [
    { value: 'L', label: 'L - 7%' },
    { value: 'M', label: 'M - 15%' },
    { value: 'Q', label: 'Q - 25%' },
    { value: 'H', label: 'H - 30%' },
  ];

  // 颜色类型选项
  const colorTypeOptions = [
    { value: 'solid', label: '纯色' },
    { value: 'gradient', label: '渐变' },
  ];

  // 渐变类型选项
  const gradientTypeOptions = [
    { value: 'linear', label: '线性渐变' },
    { value: 'radial', label: '径向渐变' },
  ];

  // 点样式选项
  const dotsStyleOptions: { value: DotsStyle; label: string }[] = [
    { value: 'square', label: '方形 (Square)' },
    { value: 'rounded', label: '圆角 (Rounded)' },
    { value: 'dots', label: '圆点 (Dots)' },
    { value: 'classy', label: '优雅 (Classy)' },
    { value: 'classy-rounded', label: '优雅圆角 (Classy Rounded)' },
    { value: 'extra-rounded', label: '大圆角 (Extra Rounded)' },
  ];

  // 码眼样式选项
  const cornersStyleOptions: { value: CornersStyle; label: string }[] = [
    { value: 'square', label: '方形 (Square)' },
    { value: 'extra-rounded', label: '圆角 (Extra Rounded)' },
    { value: 'dot', label: '圆形 (Dot)' },
  ];

  return (
    <div className="w-full space-y-1">
      {/* 基础设置 */}
      <CollapsibleSection title="基础设置" defaultOpen={true}>
        <Slider
          label="尺寸"
          value={options.size}
          min={128}
          max={1024}
          step={8}
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
          label="容错级别"
          value={options.errorCorrectionLevel}
          options={errorCorrectionOptions}
          onChange={(e) => updateOption('errorCorrectionLevel', e.target.value as ErrorCorrectionLevel)}
        />
      </CollapsibleSection>

      {/* 颜色设置 */}
      <CollapsibleSection title="颜色设置" defaultOpen={true}>
        <Select
          label="颜色类型"
          value={options.dotsColorType}
          options={colorTypeOptions}
          onChange={(e) => updateOption('dotsColorType', e.target.value as 'solid' | 'gradient')}
        />

        {options.dotsColorType === 'solid' ? (
          <ColorPicker
            label="点颜色"
            value={options.dotsColor}
            onChange={(value) => updateOption('dotsColor', value)}
          />
        ) : (
          <>
            <Select
              label="渐变类型"
              value={options.gradient?.type || 'linear'}
              options={gradientTypeOptions}
              onChange={(e) =>
                updateOption('gradient', {
                  type: e.target.value as GradientType,
                  startColor: options.gradient?.startColor || options.dotsColor,
                  endColor: options.gradient?.endColor || '#000000',
                })
              }
            />
            <ColorPicker
              label="起始颜色"
              value={options.gradient?.startColor || options.dotsColor}
              onChange={(value) =>
                updateOption('gradient', {
                  type: options.gradient?.type || 'linear',
                  startColor: value,
                  endColor: options.gradient?.endColor || '#000000',
                })
              }
            />
            <ColorPicker
              label="结束颜色"
              value={options.gradient?.endColor || '#000000'}
              onChange={(value) =>
                updateOption('gradient', {
                  type: options.gradient?.type || 'linear',
                  startColor: options.gradient?.startColor || options.dotsColor,
                  endColor: value,
                })
              }
            />
          </>
        )}

        <ColorPicker
          label="背景颜色"
          value={options.backgroundColor}
          onChange={(value) => updateOption('backgroundColor', value)}
        />
      </CollapsibleSection>

      {/* 点样式 */}
      <CollapsibleSection title="点样式" defaultOpen={false}>
        <Select
          label="点样式"
          value={options.dotsStyle}
          options={dotsStyleOptions}
          onChange={(e) => updateOption('dotsStyle', e.target.value as DotsStyle)}
        />
      </CollapsibleSection>

      {/* 码眼样式 */}
      <CollapsibleSection title="码眼样式" defaultOpen={false}>
        <Select
          label="外码眼样式"
          value={options.cornersSquareStyle}
          options={cornersStyleOptions}
          onChange={(e) => updateOption('cornersSquareStyle', e.target.value as CornersStyle)}
        />
        <Select
          label="内码眼样式"
          value={options.cornersDotStyle}
          options={cornersStyleOptions}
          onChange={(e) => updateOption('cornersDotStyle', e.target.value as CornersStyle)}
        />
      </CollapsibleSection>

      {/* Logo 设置 */}
      <CollapsibleSection title="Logo 设置" defaultOpen={false}>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              上传 Logo
            </Button>
            {options.logoImage && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRemoveLogo}
              >
                移除
              </Button>
            )}
          </div>

          {options.logoImage && (
            <>
              <p className="text-xs text-gray-500">
                支持 PNG、JPG、SVG，最大 2MB
              </p>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <img
                  src={options.logoImage}
                  alt="Logo 预览"
                  className="w-12 h-12 object-contain rounded"
                />
                <span className="text-xs text-gray-600">已上传</span>
              </div>
            </>
          )}

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
            label="Logo 背景色"
            value={options.logoBackgroundColor}
            onChange={(value) => updateOption('logoBackgroundColor', value)}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
};
