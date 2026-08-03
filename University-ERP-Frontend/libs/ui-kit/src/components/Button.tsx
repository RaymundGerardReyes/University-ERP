import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', style, disabled, ...props }) => {
  let backgroundColor = 'transparent';
  let color = 'var(--brand-primary)';
  let border = '1px solid var(--border-color)';

  if (variant === 'primary') {
    backgroundColor = 'var(--brand-primary)';
    color = '#ffffff'; // Always crisp white on primary brand accent
    border = '1px solid transparent';
  } else if (variant === 'secondary') {
    backgroundColor = 'var(--bg-hover)';
    color = 'var(--text-primary)';
    border = '1px solid var(--border-color)';
  } else if (variant === 'outline') {
    border = '1px solid var(--border-color)';
    color = 'var(--text-primary)';
  }

  const baseStyle: React.CSSProperties = {
    backgroundColor,
    color,
    border,
    padding: 'var(--space-2) var(--space-4)',
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    fontSize: '0.875rem',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.15s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    ...style
  };

  return (
    <button style={baseStyle} disabled={disabled} {...props}>
      {children}
    </button>
  );
};