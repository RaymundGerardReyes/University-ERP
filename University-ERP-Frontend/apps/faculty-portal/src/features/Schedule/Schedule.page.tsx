import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useWeeklySchedule } from './Schedule.hooks';

export const SchedulePage: React.FC = () => {
    const { data: schedule, isLoading, isError } = useWeeklySchedule();

    if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;
    if (isError || !schedule) return <div className="stub-page fade-in"><div className="stub-title">Schedule Unavailable</div></div>;

    // Group events by day of week
    const groupedSchedule = schedule.reduce((acc, event) => {
        acc[event.dayOfWeek] = acc[event.dayOfWeek] || [];
        acc[event.dayOfWeek].push(event);
        return acc;
    }, {} as Record<string, typeof schedule>);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <div className="fade-in">
            <PageHeader
                title="Weekly Schedule"
                subtitle="Manage your classes, consultations, and department meetings."
                action={<Button variant="outline">Sync to Outlook</Button>}
            />

            <div className="grid-auto fade-in-delay-1">
                {days.map((day) => {
                    const events = groupedSchedule[day] || [];

                    return (
                        <Card key={day}>
                            <div className="card-accent-top" style={{ background: events.length > 0 ? 'var(--brand-primary)' : 'var(--text-muted)' }} />
                            <h2 className="data-value" style={{ textAlign: 'left', marginBottom: 'var(--space-4)' }}>{day}</h2>

                            {events.length === 0 ? (
                                <p className="data-label">No scheduled events.</p>
                            ) : (
                                <div>
                                    {events.map((evt, idx) => (
                                        <div key={evt.id} className="data-row" style={{ borderBottom: idx === events.length - 1 ? 'none' : undefined }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span className="data-value" style={{ textAlign: 'left' }}>{evt.title}</span>
                                                <span className="data-label">{evt.time} &bull; {evt.location}</span>
                                            </div>
                                            <Badge colorScheme={evt.type === 'Class' ? 'info' : evt.type === 'Consultation' ? 'success' : 'warning'}>
                                                {evt.type}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};