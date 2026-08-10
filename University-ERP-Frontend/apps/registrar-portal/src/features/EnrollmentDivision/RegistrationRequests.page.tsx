import { Badge, Card, PageHeader, Table } from '@university-erp/ui-kit';
import React from 'react';
import { useRegistrationRequests } from './Enrollment.hooks';

export const RegistrationRequestsPage: React.FC = () => {
    const { data: requests, isLoading } = useRegistrationRequests();

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader
                title="Registration Requests"
                subtitle="Queue of pending multi-line registration requests requiring validation."
            />
            <Card>
                <Table>
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Student ID</th>
                            <th>Term ID</th>
                            <th>Errors</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests?.map(req => (
                            <tr key={req.requestId}>
                                <td><span style={{ fontFamily: 'monospace' }}>{req.requestId.substring(0, 8)}</span></td>
                                <td><strong>{req.studentId}</strong></td>
                                <td>{req.termId}</td>
                                <td>
                                    {req.validationErrors.length > 0 ? (
                                        <Badge colorScheme="danger">{req.validationErrors.length} Errors</Badge>
                                    ) : (
                                        <Badge colorScheme="success">Clean</Badge>
                                    )}
                                </td>
                                <td>
                                    <Badge colorScheme={req.status === 'PENDING' ? 'warning' : req.status === 'APPROVED' ? 'success' : 'danger'}>
                                        {req.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};