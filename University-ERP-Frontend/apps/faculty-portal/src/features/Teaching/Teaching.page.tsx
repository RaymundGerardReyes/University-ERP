import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useMyCourses, useSubmitAttendance } from './Teaching.hooks';

export const TeachingPage: React.FC = () => {
    const { data: courses, isLoading, isError } = useMyCourses();
    const { mutateAsync: submitAttendance, isPending } = useSubmitAttendance();

    const handleTakeAttendance = async (sectionId: string) => {
        await submitAttendance({ sectionId, data: { status: 'recorded', date: new Date().toISOString() } });
        alert(`Simulated attendance lock for section ${sectionId}`);
    };

    if (isLoading) return <div className="skeleton" style={{ height: '60vh', borderRadius: 'var(--radius-lg)' }} />;
    if (isError || !courses) return <div className="stub-page fade-in"><div className="stub-title">Courses Unavailable</div></div>;

    return (
        <div className="fade-in">
            <PageHeader
                title="Teaching & Classes"
                subtitle="Manage your active course sections, class schedules, and daily attendance."
            />

            <div className="grid-auto fade-in-delay-1">
                {courses.map((course, idx) => (
                    <Card key={course.id} className={`fade-in-delay-${(idx % 3) + 1}`} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 700 }}>{course.courseCode}</span>
                            <Badge colorScheme="info">{course.sectionName}</Badge>
                        </div>

                        <h3 style={{ color: 'var(--text-bright)', margin: '0 0 var(--space-4) 0', fontSize: '1.15rem' }}>{course.courseName}</h3>

                        <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 'var(--space-6)', flex: 1 }}>
                            <div className="data-row">
                                <span className="data-label">Schedule</span>
                                <span className="data-value">{course.schedule}</span>
                            </div>
                            <div className="data-row">
                                <span className="data-label">Room</span>
                                <span className="data-value">{course.room}</span>
                            </div>
                            <div className="data-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                                <span className="data-label">Enrolled Students</span>
                                <span className="data-value">{course.enrolledCount}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--space-3)' }}>
                            <Button variant="primary" style={{ flex: 1 }} disabled={isPending} onClick={() => handleTakeAttendance(course.id)}>
                                Record Attendance
                            </Button>
                            <Button variant="outline" style={{ flex: 1 }}>View Roster</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};