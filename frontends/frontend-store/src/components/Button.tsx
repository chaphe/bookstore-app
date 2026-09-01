import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-weight: 500;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
  `;

  const variantStyles = {
    primary: `
      background-color: #2563eb;
      color: white;
    `,
    secondary: `
      background-color: #64748b;
      color: white;
    `,
    danger: `
      background-color: #dc2626;
      color: white;
    `,
    ghost: `
      background-color: transparent;
      color: #2563eb;
    `,
  };

  const sizeStyles = {
    sm: 'padding: 0.375rem 0.75rem; font-size: 0.875rem;',
    md: 'padding: 0.5rem 1rem; font-size: 1rem;',
    lg: 'padding: 0.75rem 1.5rem; font-size: 1.125rem;',
  };

  const hoverStyles = {
    primary: 'hover:background-color:#1d4ed8',
    secondary: 'hover:background-color:#475569',
    danger: 'hover:background-color:#b91c1c',
    ghost: 'hover:background-color:#eff6ff',
  };

  const style = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${hoverStyles[variant]}`;

  const disabledStyle = disabled || loading ? 'opacity: 0.6; cursor: not-allowed;' : '';

  return (
    <button
      style={{ cssText: `${style} ${disabledStyle}` }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="31.4 31.4"
          />
        </svg>
      )}
      {children}
    </button>
  );
}