import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  colorScheme?: 'success' | 'warning' | 'info' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ children, colorScheme = 'default', style, ...props }) => {
  let background = 'rgba(255, 255, 255, 0.1)';
  let color = '#ccc';

  if (colorScheme === 'success') {
    background = 'rgba(0, 200, 83, 0.2)';
    color = 'hsl(160, 70%, 55%)';
  } else if (colorScheme === 'warning') {
    background = 'rgba(255, 152, 0, 0.2)';
    color = 'hsl(36, 100%, 50%)';
  } else if (colorScheme === 'info') {
    background = 'rgba(33, 150, 243, 0.2)';
    color = 'hsl(210, 100%, 65%)';
  }

  const baseStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '0.3rem 0.8rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 600,
    background,
    color,
    ...style
  };

  return (
    <span style={baseStyle} {...props}>
      {children}
    </span>
  );
};
