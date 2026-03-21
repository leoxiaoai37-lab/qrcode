import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-medium text-brand-text-secondary">{label}</label>
        <span className="text-sm font-mono text-brand-accent bg-brand-accent-muted px-2 py-0.5 rounded-md">
          {value}{unit}
        </span>
      </div>
      <div className="relative h-2">
        {/* Track background */}
        <div className="absolute inset-0 bg-brand-bg-elevated rounded-full" />
        {/* Track fill */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-accent to-cyan-400 rounded-full transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />
        {/* Glow effect */}
        <div
          className="absolute inset-y-0 left-0 rounded-full opacity-50 blur-sm"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(to right, var(--color-accent), #22d3ee)'
          }}
        />
        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="
            absolute inset-0 w-full h-full
            appearance-none cursor-pointer
            bg-transparent
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-brand-accent/30
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-brand-accent
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:hover:shadow-brand-accent/50
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-brand-accent
            [&::-moz-range-thumb]:cursor-pointer
          "
        />
      </div>
    </div>
  );
};
