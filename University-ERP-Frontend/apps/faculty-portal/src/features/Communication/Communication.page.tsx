import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useInbox } from './Communication.hooks';

export const CommunicationPage: React.FC = () => {
    const { data: messages, isLoading } = useInbox();

    if (isLoading) return <div className="skeleton fade-in" style={{ height: '500px' }} />;

    return (
        <div className="fade-in">
            <PageHeader title="Communication Hub" subtitle="Your unified inbox for student and department messages." action={<Button variant="primary">Compose Message</Button>} />
            <Card style={{ padding: 0, overflow: 'hidden' }} className="fade-in-delay-1">
                {messages?.map((msg, idx) => (
                    <div key={msg.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 'var(--space-4)', padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)', background: msg.isRead ? 'var(--bg-surface)' : 'var(--bg-elevated)', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: msg.isRead ? 'transparent' : 'var(--brand-primary)' }} />
                        <div>
                            <div style={{ fontWeight: msg.isRead ? 500 : 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{msg.subject}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{msg.sender}</div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(msg.date).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </Card>
        </div>
    );
};