import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', hover = false, padding = 'md' }: CardProps) {
  const paddingStyles = {
    none: 'padding: 0;',
    sm: 'padding: 0.75rem;',
    md: 'padding: 1rem;',
    lg: 'padding: 1.5rem;',
  };

  const style = `
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border: 1px solid #e2e8f0;
    ${hover ? 'transition: box-shadow 0.2s ease, transform 0.2s ease;' : ''}
    ${hover ? 'cursor: pointer;' : ''}
  `;

  return (
    <div
      style={{ cssText: `${style} ${paddingStyles[padding]}` }}
      className={className}
    >
      {children}
    </div>
  );
}