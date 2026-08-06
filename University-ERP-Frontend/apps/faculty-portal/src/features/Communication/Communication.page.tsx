import { useQuery } from '@tanstack/react-query';
import { communicationApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const CommunicationPage: React.FC = () => {
    const { user } = useAuth();
    const { data: inbox, isLoading } = useQuery({
        queryKey: ['facultyInbox', user?.id],
        queryFn: () => communicationApi.getInbox(user!.id),
        enabled: !!user?.id
    });

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader title="Inbox" subtitle="Your secure academic communications." />
            <Card className="fade-in-delay-1">
                <div className="card-accent-top" />
                {inbox?.map((msg) => (
                    <div key={msg.id} className="data-row" style={{ padding: 'var(--space-4) 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="data-value">{msg.subject}</span>
                            <span className="data-label">From: {msg.sender} • {new Date(msg.date).toLocaleDateString()}</span>
                        </div>
                        {!msg.isRead && <Badge colorScheme="warning">Unread</Badge>}
                        <Button variant="secondary">Read</Button>
                    </div>
                ))}
            </Card>
        </div>
    );
};