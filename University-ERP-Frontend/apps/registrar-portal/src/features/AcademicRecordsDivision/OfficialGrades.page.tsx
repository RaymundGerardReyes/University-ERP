import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { useOfficialGrades, useLockGrades } from './Records.hooks';
import { OfficialGradeItem } from './Records.types';

export const OfficialGradesPage: React.FC = () => {
    const { data: grades = [], isLoading } = useOfficialGrades();
    const lockMutation = useLockGrades();

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Official Academic Grades</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Review submitted faculty grading sheets and process grade corrections.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                {isLoading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div> : (
                    <Table>
                        <thead>
                            <tr>
                                <th>Section Code</th>
                                <th>Subject</th>
                                <th>Faculty</th>
                                <th>Submission Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.map((grade: OfficialGradeItem) => (
                                <tr key={grade.section}>
                                    <td style={{ fontFamily: 'monospace' }}>{grade.section}</td>
                                    <td>{grade.subject}</td>
                                    <td>{grade.faculty}</td>
                                    <td><Badge variant="success">{grade.status}</Badge></td>
                                    <td>
                                        <Button 
                                            variant="secondary" 
                                            size="small" 
                                            onClick={() => lockMutation.mutate(grade.section)}
                                            disabled={lockMutation.isPending}
                                        >
                                            Lock Grades
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>
        </div>
    );
};
