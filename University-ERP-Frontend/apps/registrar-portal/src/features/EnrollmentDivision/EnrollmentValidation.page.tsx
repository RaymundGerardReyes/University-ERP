import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { useEnrollmentValidationQueue, useValidateEnrollment } from './Enrollment.hooks';
import { EnrollmentValidationItem } from './Enrollment.types';

export const EnrollmentValidationPage: React.FC = () => {
    const { data: queue = [], isLoading } = useEnrollmentValidationQueue();
    const validateMutation = useValidateEnrollment();

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Enrollment Validation</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Validate loaded subjects before official ledger assessment.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                {isLoading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div> : (
                    <Table>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Student Name</th>
                                <th>Total Units</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {queue.map((stu: EnrollmentValidationItem) => (
                                <tr key={stu.id}>
                                    <td style={{ fontFamily: 'monospace' }}>{stu.id}</td>
                                    <td>{stu.studentName}</td>
                                    <td>{stu.units} Units</td>
                                    <td><Badge variant="info">{stu.status}</Badge></td>
                                    <td>
                                        <Button 
                                            variant="primary" 
                                            size="small" 
                                            onClick={() => validateMutation.mutate(stu.id)}
                                            disabled={validateMutation.isPending}
                                        >
                                            Validate
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
