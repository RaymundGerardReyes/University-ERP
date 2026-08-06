import { useQuery } from '@tanstack/react-query';
import { facultyStudentsApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const StudentsPage: React.FC = () => {
    const { user } = useAuth();
    const { data: students, isLoading } = useQuery({
        queryKey: ['myStudents', user?.id],
        queryFn: () => facultyStudentsApi.getMyStudents(user!.id),
        enabled: !!user?.id
    });

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader title="My Students" subtitle="View and monitor your enrolled students." />
            <Card className="fade-in-delay-1">
                <div className="card-accent-top" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {students?.map((student) => (
                        <div key={student.studentId} className="data-row" style={{ padding: 'var(--space-4) 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                                    {student.name.charAt(0)}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="data-value">{student.name}</span>
                                    <span className="data-label">{student.program} • Attendance: {student.attendanceRate}%</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                <Badge colorScheme={student.riskIndicator === 'High' ? 'danger' : 'success'}>
                                    {student.riskIndicator} Risk
                                </Badge>
                                <Button variant="outline">View Profile</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};