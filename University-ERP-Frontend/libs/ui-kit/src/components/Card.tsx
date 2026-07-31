import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, gradient, style, ...props }) => {
  const baseStyle: React.CSSProperties = {
    background: gradient 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)' 
      : 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '1.5rem',
    borderRadius: '12px',
    ...style
  };

  return (
    <div style={baseStyle} {...props}>
      {children}
    </div>
  );
};
