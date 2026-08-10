import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card } from '@university-erp/ui-kit';
import React from 'react';
import { useCurrentRegistration, useDropCourse } from './Registration.hooks';

export const MyRegistrationPage: React.FC = () => {
    const { identity } = useAuth();
    const currentTermId = "TERM-FALL-2026";

    const { data: registration, isLoading } = useCurrentRegistration(identity?.id || 'demo', currentTermId);
    const dropMutation = useDropCourse();

    if (isLoading) return <div className="skeleton" style={{ height: '300px' }} />;

    if (!registration || !registration.lineItems?.length) return (
        <div className="stub-page fade-in">
            <div className="stub-title">No Active Registrations</div>
            <div className="stub-subtitle">You have not registered for any courses this term.</div>
        </div>
    );

    const handleDrop = (lineItemId: string) => {
        if (window.confirm('Are you sure you want to drop this course?')) {
            dropMutation.mutate({ studentId: identity?.id || 'demo', lineItemId, reason: 'Student self-service drop' });
        }
    };

    return (
        <div className="fade-in-delay-1">
            <Card style={{ marginBottom: 'var(--space-6)' }}>
                <div className="data-row">
                    <span className="data-label">Total Enrolled Credits</span>
                    <span className="data-value" style={{ fontSize: '1.2rem', color: 'var(--brand-primary)' }}>{registration.enrolledCredits}</span>
                </div>
                <div className="data-row" style={{ borderBottom: 'none' }}>
                    <span className="data-label">Status</span>
                    <span className="data-value"><Badge colorScheme="info">{registration.status}</Badge></span>
                </div>
            </Card>

            <h3>Enrolled Classes</h3>
            <div className="grid-auto mt-4">
                {registration.lineItems.map(item => (
                    <Card key={item.lineItemId}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <span style={{ fontWeight: 'bold' }}>{item.subjectCode}</span>
                            <Badge colorScheme="success">{item.status}</Badge>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Section: {item.sectionId}</p>
                        <Button
                            variant="outline"
                            style={{ width: '100%', marginTop: 'var(--space-4)', borderColor: 'var(--danger-border)', color: 'var(--danger-text)' }}
                            onClick={() => handleDrop(item.lineItemId)}
                            disabled={dropMutation.isPending}
                        >
                            Drop Course
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};