import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  const baseStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-6)',
    boxShadow: 'var(--shadow-sm)',
    color: 'var(--text-primary)',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    ...style
  };

  return (
    <div style={baseStyle} {...props}>
      {children}
    </div>
  );
};