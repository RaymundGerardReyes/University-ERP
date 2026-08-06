import { useQuery } from '@tanstack/react-query';
import { scheduleApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const SchedulePage: React.FC = () => {
    const { user } = useAuth();
    const { data: events, isLoading } = useQuery({
        queryKey: ['weeklySchedule', user?.id],
        queryFn: () => scheduleApi.getWeeklySchedule(user!.id),
        enabled: !!user?.id
    });

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader title="My Schedule" subtitle="Your upcoming classes and consultations." />
            <Card className="fade-in-delay-1">
                <div className="card-accent-top" />
                {events?.map((evt) => (
                    <div key={evt.id} className="data-row" style={{ padding: 'var(--space-4) 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="data-value" style={{ fontSize: '1.1rem' }}>{evt.title}</span>
                            <span className="data-label">{evt.dayOfWeek} • {evt.time} • {evt.location}</span>
                        </div>
                        <Badge colorScheme={evt.type === 'Class' ? 'success' : 'info'}>{evt.type}</Badge>
                    </div>
                ))}
            </Card>
        </div>
    );
};