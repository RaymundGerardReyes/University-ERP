import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  colorScheme?: 'success' | 'warning' | 'info' | 'danger' | 'default';
  variant?: 'success' | 'warning' | 'info' | 'danger' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ children, colorScheme, variant, style, ...props }) => {
  let background = 'var(--bg-hover)';
  let color = 'var(--text-secondary)';
  
  const effectiveScheme = variant || colorScheme || 'default';

  if (effectiveScheme === 'success') {
    background = 'var(--success-bg)';
    color = 'var(--success-text)';
  } else if (effectiveScheme === 'warning') {
    background = 'var(--warning-bg)';
    color = 'var(--warning-text)';
  } else if (effectiveScheme === 'info') {
    background = 'var(--info-bg)';
    color = 'var(--info-text)';
  } else if (effectiveScheme === 'danger') {
    background = 'var(--danger-bg)';
    color = 'var(--danger-text)';
  }

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: 'var(--space-1) var(--space-2)',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    fontWeight: 600,
    backgroundColor: background,
    color: color,
    letterSpacing: '0.01em',
    ...style
  };

  return (
    <span style={baseStyle} {...props}>
      {children}
    </span>
  );
};