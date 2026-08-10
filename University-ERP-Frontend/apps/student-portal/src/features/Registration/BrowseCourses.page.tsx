import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card } from '@university-erp/ui-kit';
import React from 'react';
import { useAddCourse, useBrowseCourses, useJoinWaitlist } from './Registration.hooks';

export const BrowseCoursesPage: React.FC = () => {
    const { identity } = useAuth();
    const currentTermId = "TERM-FALL-2026"; // In a real app, this comes from a Global/Term context

    // Fallback to empty array if the API stub returns null during dev
    const { data: courses = [], isLoading } = useBrowseCourses(currentTermId);
    const addCourseMutation = useAddCourse();
    const waitlistMutation = useJoinWaitlist();

    const handleAdd = (sectionId: string) => {
        addCourseMutation.mutate({ studentId: identity?.id || 'demo', sectionId, termId: currentTermId });
    };

    const handleWaitlist = (sectionId: string) => {
        waitlistMutation.mutate({ studentId: identity?.id || 'demo', sectionId });
    };

    if (isLoading) return <div className="skeleton" style={{ height: '300px' }} />;

    // Mock UI rendering if API is not yet wired up in backend
    const mockSections = courses.length ? courses : [
        { sectionId: 'SEC-101', code: 'CS101', title: 'Intro to Programming', credits: 3, schedule: 'MWF 9:00 AM', status: 'OPEN' },
        { sectionId: 'SEC-102', code: 'CS305', title: 'Database Systems', credits: 4, schedule: 'TTh 1:00 PM', status: 'FULL' }
    ];

    return (
        <div className="grid-auto fade-in-delay-1">
            {mockSections.map((section: any) => (
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
                            Add Course
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