import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import React from 'react';
import { useOfficialGrades } from './Records.hooks';
import { OfficialGradeItem } from './Records.types';

export const OfficialGradesPage: React.FC = () => {
    const { data: grades = [], isLoading } = useOfficialGrades();

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader title="Official Grades" subtitle="Review and lock submitted grades from faculty." />

            <Card>
                <Table>
                    <thead>
                        <tr>
                            <th>Section</th>
                            <th>Subject</th>
                            <th>Faculty</th>
                            <th>Credits</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.map((grade: OfficialGradeItem) => (
                            <tr key={grade.id}>
                                <td>{grade.section}</td>
                                <td>{grade.subject}</td>
                                <td>{grade.faculty}</td>
                                <td>{grade.credits}</td>
                                <td>
                                    <Badge colorScheme={grade.status === 'Submitted' ? 'warning' : 'success'}>
                                        {grade.status}
                                    </Badge>
                                </td>
                                <td>
                                    <Button variant="outline" size="small" disabled={grade.status !== 'Submitted'}>
                                        Lock Grades
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};