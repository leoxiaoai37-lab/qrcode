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
    <div className="flex items-center gap-3">
      <div className="relative group">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-10 h-10 rounded-lg cursor-pointer
            border-2 border-brand-border
            bg-transparent
            transition-all duration-200
            hover:border-brand-accent/50
            hover:scale-105
          "
        />
        <div
          className="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ boxShadow: `0 0 15px -3px ${value}` }}
        />
      </div>
      <span className="text-sm text-brand-text-secondary min-w-[80px]">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          flex-1 px-3 py-1.5
          bg-brand-bg-tertiary/50
          border border-brand-border
          rounded-lg
          text-xs font-mono text-brand-text-primary
          uppercase
          transition-all duration-200
          hover:border-brand-border-hover
          focus:outline-none focus:border-brand-accent/50 focus:ring-2 focus:ring-brand-accent/20
        "
        placeholder="#000000"
      />
    </div>
  );
};
