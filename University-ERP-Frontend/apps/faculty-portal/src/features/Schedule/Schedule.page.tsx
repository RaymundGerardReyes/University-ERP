import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useWeeklySchedule } from './Schedule.hooks';

export const SchedulePage: React.FC = () => {
    const { data: schedule, isLoading } = useWeeklySchedule();

    if (isLoading) return <div className="skeleton fade-in" style={{ height: '500px' }} />;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <div className="fade-in">
            <PageHeader
                title="My Schedule"
                subtitle="Manage your classes, consultation hours, and meetings."
                action={<Button variant="primary">Add Office Hours</Button>}
            />

            <div className="grid-auto fade-in-delay-1">
                {days.map(day => {
                    const dayEvents = schedule?.filter(e => e.dayOfWeek === day) || [];

                    return (
                        <Card key={day} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="card-accent-top" />
                            <h3 style={{ margin: '0 0 var(--space-4) 0', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>
                                {day}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {dayEvents.length > 0 ? dayEvents.map(event => (
                                    <div key={event.id} style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${event.type === 'Class' ? 'var(--brand-primary)' : event.type === 'Consultation' ? 'var(--success-text)' : 'var(--warning-text)'}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{event.title}</span>
                                            <Badge colorScheme={event.type === 'Class' ? 'info' : event.type === 'Consultation' ? 'success' : 'warning'}>{event.type}</Badge>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{event.time}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{event.location}</div>
                                    </div>
                                )) : (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No events scheduled.</p>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};