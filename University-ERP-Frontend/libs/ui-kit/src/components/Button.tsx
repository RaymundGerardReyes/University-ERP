import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', style, ...props }) => {
  let background = 'transparent';
  let color = 'white';
  let border = 'none';

  if (variant === 'primary') {
    background = 'hsl(220, 90%, 55%)';
  } else if (variant === 'secondary') {
    background = 'hsl(280, 70%, 50%)';
  } else if (variant === 'outline') {
    border = '1px solid hsl(220, 90%, 55%)';
    color = 'hsl(220, 90%, 55%)';
  }

  const baseStyle: React.CSSProperties = {
    background,
    color,
    border,
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    ...style
  };

  return (
    <button style={baseStyle} {...props}>
      {children}
    </button>
  );
};
