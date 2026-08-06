import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { useAdmissionsQueue } from './Admissions.hooks';
import { AdmissionsQueueItem } from './Admissions.types';

export const AdmissionsQueuePage: React.FC = () => {
    const { data: queue = [], isLoading } = useAdmissionsQueue();

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Admissions Queue</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Review applicants awaiting faculty endorsement.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                {isLoading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div> : (
                    <Table>
                        <thead>
                            <tr>
                                <th>Application ID</th>
                                <th>Applicant</th>
                                <th>Program</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {queue.map((app: AdmissionsQueueItem) => (
                                <tr key={app.id}>
                                    <td style={{ fontFamily: 'monospace' }}>{app.id}</td>
                                    <td>{app.applicantName}</td>
                                    <td>{app.program}</td>
                                    <td><Badge variant="warning">{app.status}</Badge></td>
                                    <td><Button variant="ghost" size="small">View</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>
        </div>
    );
};
