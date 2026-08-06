import { useQuery } from '@tanstack/react-query';
import { assessmentApi } from '@university-erp/api-clients';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const AssessmentsPage: React.FC = () => {
    const sectionId = "DEFAULT_SECTION_ID"; // In reality, driven by a dropdown

    const { data: gradebook, isLoading } = useQuery({
        queryKey: ['gradebook', sectionId],
        queryFn: () => assessmentApi.getGradebook(sectionId)
    });

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader title="Gradebook" subtitle="Manage and submit section assessments." />
            <Card className="fade-in-delay-1">
                <div className="card-accent-top" />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
                    <Button variant="primary">Submit Final Grades</Button>
                </div>
                {gradebook?.map((record) => (
                    <div key={record.studentId} className="data-row" style={{ padding: 'var(--space-4) 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="data-value">{record.studentName}</span>
                            <span className="data-label">ID: {record.studentId}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                            <span className="data-value">Prelim: {record.prelim || '-'}</span>
                            <span className="data-value">Midterm: {record.midterm || '-'}</span>
                            <span className="data-value">Final: {record.final || '-'}</span>
                            <Badge colorScheme={record.status === 'Graded' ? 'success' : 'warning'}>{record.status}</Badge>
                        </div>
                    </div>
                ))}
            </Card>
        </div>
    );
};