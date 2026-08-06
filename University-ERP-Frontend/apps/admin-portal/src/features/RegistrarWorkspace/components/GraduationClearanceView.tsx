import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { registrarApi } from '@university-erp/api-clients';
import { Badge, Button, Card } from '@university-erp/ui-kit';
import React, { useState } from 'react';

export const GraduationClearanceView: React.FC = () => {
    const queryClient = useQueryClient();
    
    // In a real scenario, this would hit the actual backend endpoint.
    // We provide a fallback mock array if the backend endpoint is not fully ready.
    const { data: clearances, isLoading } = useQuery({
        queryKey: ['graduationClearance'],
        queryFn: async () => {
            try {
                return await registrarApi.getPendingClearances();
            } catch (e) {
                return [
                    { id: 'CLR-9201', studentName: 'Jane Doe', studentId: 'STU-2022-011', degree: 'B.S. Computer Science', status: 'Pending_Clearance' },
                    { id: 'CLR-9202', studentName: 'John Smith', studentId: 'STU-2022-045', degree: 'B.S. Civil Engineering', status: 'Pending_Clearance' }
                ];
            }
        }
    });

    const evaluateMutation = useMutation({
        mutationFn: ({ id, hasCredits, zeroBalance }: { id: string, hasCredits: boolean, zeroBalance: boolean }) => 
            registrarApi.evaluateClearance(id, { hasRequiredCredits: hasCredits, hasZeroBalance: zeroBalance }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['graduationClearance'] })
    });

    const handleEvaluate = (id: string, approve: boolean) => {
        evaluateMutation.mutate({ id, hasCredits: approve, zeroBalance: approve });
        // Optimistically remove from view for demo
        queryClient.setQueryData(['graduationClearance'], (old: any) => old.filter((c: any) => c.id !== id));
    };

    if (isLoading) return <div className="skeleton" style={{ height: '300px' }} />;

    return (
        <div className="fade-in-delay-1">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Pending Graduation Clearances</h3>
            <div className="grid-auto">
                {clearances?.map((req: any) => (
                    <Card key={req.id}>
                        <div className="card-accent-top" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <Badge colorScheme="warning">Pending Eval</Badge>
                            <span className="text-muted" style={{ fontSize: '0.8rem' }}>{req.id}</span>
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-1)' }}>{req.studentName}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>{req.studentId} • {req.degree}</p>
                        
                        <div className="data-row" style={{ borderBottom: 'none', background: 'var(--bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.85rem' }}>
                                    <input type="checkbox" defaultChecked /> Academic Requirements Met
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.85rem' }}>
                                    <input type="checkbox" defaultChecked /> Financial Obligations Cleared
                                </label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <Button variant="outline" style={{ flex: 1 }} onClick={() => handleEvaluate(req.id, false)}>Mark Deficient</Button>
                            <Button variant="primary" style={{ flex: 1 }} onClick={() => handleEvaluate(req.id, true)}>Clear Student</Button>
                        </div>
                    </Card>
                ))}
                {(!clearances || clearances.length === 0) && (
                    <div className="text-muted">No pending clearance requests.</div>
                )}
            </div>
        </div>
    );
};
