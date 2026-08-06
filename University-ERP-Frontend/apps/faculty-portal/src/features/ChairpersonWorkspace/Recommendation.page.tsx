import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { AdmissionWorkflow } from '@university-erp/workflow-sdk';

export const RecommendationPage: React.FC = () => {
    const handleRecommend = async (id: string) => {
        await AdmissionWorkflow.advance(id, 'ChairpersonRecommendation', 'Applicant meets all academic criteria.');
        alert('Recommendation submitted. Case forwarded to Dean.');
    };

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Academic Recommendation</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Provide final academic endorsement for program suitability.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Applicant: James Wilson (BS Architecture)</h3>
                    <p style={{ marginBottom: '2rem' }}>Based on the academic evaluation and curriculum matching, do you recommend this applicant?</p>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Button variant="danger" size="large">Reject Application</Button>
                        <Button variant="success" size="large" onClick={() => handleRecommend('ADM-2026-901')}>Recommend for Admission</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
