import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { AdmissionWorkflow } from '@university-erp/workflow-sdk';

export const EndorsementPage: React.FC = () => {
    const handleEndorse = async (id: string) => {
        await AdmissionWorkflow.advance(id, 'DeanEndorsement');
        alert('College endorsement finalized. Case officially forwarded to the Registrar for activation.');
    };

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Final College Endorsement</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Provide the final college-level approval before routing to the University Registrar.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)', padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Review Summary</h3>
                <ul style={{ color: 'var(--text-secondary)', lineHeight: '2', marginBottom: '2rem' }}>
                    <li><strong>Applicant:</strong> James Wilson</li>
                    <li><strong>Program:</strong> BS Architecture</li>
                    <li><strong>Secretary Check:</strong> PASSED</li>
                    <li><strong>Chairperson Evaluation:</strong> STRONGLY RECOMMENDED</li>
                </ul>

                <Button variant="primary" size="large" onClick={() => handleEndorse('ADM-2026-901')} style={{ width: '100%' }}>
                    Officially Endorse to Registrar
                </Button>
            </Card>
        </div>
    );
};
