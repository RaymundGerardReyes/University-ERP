import React from 'react';
import { useAuth } from '@university-erp/auth-sdk';
import { Card, PageHeader, Badge } from '@university-erp/ui-kit';
import { useQuery } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients';

export const ApplicationTimelinePage: React.FC = () => {
    const { identity } = useAuth();

    // Fetch the applicant's journey state using TanStack Query
    const { data: journey, isLoading, isError } = useQuery({
        queryKey: ['applicantJourney', identity?.id],
        queryFn: () => admissionsApi.getApplicantJourney(identity?.id || ''),
        enabled: !!identity?.id
    });

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;
    
    if (isError || !journey) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">Timeline Unavailable</div>
                <div className="stub-subtitle">We could not load your application timeline at this time.</div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <PageHeader 
                title="Application Status" 
                subtitle="Track the real-time progress of your university application." 
            />

            <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ margin: 0 }}>Current Stage</h3>
                    {/* Map the currentStage number to a user-friendly badge */}
                    <Badge colorScheme={journey.currentStage >= 3 ? 'success' : 'info'}>
                        Stage {journey.currentStage} of 4
                    </Badge>
                </div>

                <div style={{ position: 'relative', paddingLeft: 'var(--space-4)' }}>
                    {/* Vertical Line */}
                    <div style={{
                        position: 'absolute', top: 0, bottom: 0, left: '7px',
                        width: '2px', background: 'var(--border-color)', zIndex: 1
                    }} />

                    {journey.timeline.map((event: any, index: number) => (
                        <div key={index} style={{ position: 'relative', paddingBottom: 'var(--space-6)', paddingLeft: 'var(--space-4)' }}>
                            {/* Timeline Dot */}
                            <div style={{
                                position: 'absolute', left: '-21px', top: '4px',
                                width: '12px', height: '12px', borderRadius: '50%',
                                background: index === 0 ? 'var(--brand-primary)' : 'var(--bg-surface)',
                                border: `2px solid ${index === 0 ? 'var(--brand-primary)' : 'var(--text-muted)'}`,
                                zIndex: 2
                            }} />
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-1)' }}>
                                <h4 style={{ margin: 0, color: index === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                    {event.event}
                                </h4>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {event.date}
                                </span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                {event.detail}
                            </p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};