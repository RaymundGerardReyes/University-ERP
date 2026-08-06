import React from 'react';

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ style, ...props }) => (
  <div style={{ overflowX: 'auto', width: '100%' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', ...style }} {...props} />
  </div>
);
