import React from 'react';
import { Card } from './Card';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    style?: React.CSSProperties;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action, style }) => {
    return (
        <Card style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textAlign: 'center',
            padding: 'var(--space-12) var(--space-6)',
            borderStyle: 'dashed',
            ...style
        }}>
            {icon && (
                <div style={{ 
                    fontSize: '3rem', 
                    marginBottom: 'var(--space-4)', 
                    opacity: 0.5, 
                    filter: 'grayscale(1)' 
                }}>
                    {icon}
                </div>
            )}
            <h3 style={{ 
                color: 'var(--text-primary)', 
                marginBottom: 'var(--space-2)' 
            }}>
                {title}
            </h3>
            <p style={{ 
                color: 'var(--text-muted)', 
                maxWidth: '400px', 
                marginBottom: action ? 'var(--space-6)' : '0' 
            }}>
                {description}
            </p>
            {action && <div>{action}</div>}
        </Card>
    );
};
