import React from 'react';
import { ContentType, ContentTypeInfo, FieldConfig } from '../../types/qr';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface ContentInputProps {
  contentType: ContentType;
  contentData: Record<string, string>;
  onContentTypeChange: (type: ContentType) => void;
  onContentDataChange: (data: Record<string, string>) => void;
}

// 内容类型配置信息
const CONTENT_TYPES: ContentTypeInfo[] = [
  {
    type: 'text',
    label: '文本',
    icon: '📝',
    fields: [
      { name: 'text', label: '文本内容', type: 'textarea', required: true, placeholder: '输入要编码的文本...' },
    ],
  },
  {
    type: 'url',
    label: '网址',
    icon: '🔗',
    fields: [
      { name: 'url', label: '网址', type: 'url', required: true, placeholder: 'https://example.com' },
    ],
  },
  {
    type: 'email',
    label: '邮箱',
    icon: '📧',
    fields: [
      { name: 'email', label: '邮箱地址', type: 'email', required: true, placeholder: 'example@email.com' },
      { name: 'subject', label: '主题', type: 'text', required: false, placeholder: '邮件主题' },
      { name: 'body', label: '正文', type: 'textarea', required: false, placeholder: '邮件内容...' },
    ],
  },
  {
    type: 'phone',
    label: '电话',
    icon: '📞',
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
      { name: 'message', label: '短信内容', type: 'textarea', required: false, placeholder: '输入短信内容...' },
    ],
  },
  {
    type: 'wifi',
    label: 'WiFi',
    icon: '📶',
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
    icon: '👤',
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
    icon: '📅',
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
    icon: '📍',
    fields: [
      { name: 'lat', label: '纬度', type: 'text', required: true, placeholder: '39.9042' },
      { name: 'lon', label: '经度', type: 'text', required: true, placeholder: '116.4074' },
    ],
  },
  {
    type: 'app',
    label: '应用',
    icon: '📱',
    fields: [
      { name: 'iosUrl', label: 'iOS 链接', type: 'url', required: false, placeholder: 'https://apps.apple.com/...' },
      { name: 'androidUrl', label: 'Android 链接', type: 'url', required: false, placeholder: 'https://play.google.com/...' },
    ],
  },
];

export const ContentInput: React.FC<ContentInputProps> = ({
  contentType,
  contentData,
  onContentTypeChange,
  onContentDataChange,
}) => {
  // 获取当前内容类型的配置
  const currentTypeConfig = CONTENT_TYPES.find((t) => t.type === contentType) || CONTENT_TYPES[0];

  // 处理类型切换
  const handleTypeClick = (type: ContentType) => {
    onContentTypeChange(type);
  };

  // 处理字段值变化
  const handleFieldChange = (fieldName: string, value: string) => {
    onContentDataChange({
      ...contentData,
      [fieldName]: value,
    });
  };

  // 渲染单个字段
  const renderField = (field: FieldConfig) => {
    const value = contentData[field.name] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
        <h3 className="text-sm font-medium text-gray-700 mb-3">选择内容类型</h3>
        <div className="grid grid-cols-5 gap-2">
          {CONTENT_TYPES.map((typeInfo) => (
            <button
              key={typeInfo.type}
              onClick={() => handleTypeClick(typeInfo.type)}
              className={`
                flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                ${
                  contentType === typeInfo.type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
              title={typeInfo.label}
            >
              <span className="text-2xl mb-1">{typeInfo.icon}</span>
              <span className="text-xs font-medium">{typeInfo.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 动态表单字段 */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">
          {currentTypeConfig.label}信息
        </h3>
        <div className="space-y-4">
          {currentTypeConfig.fields.map(renderField)}
        </div>
      </div>
    </div>
  );
};
