import React, { useState, useEffect, useRef } from 'react';
import { ContentType, ContentTypeInfo, FieldConfig } from '../../types/qr';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useDebounce } from '../../hooks/useDebounce';

interface ContentInputProps {
  contentType: ContentType;
  contentData: Record<string, string>;
  onContentTypeChange: (type: ContentType) => void;
  onContentDataChange: (data: Record<string, string>) => void;
}

// SVG Icons for content types
const ContentTypeIcons: Record<string, React.ReactNode> = {
  text: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h10M7 16h6" />
      <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="1.5" />
    </svg>
  ),
  url: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  sms: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  wifi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01M5.636 13.636a9 9 0 0112.728 0M2 10.586a12.5 12.5 0 0120 0" />
    </svg>
  ),
  vcard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  event: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  ),
  geo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  app: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01" />
    </svg>
  ),
  payment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// 内容类型配置信息
const CONTENT_TYPES: ContentTypeInfo[] = [
  {
    type: 'text',
    label: '文本',
    icon: 'text',
    fields: [
      { name: 'text', label: '文本内容', type: 'textarea', required: true, placeholder: '输入要编码的文本...' },
    ],
  },
  {
    type: 'url',
    label: '网址',
    icon: 'url',
    fields: [
      { name: 'url', label: '网址', type: 'url', required: true, placeholder: 'https://example.com' },
    ],
  },
  {
    type: 'email',
    label: '邮箱',
    icon: 'email',
    fields: [
      { name: 'email', label: '邮箱地址', type: 'email', required: true, placeholder: 'example@email.com' },
      { name: 'subject', label: '主题', type: 'text', required: false, placeholder: '邮件主题' },
      { name: 'body', label: '正文', type: 'textarea', required: false, placeholder: '邮件内容...' },
    ],
  },
  {
    type: 'phone',
    label: '电话',
    icon: 'phone',
    fields: [
      { name: 'phone', label: '电话号码', type: 'tel', required: true, placeholder: '+86 138 0000 0000' },
    ],
  },
  {
    type: 'sms',
    label: '短信',
    icon: 'sms',
    fields: [
      { name: 'phone', label: '电话号码', type: 'tel', required: true, placeholder: '+86 138 0000 0000' },
      { name: 'message', label: '短信内容', type: 'textarea', required: false, placeholder: '输入短信内容...' },
    ],
  },
  {
    type: 'wifi',
    label: 'WiFi',
    icon: 'wifi',
    fields: [
      { name: 'ssid', label: '网络名称 (SSID)', type: 'text', required: true, placeholder: 'WiFi 名称' },
      { name: 'password', label: '密码', type: 'text', required: false, placeholder: 'WiFi 密码' },
      {
        name: 'encryption',
        label: '加密方式',
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
    icon: 'vcard',
    fields: [
      { name: 'firstName', label: '名', type: 'text', required: true, placeholder: '三' },
      { name: 'lastName', label: '姓', type: 'text', required: true, placeholder: '张' },
      { name: 'phone', label: '电话', type: 'tel', required: false, placeholder: '+86 138 0000 0000' },
      { name: 'email', label: '邮箱', type: 'email', required: false, placeholder: 'example@email.com' },
      { name: 'company', label: '公司', type: 'text', required: false, placeholder: '公司名称' },
      { name: 'title', label: '职位', type: 'text', required: false, placeholder: '职位名称' },
      { name: 'address', label: '地址', type: 'text', required: false, placeholder: '详细地址' },
      { name: 'website', label: '网站', type: 'url', required: false, placeholder: 'https://example.com' },
    ],
  },
  {
    type: 'event',
    label: '日历',
    icon: 'event',
    fields: [
      { name: 'title', label: '事件标题', type: 'text', required: true, placeholder: '会议/活动名称' },
      { name: 'location', label: '地点', type: 'text', required: false, placeholder: '事件地点' },
      { name: 'startTime', label: '开始时间', type: 'text', required: true, placeholder: '2024-01-01 10:00' },
      { name: 'endTime', label: '结束时间', type: 'text', required: false, placeholder: '2024-01-01 12:00' },
      { name: 'description', label: '描述', type: 'textarea', required: false, placeholder: '事件描述...' },
    ],
  },
  {
    type: 'geo',
    label: '位置',
    icon: 'geo',
    fields: [
      { name: 'lat', label: '纬度', type: 'text', required: true, placeholder: '39.9042' },
      { name: 'lon', label: '经度', type: 'text', required: true, placeholder: '116.4074' },
    ],
  },
  {
    type: 'app',
    label: '应用',
    icon: 'app',
    fields: [
      { name: 'iosUrl', label: 'iOS 链接', type: 'url', required: false, placeholder: 'https://apps.apple.com/...' },
      { name: 'androidUrl', label: 'Android 链接', type: 'url', required: false, placeholder: 'https://play.google.com/...' },
    ],
  },
  {
    type: 'payment',
    label: '收款码',
    icon: 'payment',
    fields: [
      {
        name: 'platform',
        label: '收款方式',
        type: 'select',
        required: true,
        options: [
          { value: 'alipay', label: '支付宝' },
          { value: 'wechat', label: '微信' },
        ],
      },
      { name: 'link', label: '收款码链接', type: 'text', required: true, placeholder: '粘贴收款码链接' },
      { name: 'amount', label: '金额（可选）', type: 'number', required: false, placeholder: '固定金额' },
      { name: 'note', label: '备注（可选）', type: 'text', required: false, placeholder: '收款说明' },
    ],
  },
];

export const ContentInput: React.FC<ContentInputProps> = ({
  contentType,
  contentData,
  onContentTypeChange,
  onContentDataChange,
}) => {
  const [localData, setLocalData] = useState(contentData);
  const debouncedData = useDebounce(localData, 300);
  const prevDataRef = useRef(debouncedData);

  useEffect(() => {
    // Only call onContentDataChange if data actually changed
    if (JSON.stringify(debouncedData) !== JSON.stringify(prevDataRef.current)) {
      onContentDataChange(debouncedData);
      prevDataRef.current = debouncedData;
    }
  }, [debouncedData, onContentDataChange]);

  useEffect(() => {
    setLocalData({});
    prevDataRef.current = {};
  }, [contentType]);

  const currentTypeConfig = CONTENT_TYPES.find((t) => t.type === contentType) || CONTENT_TYPES[0];

  const handleTypeClick = (type: ContentType) => {
    onContentTypeChange(type);
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setLocalData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const renderField = (field: FieldConfig) => {
    const value = localData[field.name] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="w-full">
            <label className="block text-sm font-medium text-brand-text-secondary mb-2">
              {field.label}
              {field.required && <span className="text-brand-accent ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className="
                w-full px-4 py-3
                bg-white
                border border-brand-border
                rounded-xl
                text-sm text-gray-800
                placeholder:text-gray-400
                resize-none
                transition-all duration-200
                hover:border-brand-border-hover
                focus:outline-none focus:border-brand-accent/50 focus:ring-2 focus:ring-brand-accent/20
              "
            />
          </div>
        );

      case 'select':
        return (
          <Select
            key={field.name}
            label={field.label + (field.required ? ' *' : '')}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            options={field.options || []}
          />
        );

      default:
        return (
          <Input
            key={field.name}
            label={field.label + (field.required ? ' *' : '')}
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 内容类型选择器 */}
      <div>
        <h3 className="text-sm font-medium text-brand-text-secondary mb-4">选择内容类型</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {CONTENT_TYPES.map((typeInfo, index) => (
            <button
              key={typeInfo.type}
              onClick={() => handleTypeClick(typeInfo.type)}
              className={`
                group relative flex flex-col items-center justify-center p-3 rounded-xl
                border transition-all duration-300
                animate-fade-in
                ${contentType === typeInfo.type
                  ? 'border-brand-accent/50 bg-brand-accent-muted text-brand-accent shadow-glow'
                  : 'border-brand-border bg-brand-bg-tertiary/30 text-brand-text-secondary hover:border-brand-border-hover hover:text-brand-text-primary hover:bg-brand-bg-tertiary/50'
                }
              `}
              style={{ animationDelay: `${index * 30}ms` }}
              title={typeInfo.label}
            >
              <div className="transition-transform duration-200 group-hover:scale-110">
                {ContentTypeIcons[typeInfo.icon]}
              </div>
              <span className="text-[10px] font-medium mt-1.5 tracking-wide">{typeInfo.label}</span>
              {contentType === typeInfo.type && (
                <div className="absolute inset-0 rounded-xl border border-brand-accent/30 animate-pulse-glow" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 动态表单字段 */}
      <div className="space-y-4 pt-4 border-t border-brand-border">
        <h3 className="text-sm font-medium text-brand-text-primary flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
          {currentTypeConfig.label}信息
        </h3>
        <div className="space-y-4">
          {currentTypeConfig.fields.map(renderField)}
        </div>
      </div>
    </div>
  );
};
