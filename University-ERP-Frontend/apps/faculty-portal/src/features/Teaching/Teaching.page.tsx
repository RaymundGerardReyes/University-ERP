import { useQuery } from '@tanstack/react-query';
import { teachingApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const TeachingPage: React.FC = () => {
    const { user } = useAuth();
    const { data: courses, isLoading } = useQuery({
        queryKey: ['facultyCourses', user?.id],
        queryFn: () => teachingApi.getMyCourses(user!.id),
        enabled: !!user?.id
    });

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader title="Teaching & Classes" subtitle="Manage your course sections and schedules." />
            <div className="grid-auto fade-in-delay-1">
                {courses?.map((course) => (
                    <Card key={course.id}>
                        <div className="card-accent-top" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                            <Badge colorScheme="info">{course.courseCode}</Badge>
                            <span className="text-muted">{course.sectionName}</span>
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-4)' }}>{course.courseName}</h3>
                        <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}>
                            <div className="data-row">
                                <span className="data-label">Schedule</span>
                                <span className="data-value">{course.schedule}</span>
                            </div>
                        </div>
                        <Button variant="primary" style={{ width: '100%' }}>Manage Section</Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};