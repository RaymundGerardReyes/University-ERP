import React from 'react';

export const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ style, ...props }) => (
  <input style={{ padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', width: '100%', ...style }} {...props} />
);
