import { FacultyStudent } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Card, PageHeader, Table } from '@university-erp/ui-kit';
import React from 'react';
import { useFacultyStudents } from './Students.hooks';

export const StudentsDashboardPage: React.FC = () => {
    const { identity } = useAuth();
    const { data: students = [], isLoading, isError } = useFacultyStudents(identity?.id || 'demo-faculty');

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;
    if (isError) return <div className="stub-page fade-in"><div className="stub-title">Failed to load students</div></div>;

    return (
        <div className="fade-in">
            <PageHeader title="My Students" subtitle="Overview of students enrolled in your current sections." />

            <Card>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Program</th>
                            <th>Risk Indicator</th>
                            <th>Attendance</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student: FacultyStudent) => (
                            <tr key={student.studentId}>
                                <td>{student.studentId}</td>
                                <td>{student.name}</td>
                                <td>{student.program}</td>
                                <td>
                                    <Badge colorScheme={student.riskIndicator === 'Low' ? 'success' : student.riskIndicator === 'Medium' ? 'warning' : 'danger'}>
                                        {student.riskIndicator}
                                    </Badge>
                                </td>
                                <td>{student.attendanceRate}%</td>
                                <td>{student.lastBehaviorNote || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};