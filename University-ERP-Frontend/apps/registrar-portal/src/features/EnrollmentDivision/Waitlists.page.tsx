import { Badge, Card, PageHeader, Table } from '@university-erp/ui-kit';
import React from 'react';
import { useWaitlists } from './Enrollment.hooks';

export const WaitlistsPage: React.FC = () => {
    const { data: waitlists, isLoading } = useWaitlists();

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader
                title="Waitlist Management"
                subtitle="Monitor section capacity and waitlist progression."
            />
            <Card>
                <Table>
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Section</th>
                            <th>Student ID</th>
                            <th>Queue Position</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {waitlists?.map(wl => (
                            <tr key={wl.waitlistId}>
                                <td><strong>{wl.courseCode}</strong></td>
                                <td>{wl.sectionId}</td>
                                <td><span style={{ fontFamily: 'monospace' }}>{wl.studentId}</span></td>
                                <td>#{wl.position}</td>
                                <td>
                                    <Badge colorScheme={wl.status === 'ACTIVE' ? 'warning' : wl.status === 'PROMOTED' ? 'success' : 'danger'}>
                                        {wl.status}
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