import React from 'react';
import { useAuth } from '@university-erp/auth-sdk';
import { Card, Badge, Button } from '@university-erp/ui-kit';
import { useFacultyDashboard } from './Dashboard.hooks';
import { useWeeklySchedule } from '../Schedule/Schedule.hooks';
import { useNavigate } from 'react-router-dom';
import { createLogger } from '@university-erp/core-logger';

const logger = createLogger('faculty-portal', 'Dashboard');

export const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // 1. Fetch Dashboard Aggregates (Courses & Inbox)
    const { data: dashboardData, isLoading: isDashboardLoading } = useFacultyDashboard();
    
    // 2. Fetch Schedule Data to determine today's tasks
    const { data: weeklySchedule, isLoading: isScheduleLoading } = useWeeklySchedule();

    if (isDashboardLoading || isScheduleLoading) {
        return <div className="skeleton" style={{ height: '60vh' }} />;
    }

    const { courses = [], inbox = [] } = dashboardData || {};
    
    // 3. Process Actionable Alerts
    const unreadMessages = inbox.filter(msg => !msg.isRead);
    
    // 4. Process Today's Schedule (Assuming today is Friday based on current context)
    const todaysEvents = weeklySchedule?.filter(evt => evt.dayOfWeek === 'Friday') || [];

    // Current Date Formatting
    const todayString = "Friday, August 14 · 1st Semester, AY 2026–2027";

    return (
        <div className="fade-in">
            {/* Header Section */}
            <div style={{ marginBottom: 'var(--space-8)' }}>
                <h1 className="page-title" style={{ fontSize: '2.2rem', marginBottom: 'var(--space-2)' }}>
                    Good morning, {user?.name || 'Dr. Jenkins'}
                </h1>
                <p className="page-subtitle" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                    {todayString}
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--space-6)', alignItems: 'start' }}>
                
                {/* LEFT COLUMN: Urgent Actions & Schedule */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    
                    {/* Needs Your Attention (Action Queue) */}
                    <Card style={{ borderColor: unreadMessages.length > 0 ? 'var(--warning-border)' : 'var(--border-color)' }}>
                        <h3 style={{ marginBottom: 'var(--space-4)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            Needs Your Attention
                            {unreadMessages.length > 0 && (
                                <Badge colorScheme="warning">{unreadMessages.length} Pending</Badge>
                            )}
                        </h3>
                        
                        {unreadMessages.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {unreadMessages.map(msg => (
                                    <div key={msg.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--warning-text)' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Unread Message: {msg.subject}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>From: {msg.sender}</div>
                                        </div>
                                        <Button variant="secondary" size="small" onClick={() => navigate('/communication')}>
                                            Open Inbox
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>You are all caught up! No urgent actions required.</p>
                        )}
                    </Card>

                    {/* Today's Schedule */}
                    <div>
                        <h3 style={{ marginBottom: 'var(--space-4)', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Today's Schedule</h3>
                        <div className="grid-auto">
                            {todaysEvents.map(evt => (
                                <Card key={evt.id} style={{ padding: 'var(--space-4)' }}>
                                    <div className="card-accent-top" style={{ background: evt.type === 'Class' ? 'var(--brand-primary)' : 'var(--brand-secondary)' }} />
                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-bright)', marginBottom: 'var(--space-1)' }}>
                                        {evt.time}
                                    </div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>
                                        {evt.title}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-3)' }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{evt.location}</span>
                                        <Badge colorScheme={evt.type === 'Class' ? 'info' : 'default'}>{evt.type}</Badge>
                                    </div>
                                </Card>
                            ))}
                            {todaysEvents.length === 0 && (
                                <div style={{ padding: 'var(--space-4)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
                                    No events scheduled for today.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Active Courses Overview */}
                <Card style={{ background: 'var(--bg-elevated)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>My Classes</h3>
                        <Badge colorScheme="success">{courses.length} Active</Badge>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {courses.map(course => (
                            <div key={course.id} style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                                    <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>{course.courseCode}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {course.courseName}
                                </div>
                                <Button variant="outline" style={{ width: '100%', fontSize: '0.8rem' }} onClick={() => navigate('/teaching')}>
                                    Open Workspace
                                </Button>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};