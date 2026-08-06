import { useMutation } from '@tanstack/react-query';
import { registrarApi } from '@university-erp/api-clients';
import { useAuth } from '@university-erp/auth-sdk';
import { Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';

export const AcademicRecordPage: React.FC = () => {
    const { identity } = useAuth();
    const [purpose, setPurpose] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    const requestMutation = useMutation({
        mutationFn: () => 
            registrarApi.requestTranscript({ studentId: identity?.id || 'demo-student', purpose }),
        onSuccess: () => {
            setStatusMessage('Transcript request submitted successfully. Check back later.');
            setPurpose('');
        },
        onError: () => setStatusMessage('Failed to submit transcript request.')
    });

    return (
        <div className="fade-in">
            <PageHeader title="Academic Record" subtitle="View your unofficial transcript and request official copies." />
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
                <Card>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Unofficial Transcript</h3>
                    <div className="data-row">
                        <span className="data-label">Cumulative GPA</span>
                        <span className="data-value" style={{ fontSize: '1.2rem', color: 'var(--brand-primary)' }}>3.84</span>
                    </div>
                    <div className="data-row">
                        <span className="data-label">Total Credits Earned</span>
                        <span className="data-value">92</span>
                    </div>
                    <div className="data-row">
                        <span className="data-label">Academic Standing</span>
                        <span className="data-value" style={{ color: 'var(--success-color)' }}>Good Standing</span>
                    </div>
                </Card>

                <Card>
                    <h3 style={{ marginBottom: 'var(--space-4)' }}>Request Official Transcript</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                        Official transcripts are sent directly to institutions or employers.
                    </p>
                    
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 'var(--space-2)' }}>Purpose of Request</label>
                        <select 
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                        >
                            <option value="">Select a purpose...</option>
                            <option value="Employment">Employment</option>
                            <option value="Graduate School">Graduate School</option>
                            <option value="Transfer">Transfer</option>
                            <option value="Personal Record">Personal Record</option>
                        </select>
                    </div>

                    <Button 
                        variant="primary" 
                        style={{ width: '100%' }}
                        disabled={!purpose || requestMutation.isPending}
                        onClick={() => requestMutation.mutate()}
                    >
                        {requestMutation.isPending ? 'Submitting...' : 'Submit Request'}
                    </Button>
                    
                    {statusMessage && (
                        <div style={{ marginTop: 'var(--space-4)', fontSize: '0.85rem', color: 'var(--brand-primary)' }}>
                            {statusMessage}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};
