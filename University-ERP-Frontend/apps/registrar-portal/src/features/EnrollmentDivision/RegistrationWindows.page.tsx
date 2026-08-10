import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import React from 'react';
import { useRegistrationWindows } from './Enrollment.hooks';

export const RegistrationWindowsPage: React.FC = () => {
    const { data: windows, isLoading } = useRegistrationWindows();

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader
                title="Registration Windows"
                subtitle="Manage cohort-based registration periods."
                action={<Button variant="primary">Create Window</Button>}
            />
            <Card>
                <Table>
                    <thead>
                        <tr>
                            <th>Term ID</th>
                            <th>Student Group</th>
                            <th>Open Date</th>
                            <th>Close Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {windows?.map(window => (
                            <tr key={window.windowId}>
                                <td>{window.termId}</td>
                                <td><strong>{window.studentGroup}</strong></td>
                                <td>{new Date(window.openAt).toLocaleString()}</td>
                                <td>{new Date(window.closeAt).toLocaleString()}</td>
                                <td>
                                    <Badge colorScheme={window.isOpen ? 'success' : 'danger'}>
                                        {window.isOpen ? 'OPEN' : 'CLOSED'}
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