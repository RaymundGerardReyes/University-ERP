import React from 'react';
import { Card, Table, Badge } from '@university-erp/ui-kit';
import { useTranscriptRequests } from './Certification.hooks';
import { TranscriptRequestItem } from './Certification.types';

export const TranscriptRequestsPage: React.FC = () => {
    const { data: requests = [], isLoading } = useTranscriptRequests();

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Transcript Requests</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Process requests for Official Transcript of Records (TOR) and certifications.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                {isLoading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div> : (
                    <Table>
                        <thead>
                            <tr>
                                <th>Request ID</th>
                                <th>Requester</th>
                                <th>Document Type</th>
                                <th>Purpose</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req: TranscriptRequestItem) => (
                                <tr key={req.id}>
                                    <td style={{ fontFamily: 'monospace' }}>{req.id}</td>
                                    <td>{req.requester}</td>
                                    <td>{req.type}</td>
                                    <td>{req.purpose}</td>
                                    <td><Badge variant="warning">{req.status}</Badge></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>
        </div>
    );
};
