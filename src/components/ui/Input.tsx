import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-brand-text-secondary mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5
          bg-white
          border border-brand-border
          rounded-xl
          text-sm text-gray-800
          placeholder:text-gray-400
          transition-all duration-200
          hover:border-brand-border-hover
          focus:outline-none focus:border-brand-accent/50 focus:ring-2 focus:ring-brand-accent/20
          ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};
