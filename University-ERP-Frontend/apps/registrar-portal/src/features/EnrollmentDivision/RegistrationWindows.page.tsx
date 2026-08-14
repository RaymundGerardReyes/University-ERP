import React from 'react';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import { useRegistrationWindows } from './Enrollment.hooks';

export const RegistrationWindowsPage: React.FC = () => {
    const { data: windows, isLoading } = useRegistrationWindows();

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    // Mock data for visual demonstration until the backend is fully populated
    const displayWindows = windows && windows.length > 0 ? windows : [
        { windowId: 'W-001', termId: 'AY2627-S1', studentGroup: 'Graduating Seniors', openAt: '2026-08-15T08:00:00Z', closeAt: '2026-08-17T23:59:59Z', isOpen: false },
        { windowId: 'W-002', termId: 'AY2627-S1', studentGroup: 'Juniors & Sophomores', openAt: '2026-08-18T08:00:00Z', closeAt: '2026-08-20T23:59:59Z', isOpen: true },
        { windowId: 'W-003', termId: 'AY2627-S1', studentGroup: 'Freshmen & Transferees', openAt: '2026-08-21T08:00:00Z', closeAt: '2026-08-24T23:59:59Z', isOpen: false },
    ];

    // Helper to format dates cleanly for the UI
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Helper to determine the visual theme based on the timeline
    const getStatusTheme = (isOpen: boolean, openAt: string) => {
        const now = new Date();
        const openDate = new Date(openAt);
        if (isOpen) return 'success'; // Currently Open
        if (openDate > now) return 'info'; // Upcoming in the future
        return 'default'; // Closed in the past
    };

    // Helper to determine the exact status text
    const getStatusLabel = (isOpen: boolean, openAt: string) => {
        const now = new Date();
        const openDate = new Date(openAt);
        if (isOpen) return 'OPEN';
        if (openDate > now) return 'UPCOMING';
        return 'CLOSED';
    };

    return (
        <div className="fade-in">
            <PageHeader
                title="Registration Windows"
                subtitle="Manage cohort-based registration periods and schedules."
                action={<Button variant="primary">Create Window</Button>}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {displayWindows.map((window, index) => {
                    const statusTheme = getStatusTheme(window.isOpen, window.openAt);
                    const statusLabel = getStatusLabel(window.isOpen, window.openAt);
                    
                    return (
                        <Card 
                            key={window.windowId} 
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                padding: 'var(--space-4)', 
                                borderLeft: `4px solid var(--${statusTheme}-text, var(--border-color))`
                            }}
                        >
                            {/* Timeline Node / Sequence Number */}
                            <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                borderRadius: '50%', 
                                background: 'var(--bg-base)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontWeight: 'bold', 
                                marginRight: 'var(--space-6)',
                                color: `var(--${statusTheme}-text, var(--text-muted))`
                            }}>
                                {index + 1}
                            </div>

                            {/* Content Details */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-bright, var(--text-primary))' }}>{window.studentGroup}</h3>
                                    <Badge colorScheme={statusTheme as any}>{statusLabel}</Badge>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-6)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <div>
                                        <strong style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', display: 'block' }}>Opens</strong>
                                        {formatDate(window.openAt)}
                                    </div>
                                    <div>
                                        <strong style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', display: 'block' }}>Closes</strong>
                                        {formatDate(window.closeAt)}
                                    </div>
                                    <div>
                                        <strong style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', display: 'block' }}>Academic Term</strong>
                                        {window.termId}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div>
                                <Button variant="outline" size="small">Edit Schedule</Button>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};