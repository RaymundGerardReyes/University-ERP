import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import React from 'react';
import { useProcessException, useRegistrationExceptions } from './Enrollment.hooks';

export const RegistrationExceptionsPage: React.FC = () => {
    const { data: exceptions, isLoading } = useRegistrationExceptions();
    const processMutation = useProcessException();

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader
                title="Registration Exceptions"
                subtitle="Review requests for prerequisite waivers, overloads, and late registrations."
            />
            <Card>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Type</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exceptions?.map(exc => (
                            <tr key={exc.exceptionId}>
                                <td><span style={{ fontFamily: 'monospace' }}>{exc.studentId}</span></td>
                                <td><Badge colorScheme="info">{exc.requestType.replace('_', ' ')}</Badge></td>
                                <td>{exc.reason}</td>
                                <td>
                                    <Badge colorScheme={exc.status === 'PENDING' ? 'warning' : exc.status === 'APPROVED' ? 'success' : 'danger'}>
                                        {exc.status}
                                    </Badge>
                                </td>
                                <td>
                                    {exc.status === 'PENDING' && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Button variant="success" size="small" onClick={() => processMutation.mutate({ id: exc.exceptionId, action: 'APPROVED' })}>Approve</Button>
                                            <Button variant="danger" size="small" onClick={() => processMutation.mutate({ id: exc.exceptionId, action: 'REJECTED' })}>Reject</Button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};