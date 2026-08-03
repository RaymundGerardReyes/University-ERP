import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 'var(--space-8)',
      flexWrap: 'wrap',
      gap: 'var(--space-4)'
    }}>
      <div>
        <h1 style={{
          fontSize: '1.875rem', // 30px
          fontWeight: 700,
          margin: 0,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em'
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            margin: '0.35rem 0 0 0',
            fontSize: '0.95rem',
            color: 'var(--text-secondary)'
          }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};