import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `
    relative font-medium rounded-xl
    transition-all duration-300 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg-primary
    disabled:opacity-50 disabled:cursor-not-allowed
    overflow-hidden
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-brand-accent to-cyan-400
      text-brand-bg-primary font-semibold
      shadow-glow
      hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.6)]
      hover:scale-[1.02]
      active:scale-[0.98]
    `,
    secondary: `
      bg-brand-bg-elevated
      text-brand-text-primary
      border border-brand-border
      hover:bg-brand-bg-tertiary hover:border-brand-border-hover
      active:scale-[0.98]
    `,
    outline: `
      bg-transparent
      text-brand-accent
      border-2 border-brand-accent/50
      hover:bg-brand-accent-muted hover:border-brand-accent
      active:scale-[0.98]
    `,
    ghost: `
      bg-transparent
      text-brand-text-secondary
      hover:text-brand-text-primary hover:bg-brand-bg-tertiary
      active:scale-[0.98]
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
