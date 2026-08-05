import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useFacultyInbox } from './Communication.hooks';

export const CommunicationPage: React.FC = () => {
    const { data: messages, isLoading, isError } = useFacultyInbox();

    if (isLoading) return <div className="skeleton" />;
    if (isError || !messages) return <div className="stub-page"><div className="stub-title">Inbox Unavailable</div></div>;

    const unreadCount = messages.filter(m => !m.isRead).length;

    return (
        <div className="fade-in">
            <PageHeader
                title="Faculty Inbox"
                subtitle="Secure internal communications with administration and students."
                action={<Button variant="primary">Compose Message</Button>}
            />

            <div className="grid-stats fade-in-delay-1">
                <Card className="stat-card">
                    <div className="card-accent-top" />
                    <span className="stat-label">Unread Messages</span>
                    <span className="stat-value">{unreadCount}</span>
                    <span className="stat-trend">Requires Attention</span>
                </Card>
            </div>

            <div className="grid-auto fade-in-delay-2">
                {messages.map((msg) => (
                    <Card key={msg.id} className="card">
                        <div className="card-accent-top" />

                        <div className="data-row">
                            <span className="data-value">{msg.subject}</span>
                            {!msg.isRead && <Badge colorScheme="info">New</Badge>}
                        </div>

                        <div className="data-row">
                            <span className="data-label">Sender</span>
                            <span className="data-value">{msg.sender}</span>
                        </div>

                        <div className="data-row">
                            <span className="data-label">Received</span>
                            <span className="data-value">{new Date(msg.date).toLocaleDateString()}</span>
                        </div>

                        <div className="data-row">
                            <Button variant="outline">Archive</Button>
                            <Button variant="secondary">Read Message</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};