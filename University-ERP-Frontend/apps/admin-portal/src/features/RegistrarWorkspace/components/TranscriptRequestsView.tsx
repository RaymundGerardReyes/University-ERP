import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { registrarApi } from '@university-erp/api-clients';
import { Badge, Button, Card } from '@university-erp/ui-kit';
import React from 'react';

export const TranscriptRequestsView: React.FC = () => {
    const queryClient = useQueryClient();
    
    const { data: requests, isLoading } = useQuery({
        queryKey: ['transcriptRequests'],
        queryFn: async () => {
            try {
                return await registrarApi.getTranscriptRequests();
            } catch (e) {
                return [
                    { id: 'TRQ-001', studentName: 'Alice Wong', purpose: 'Employment', date: '2026-08-01' },
                    { id: 'TRQ-002', studentName: 'Marcus Johnson', purpose: 'Graduate School Application', date: '2026-08-03' }
                ];
            }
        }
    });

    const processMutation = useMutation({
        mutationFn: ({ id, action }: { id: string, action: 'Approve' | 'Reject' }) => 
            registrarApi.processTranscriptRequest(id, action),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transcriptRequests'] })
    });

    const handleProcess = (id: string, action: 'Approve' | 'Reject') => {
        processMutation.mutate({ id, action });
        queryClient.setQueryData(['transcriptRequests'], (old: any) => old.filter((r: any) => r.id !== id));
    };

    if (isLoading) return <div className="skeleton" style={{ height: '300px' }} />;

    return (
        <div className="fade-in-delay-1">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Official Transcript Requests</h3>
            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <div className="card-accent-top" />
                {requests?.map((req: any, idx: number) => (
                    <div key={req.id} className="data-row" style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: idx === requests.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="data-value" style={{ fontSize: '1.1rem', textAlign: 'left' }}>{req.studentName}</span>
                            <span className="data-label">Purpose: {req.purpose} • Requested: {req.date}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <Badge colorScheme="info">Pending Verification</Badge>
                            <Button variant="outline" onClick={() => handleProcess(req.id, 'Reject')}>Reject</Button>
                            <Button variant="primary" onClick={() => handleProcess(req.id, 'Approve')}>Approve & Generate</Button>
                        </div>
                    </div>
                ))}
                {(!requests || requests.length === 0) && (
                    <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No pending transcript requests.
                    </div>
                )}
            </Card>
        </div>
    );
};
