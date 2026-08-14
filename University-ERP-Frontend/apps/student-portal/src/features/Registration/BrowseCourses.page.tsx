import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card } from '@university-erp/ui-kit';
import React from 'react';
import { useAddCourse, useBrowseCourses, useJoinWaitlist } from './Registration.hooks';

export const BrowseCoursesPage: React.FC = () => {
    const { identity } = useAuth();
    const currentTermId = "TERM-FALL-2026"; 
    
    // Wire directly to the dynamic backend payload
    const { data: courses, isLoading, isError } = useBrowseCourses(currentTermId);
    
    const addCourseMutation = useAddCourse();
    const waitlistMutation = useJoinWaitlist();

    const handleAdd = (sectionId: string) => {
        addCourseMutation.mutate({ studentId: identity?.id || 'demo', sectionId, termId: currentTermId });
    };

    const handleWaitlist = (sectionId: string) => {
        waitlistMutation.mutate({ studentId: identity?.id || 'demo', sectionId });
    };

    if (isLoading) return <div className="skeleton" style={{ height: '300px' }} />;
    if (isError) return <div style={{ color: 'var(--danger-text)' }}>Failed to load course catalog.</div>;

    // Graceful empty state when backend returns empty data
    if (!courses || courses.length === 0) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">No Courses Available</div>
                <div className="stub-subtitle">The catalog for {currentTermId} has not been published yet.</div>
            </div>
        );
    }

    return (
        <div className="grid-auto fade-in-delay-1">
            {courses.map((section: any) => (
                <Card key={section.sectionId}>
                    <div className="card-accent-top" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--brand-primary)' }}>{section.code}</span>
                        <Badge colorScheme={section.status === 'OPEN' ? 'success' : 'warning'}>{section.status}</Badge>
                    </div>
                    <h3 style={{ marginBottom: 'var(--space-2)' }}>{section.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                        Schedule: {section.schedule} <br />
                        Credits: {section.credits}
                    </p>

                    {section.status === 'OPEN' ? (
                        <Button
                            variant="primary"
                            style={{ width: '100%' }}
                            disabled={addCourseMutation.isPending}
                            onClick={() => handleAdd(section.sectionId)}
                        >
                            {addCourseMutation.isPending ? 'Processing...' : 'Add Course'}
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            style={{ width: '100%' }}
                            disabled={waitlistMutation.isPending}
                            onClick={() => handleWaitlist(section.sectionId)}
                        >
                            Join Waitlist
                        </Button>
                    )}
                </Card>
            ))}
        </div>
    );
};