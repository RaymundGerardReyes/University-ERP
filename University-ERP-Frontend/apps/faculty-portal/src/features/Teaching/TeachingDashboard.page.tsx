import React from 'react';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { useMyCourses } from './Teaching.hooks';
import { useNavigate } from 'react-router-dom';

export const TeachingDashboardPage: React.FC = () => {
    const { identity } = useAuth();
    const navigate = useNavigate();
    
    // 1. Fetch dynamic course data from the PostgreSQL backend
    const { data: courses, isLoading, isError } = useMyCourses();

    if (isLoading) return <div className="skeleton" style={{ height: '500px' }} />;
    if (isError || !courses) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">Schedule Unavailable</div>
                <div className="stub-subtitle">Failed to load your dynamic teaching schedule.</div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <PageHeader 
                title={`Welcome, Professor ${identity?.name?.split(' ')[1] || ''}`} 
                subtitle="Manage your classes, attendance, and course materials for the current term." 
            />

            <Card className="fade-in-delay-1">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                    <h3 style={{ margin: 0 }}>My Active Sections</h3>
                    <Badge colorScheme="info">{courses.length} Sections Assigned</Badge>
                </div>
                
                <Table>
                    <thead>
                        <tr>
                            <th>Section ID</th>
                            <th>Course</th>
                            <th>Schedule</th>
                            <th>Room</th>
                            <th>Enrolled</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No courses assigned for this term.
                                </td>
                            </tr>
                        ) : (
                            courses.map((section: any) => (
                                <tr key={section.id}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{section.id}</td>
                                    <td>
                                        <div style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{section.courseCode}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{section.courseName}</div>
                                    </td>
                                    <td>{section.schedule}</td>
                                    <td>{section.room}</td>
                                    <td>
                                        <Badge colorScheme={section.enrolledCount >= 40 ? 'warning' : 'success'}>
                                            {section.enrolledCount} Students
                                        </Badge>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Button 
                                                variant="outline" 
                                                size="small"
                                                onClick={() => navigate(`/teaching/lms/${section.id}`)}
                                            >
                                                LMS
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="small"
                                                // Navigate to the dynamic gradebook for this specific section
                                                onClick={() => navigate(`/assessments/gradebook/${section.id}`)}
                                            >
                                                Gradebook
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};