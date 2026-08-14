import React, { useState } from 'react';
import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { useMyCourses } from './Teaching.hooks';
import { useSectionRoster } from '../Students/Students.hooks';
import { useGradebook, useSubmitGrades } from '../Assessments/Assessments.hooks';
import { createLogger } from '@university-erp/core-logger';

const logger = createLogger('faculty-portal', 'CourseWorkspace');

export const TeachingPage: React.FC = () => {
    // 1. Global View State
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'ROSTER' | 'GRADEBOOK'>('ROSTER');

    // 2. Fetch Master List (All assigned courses)
    const { data: courses, isLoading: isCoursesLoading } = useMyCourses();

    // 3. Fetch Detail Data (Only triggers when a section is selected)
    const { data: roster, isLoading: isRosterLoading } = useSectionRoster(selectedSectionId || '');
    const { data: gradebook, isLoading: isGradebookLoading } = useGradebook(selectedSectionId || '');
    const submitGradesMutation = useSubmitGrades(selectedSectionId || '');

    // Safely get the selected course details for the header
    const selectedCourse = courses?.find(c => c.id === selectedSectionId);

    const handleGradeSubmission = () => {
        if (!selectedSectionId) return;
        logger.info(`Submitting final grades for section: ${selectedSectionId}`);
        // Payload would typically be gathered from local form state, 
        // passing an empty object as a stub for the existing API contract.
        submitGradesMutation.mutate({ sectionId: selectedSectionId, payload: {} });
    };

    if (isCoursesLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <PageHeader 
                title="My Teaching Workspace" 
                subtitle="Manage your course sections, student rosters, and final grades." 
            />

            {/* MASTER-DETAIL LAYOUT */}
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
                
                {/* LEFT PANE: Course Queue */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Assigned Courses</h3>
                    {courses?.map((course) => (
                        <Card 
                            key={course.id} 
                            onClick={() => setSelectedSectionId(course.id)}
                            style={{ 
                                cursor: 'pointer',
                                borderColor: selectedSectionId === course.id ? 'var(--brand-primary)' : 'var(--border-color)',
                                background: selectedSectionId === course.id ? 'var(--bg-active)' : 'var(--bg-surface)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                <Badge colorScheme="info">{course.courseCode}</Badge>
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>{course.enrolledCount} Students</span>
                            </div>
                            <h4 style={{ margin: '0 0 var(--space-2) 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
                                {course.courseName}
                            </h4>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {course.schedule} • {course.room}
                            </div>
                        </Card>
                    ))}
                    {(!courses || courses.length === 0) && (
                        <div className="text-muted" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                            No courses assigned for this term.
                        </div>
                    )}
                </div>

                {/* RIGHT PANE: Unified Course Details */}
                <Card style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                    {!selectedSectionId ? (
                        <div className="stub-page">
                            <div style={{ fontSize: '3rem', opacity: 0.5, marginBottom: 'var(--space-4)' }}>📚</div>
                            <div className="stub-title">Select a Course</div>
                            <div className="stub-subtitle">Choose a course from the left queue to view its roster and manage grades.</div>
                        </div>
                    ) : (
                        <div className="fade-in">
                            {/* Context Header */}
                            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                                <h2 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-bright)' }}>
                                    {selectedCourse?.courseName} ({selectedCourse?.sectionName})
                                </h2>
                                
                                {/* Inner Navigation Tabs */}
                                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                                    <Button 
                                        variant={activeTab === 'ROSTER' ? 'primary' : 'outline'} 
                                        onClick={() => setActiveTab('ROSTER')}
                                    >
                                        Section Roster
                                    </Button>
                                    <Button 
                                        variant={activeTab === 'GRADEBOOK' ? 'primary' : 'outline'} 
                                        onClick={() => setActiveTab('GRADEBOOK')}
                                    >
                                        Gradebook
                                    </Button>
                                </div>
                            </div>

                            {/* TAB CONTENT: ROSTER */}
                            {activeTab === 'ROSTER' && (
                                <div>
                                    {isRosterLoading ? (
                                        <div className="skeleton" style={{ height: '300px' }} />
                                    ) : (
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Student ID</th>
                                                    <th>Name</th>
                                                    <th>Program</th>
                                                    <th>Attendance</th>
                                                    <th>Risk</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {roster?.students?.map((student: any) => (
                                                    <tr key={student.studentId}>
                                                        <td style={{ fontFamily: 'monospace' }}>{student.studentId}</td>
                                                        <td style={{ fontWeight: 600 }}>{student.studentName}</td>
                                                        <td>{student.program || '-'}</td>
                                                        <td>{student.attendanceRate ? `${student.attendanceRate}%` : '-'}</td>
                                                        <td>
                                                            {student.riskIndicator && (
                                                                <Badge colorScheme={student.riskIndicator === 'High' ? 'danger' : 'success'}>
                                                                    {student.riskIndicator}
                                                                </Badge>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </div>
                            )}

                            {/* TAB CONTENT: GRADEBOOK */}
                            {activeTab === 'GRADEBOOK' && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
                                        <Button 
                                            variant="success" 
                                            onClick={handleGradeSubmission}
                                            disabled={submitGradesMutation.isPending}
                                        >
                                            {submitGradesMutation.isPending ? 'Submitting...' : 'Submit Final Grades'}
                                        </Button>
                                    </div>
                                    {isGradebookLoading ? (
                                        <div className="skeleton" style={{ height: '300px' }} />
                                    ) : (
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Student ID</th>
                                                    <th>Name</th>
                                                    <th>Prelim</th>
                                                    <th>Midterm</th>
                                                    <th>Final</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {gradebook?.map((record: any) => (
                                                    <tr key={record.studentId}>
                                                        <td style={{ fontFamily: 'monospace' }}>{record.studentId}</td>
                                                        <td style={{ fontWeight: 600 }}>{record.studentName}</td>
                                                        <td>{record.prelim || '-'}</td>
                                                        <td>{record.midterm || '-'}</td>
                                                        <td>{record.final || '-'}</td>
                                                        <td>
                                                            <Badge colorScheme={record.status === 'Graded' ? 'success' : 'warning'}>
                                                                {record.status}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};