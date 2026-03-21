import React, { useRef, useState, useEffect } from 'react';
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
import { useDebounce } from '../../hooks/useDebounce';

interface StylePanelProps {
  options: QROptions;
  onOptionsChange: (options: QROptions) => void;
}

type TabType = 'basic' | 'color' | 'style' | 'logo';

const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
  {
    key: 'basic',
    label: '基础',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'color',
    label: '颜色',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    key: 'style',
    label: '样式',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    key: 'logo',
    label: 'Logo',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

// Helper to compare options deeply
const optionsEqual = (a: QROptions, b: QROptions): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export const StylePanel: React.FC<StylePanelProps> = ({
  options,
  onOptionsChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [localOptions, setLocalOptions] = useState(options);
  const prevOptionsRef = useRef<QROptions>(options);
  const debouncedOptions = useDebounce(localOptions, 300);

  // Sync from external options only when they actually changed (e.g., from history restore)
  useEffect(() => {
    if (!optionsEqual(prevOptionsRef.current, options)) {
      setLocalOptions(options);
      prevOptionsRef.current = options;
    }
  }, [options]);

  // Notify parent of local changes
  useEffect(() => {
    if (!optionsEqual(debouncedOptions, prevOptionsRef.current)) {
      onOptionsChange(debouncedOptions);
      prevOptionsRef.current = debouncedOptions;
    }
  }, [debouncedOptions, onOptionsChange]);

  const updateOption = <K extends keyof QROptions>(key: K, value: QROptions[K]) => {
    setLocalOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('请上传 PNG、JPG 或 SVG 格式的图片');
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('图片大小不能超过 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      updateOption('logoImage', base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    updateOption('logoImage', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const errorCorrectionOptions = [
    { value: 'L', label: 'L - 7%' },
    { value: 'M', label: 'M - 15%' },
    { value: 'Q', label: 'Q - 25%' },
    { value: 'H', label: 'H - 30%' },
  ];

  const colorTypeOptions = [
    { value: 'solid', label: '纯色' },
    { value: 'gradient', label: '渐变' },
  ];

  const gradientTypeOptions = [
    { value: 'linear', label: '线性渐变' },
    { value: 'radial', label: '径向渐变' },
  ];

  const dotsStyleOptions: { value: DotsStyle; label: string }[] = [
    { value: 'square', label: '方形 (Square)' },
    { value: 'rounded', label: '圆角 (Rounded)' },
    { value: 'dots', label: '圆点 (Dots)' },
    { value: 'classy', label: '优雅 (Classy)' },
    { value: 'classy-rounded', label: '优雅圆角 (Classy Rounded)' },
    { value: 'extra-rounded', label: '大圆角 (Extra Rounded)' },
  ];

  const cornersStyleOptions: { value: CornersStyle; label: string }[] = [
    { value: 'square', label: '方形 (Square)' },
    { value: 'extra-rounded', label: '圆角 (Extra Rounded)' },
    { value: 'dot', label: '圆形 (Dot)' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-4">
            <Slider
              label="尺寸"
              value={localOptions.size}
              min={128}
              max={1024}
              step={8}
              unit="px"
              onChange={(value) => updateOption('size', value)}
            />
            <Slider
              label="边距"
              value={localOptions.margin}
              min={0}
              max={10}
              unit=""
              onChange={(value) => updateOption('margin', value)}
            />
            <Select
              label="容错级别"
              value={localOptions.errorCorrectionLevel}
              options={errorCorrectionOptions}
              onChange={(e) => updateOption('errorCorrectionLevel', e.target.value as ErrorCorrectionLevel)}
            />
          </div>
        );

      case 'color':
        return (
          <div className="space-y-4">
            <Select
              label="颜色类型"
              value={localOptions.dotsColorType}
              options={colorTypeOptions}
              onChange={(e) => updateOption('dotsColorType', e.target.value as 'solid' | 'gradient')}
            />

            {localOptions.dotsColorType === 'solid' ? (
              <ColorPicker
                label="点颜色"
                value={localOptions.dotsColor}
                onChange={(value) => updateOption('dotsColor', value)}
              />
            ) : (
              <>
                <Select
                  label="渐变类型"
                  value={localOptions.gradient?.type || 'linear'}
                  options={gradientTypeOptions}
                  onChange={(e) =>
                    updateOption('gradient', {
                      type: e.target.value as GradientType,
                      startColor: localOptions.gradient?.startColor || localOptions.dotsColor,
                      endColor: localOptions.gradient?.endColor || '#000000',
                    })
                  }
                />
                <ColorPicker
                  label="起始颜色"
                  value={localOptions.gradient?.startColor || localOptions.dotsColor}
                  onChange={(value) =>
                    updateOption('gradient', {
                      type: localOptions.gradient?.type || 'linear',
                      startColor: value,
                      endColor: localOptions.gradient?.endColor || '#000000',
                    })
                  }
                />
                <ColorPicker
                  label="结束颜色"
                  value={localOptions.gradient?.endColor || '#000000'}
                  onChange={(value) =>
                    updateOption('gradient', {
                      type: localOptions.gradient?.type || 'linear',
                      startColor: localOptions.gradient?.startColor || localOptions.dotsColor,
                      endColor: value,
                    })
                  }
                />
              </>
            )}

            <ColorPicker
              label="背景颜色"
              value={localOptions.backgroundColor}
              onChange={(value) => updateOption('backgroundColor', value)}
            />
          </div>
        );

      case 'style':
        return (
          <div className="space-y-4">
            <Select
              label="点样式"
              value={localOptions.dotsStyle}
              options={dotsStyleOptions}
              onChange={(e) => updateOption('dotsStyle', e.target.value as DotsStyle)}
            />
            <Select
              label="外码眼样式"
              value={localOptions.cornersSquareStyle}
              options={cornersStyleOptions}
              onChange={(e) => updateOption('cornersSquareStyle', e.target.value as CornersStyle)}
            />
            <Select
              label="内码眼样式"
              value={localOptions.cornersDotStyle}
              options={cornersStyleOptions}
              onChange={(e) => updateOption('cornersDotStyle', e.target.value as CornersStyle)}
            />
          </div>
        );

      case 'logo':
        return (
          <div className="space-y-4">
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
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  上传 Logo
                </span>
              </Button>
              {localOptions.logoImage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveLogo}
                >
                  移除
                </Button>
              )}
            </div>

            {localOptions.logoImage && (
              <>
                <p className="text-xs text-brand-text-muted">
                  支持 PNG、JPG、SVG，最大 2MB
                </p>
                <div className="flex items-center gap-3 p-3 glass-card-light rounded-xl">
                  <img
                    src={localOptions.logoImage}
                    alt="Logo 预览"
                    className="w-12 h-12 object-contain rounded-lg"
                  />
                  <span className="text-xs text-brand-text-secondary">已上传</span>
                </div>
              </>
            )}

            <Slider
              label="Logo 大小"
              value={localOptions.logoSize}
              min={10}
              max={40}
              unit="%"
              onChange={(value) => updateOption('logoSize', value)}
            />

            <Slider
              label="Logo 边距"
              value={localOptions.logoMargin}
              min={0}
              max={10}
              unit=""
              onChange={(value) => updateOption('logoMargin', value)}
            />

            <ColorPicker
              label="Logo 背景色"
              value={localOptions.logoBackgroundColor}
              onChange={(value) => updateOption('logoBackgroundColor', value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex gap-1 p-1 bg-brand-bg-tertiary/50 rounded-xl mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
              text-sm font-medium transition-all duration-200
              ${activeTab === tab.key
                ? 'bg-white text-brand-accent shadow-sm'
                : 'text-brand-text-muted hover:text-brand-text-primary hover:bg-brand-bg-tertiary/50'
              }
            `}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-2">
        {renderTabContent()}
      </div>
    </div>
  );
};
