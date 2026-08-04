import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useMyCourses } from './Teaching.hooks';

export const TeachingDashboardPage: React.FC = () => {
    const { data: courses, isLoading, isError } = useMyCourses();

    if (isLoading) return <div className="skeleton fade-in" style={{ height: '400px' }} />;
    if (isError) return <div className="stub-page fade-in"><div className="stub-title">Failed to load courses.</div></div>;

    return (
        <div className="fade-in">
            <PageHeader
                title="Teaching & Classes"
                subtitle="Manage your course sections, lesson plans, and classroom attendance."
            />

            <div className="grid-auto fade-in-delay-1">
                {courses?.map((course) => (
                    <Card key={course.id} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="card-accent-top" />

                        {/* Header / Course Code */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                            <Badge colorScheme="info">{course.sectionName}</Badge>
                            <span style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 700 }}>
                                {course.courseCode}
                            </span>
                        </div>

                        {/* Course Title */}
                        <h3 style={{ margin: '0 0 var(--space-4) 0', fontSize: '1.25rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                            {course.courseName}
                        </h3>

                        {/* Meta Data Box */}
                        <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}>
                            <div className="data-row">
                                <span className="data-label">Schedule</span>
                                <span className="data-value" style={{ fontSize: '0.8rem' }}>{course.schedule}</span>
                            </div>
                            <div className="data-row">
                                <span className="data-label">Room</span>
                                <span className="data-value">{course.room}</span>
                            </div>
                            <div className="data-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                                <span className="data-label">Enrolled Students</span>
                                <span className="data-value" style={{ color: 'var(--success-text)' }}>{course.enrolledCount}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--space-3)' }}>
                            <Button variant="outline" style={{ flex: 1 }}>Roster</Button>
                            <Button variant="primary" style={{ flex: 1 }}>Take Attendance</Button>
                        </div>
                    </Card>
                ))}

                {courses?.length === 0 && (
                    <div className="stub-page" style={{ gridColumn: '1 / -1' }}>
                        <div className="stub-title">No Courses Assigned</div>
                        <div className="stub-subtitle">You are not assigned to teach any sections this semester.</div>
                    </div>
                )}
            </div>
        </div>
    );
};