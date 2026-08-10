import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSectionRoster } from '../Students/Students.hooks';
import { RosterStudentStatus } from '../Students/Students.types';

export const SectionRosterPage: React.FC = () => {
    const { sectionId } = useParams<{ sectionId: string }>();
    const navigate = useNavigate();

    // Fallback to empty string to satisfy hook requirements before route loads
    const { data: roster, isLoading, isError } = useSectionRoster(sectionId || '');
    const [filter, setFilter] = useState<RosterStudentStatus | 'ALL'>('ENROLLED');

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    if (isError || !roster) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">Failed to load roster.</div>
                <div className="stub-subtitle">Ensure the section ID is correct and that you are assigned to this course.</div>
                <Button variant="outline" onClick={() => navigate('/teaching')} style={{ marginTop: 'var(--space-4)' }}>
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const filteredStudents = filter === 'ALL'
        ? roster.students
        : roster.students.filter(s => s.status === filter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ENROLLED': return 'success';
            case 'WAITLISTED': return 'warning';
            case 'DROPPED': return 'danger';
            default: return 'default';
        }
    };

    return (
        <div className="fade-in">
            <Button variant="outline" onClick={() => navigate('/teaching')} style={{ marginBottom: 'var(--space-4)' }}>
                Back to Courses
            </Button>

            <PageHeader
                title={`Section Roster: ${roster.sectionCode}`}
                subtitle={`Manage enrolled, waitlisted, and dropped students for section ${roster.sectionId}.`}
            />

            {/* Status Filtering */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                <Button variant={filter === 'ALL' ? 'primary' : 'outline'} onClick={() => setFilter('ALL')}>All</Button>
                <Button variant={filter === 'ENROLLED' ? 'primary' : 'outline'} onClick={() => setFilter('ENROLLED')}>Enrolled</Button>
                <Button variant={filter === 'WAITLISTED' ? 'primary' : 'outline'} onClick={() => setFilter('WAITLISTED')}>Waitlisted</Button>
                <Button variant={filter === 'DROPPED' ? 'primary' : 'outline'} onClick={() => setFilter('DROPPED')}>Dropped</Button>
            </div>

            <Card>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Program</th>
                            <th>Attendance</th>
                            <th>Risk Indicator</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? filteredStudents.map(student => (
                            <tr key={student.studentId}>
                                <td><span style={{ fontFamily: 'monospace' }}>{student.studentId}</span></td>
                                <td><strong>{student.studentName}</strong></td>
                                <td>{student.program || '-'}</td>
                                <td>{student.attendanceRate ? `${student.attendanceRate}%` : '-'}</td>
                                <td>
                                    {student.riskIndicator && (
                                        <Badge colorScheme={student.riskIndicator === 'High' ? 'danger' : student.riskIndicator === 'Medium' ? 'warning' : 'success'}>
                                            {student.riskIndicator} Risk
                                        </Badge>
                                    )}
                                </td>
                                <td>
                                    <Badge colorScheme={getStatusColor(student.status)}>
                                        {student.status}
                                    </Badge>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--text-muted)' }}>
                                    No students found for the selected filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};