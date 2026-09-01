import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    const inputStyle = `
      width: 100%;
      padding: 0.5rem 0.75rem;
      font-size: 1rem;
      border-radius: 0.375rem;
      border: 1px solid ${error ? '#dc2626' : '#d1d5db'};
      background: white;
      color: #1f2937;
      transition: border-color 0.2s, box-shadow 0.2s;
    `;

    const focusStyle = `
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    `;

    const style = `${inputStyle} ${props.disabled ? 'opacity: 0.5; cursor: not-allowed;' : ''}`;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          style={{ cssText: `${style} ${focusStyle}` }}
          className={className}
          {...props}
        />
        {error && (
          <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>{error}</span>
        )}
        {helperText && !error && (
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';