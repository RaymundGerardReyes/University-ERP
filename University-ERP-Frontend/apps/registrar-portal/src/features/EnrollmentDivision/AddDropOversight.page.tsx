import { Badge, Card, PageHeader, Table } from '@university-erp/ui-kit';
import React from 'react';
import { useAddDropRequests } from './Enrollment.hooks';

export const AddDropOversightPage: React.FC = () => {
    const { data: requests, isLoading } = useAddDropRequests();

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader
                title="Add/Drop Oversight"
                subtitle="Monitor manual add/drop activity during the adjustment period."
            />
            <Card>
                <Table>
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Student ID</th>
                            <th>Course Code</th>
                            <th>Section ID</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests?.map(req => (
                            <tr key={req.requestId}>
                                <td>
                                    <Badge colorScheme={req.action === 'ADD' ? 'success' : 'danger'}>{req.action}</Badge>
                                </td>
                                <td><span style={{ fontFamily: 'monospace' }}>{req.studentId}</span></td>
                                <td><strong>{req.courseCode}</strong></td>
                                <td>{req.sectionId}</td>
                                <td>
                                    <Badge colorScheme={req.status.includes('PENDING') ? 'warning' : 'default'}>
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