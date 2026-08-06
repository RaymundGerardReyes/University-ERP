import { useQuery } from '@tanstack/react-query';
import { registrarApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';

export const ClearancePage: React.FC = () => {
    const { identity } = useAuth();

    const { data: clearanceStatus, isLoading } = useQuery({
        queryKey: ['myClearance', identity?.id],
        queryFn: async () => {
            try {
                return await registrarApi.getStudentClearance(identity?.id || 'demo');
            } catch (e) {
                // Mock response
                return {
                    status: 'Pending_Clearance',
                    academicMet: true,
                    financialMet: false,
                    notes: 'Outstanding balance in library.'
                };
            }
        }
    });

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader title="Graduation Clearance" subtitle="Track your progress towards graduation approval." />
            
            <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎓</div>
                    <h2 style={{ marginBottom: 'var(--space-2)' }}>Clearance Status</h2>
                    <Badge colorScheme={clearanceStatus?.status === 'Cleared_For_Graduation' ? 'success' : 'warning'} style={{ fontSize: '1rem', padding: 'var(--space-2) var(--space-4)' }}>
                        {clearanceStatus?.status.replace(/_/g, ' ')}
                    </Badge>
                </div>

                <div style={{ marginTop: 'var(--space-6)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-6)' }}>
                    <h4 style={{ marginBottom: 'var(--space-4)' }}>Requirements Checklist</h4>
                    
                    <div className="data-row" style={{ borderBottom: 'none' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <span style={{ color: clearanceStatus?.academicMet ? 'var(--success-color)' : 'var(--danger-text)' }}>
                                {clearanceStatus?.academicMet ? '✅' : '❌'}
                            </span>
                            Academic Requirements
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.85rem' }}>All credits earned</span>
                    </div>

                    <div className="data-row" style={{ borderBottom: 'none' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <span style={{ color: clearanceStatus?.financialMet ? 'var(--success-color)' : 'var(--danger-text)' }}>
                                {clearanceStatus?.financialMet ? '✅' : '❌'}
                            </span>
                            Financial Obligations
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.85rem' }}>{clearanceStatus?.financialMet ? 'Zero Balance' : 'Outstanding Balance'}</span>
                    </div>
                </div>

                {clearanceStatus?.notes && (
                    <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-md)', color: 'var(--danger-text)', fontSize: '0.9rem' }}>
                        <strong>Registrar Notes:</strong> {clearanceStatus.notes}
                    </div>
                )}
            </Card>
        </div>
    );
};
