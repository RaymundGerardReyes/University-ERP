import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Card } from '@university-erp/ui-kit';
import React from 'react';
import { useCurrentRegistration } from './Registration.hooks';

export const WaitlistPage: React.FC = () => {
    const { identity } = useAuth();
    const currentTermId = "TERM-FALL-2026";

    // Reusing the current registration payload since waitlists are returned on the RegistrationDto
    const { data: registration, isLoading } = useCurrentRegistration(identity?.id || 'demo', currentTermId);

    if (isLoading) return <div className="skeleton" style={{ height: '300px' }} />;

    if (!registration || !registration.waitlistEntries?.length) return (
        <div className="stub-page fade-in">
            <div className="stub-title">No Waitlists</div>
            <div className="stub-subtitle">You are not currently on any waitlists.</div>
        </div>
    );

    return (
        <div className="fade-in-delay-1 grid-auto">
            {registration.waitlistEntries.map(entry => (
                <Card key={entry.waitlistId}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{entry.courseId}</span>
                        <Badge colorScheme={entry.status === 'ACTIVE' ? 'warning' : 'success'}>{entry.status}</Badge>
                    </div>
                    <div className="data-row">
                        <span className="data-label">Section</span>
                        <span className="data-value">{entry.sectionId}</span>
                    </div>
                    <div className="data-row" style={{ borderBottom: 'none' }}>
                        <span className="data-label">Position in Queue</span>
                        <span className="data-value" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                            #{entry.position}
                        </span>
                    </div>
                </Card>
            ))}
        </div>
    );
};