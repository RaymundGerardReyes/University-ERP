import React from 'react';

interface PageHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, action }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <h1 style={{ fontSize: '2rem', margin: 0, color: 'white' }}>{title}</h1>
      {action && <div>{action}</div>}
    </div>
  );
};
