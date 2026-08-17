import React from 'react';

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ style, className = '', ...props }) => (
  <div style={{ overflowX: 'auto', width: '100%', borderRadius: 'var(--radius-md)' }}>
    <table className={`premium-table ${className}`} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', ...style }} {...props} />
  </div>
);
