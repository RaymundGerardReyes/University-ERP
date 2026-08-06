import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { AdmissionWorkflow } from '@university-erp/workflow-sdk';

export const DocumentVerificationPage: React.FC = () => {
    
    const handleVerify = async (id: string) => {
        // Trigger the workflow SDK to advance the stage!
        await AdmissionWorkflow.advance(id, 'DocumentVerification');
        alert('Documents verified. Case advanced to Interview Pending.');
    };

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Document Verification</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Verify submitted transcripts, birth certificates, and recommendation letters.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Admission ID</th>
                            <th>Applicant</th>
                            <th>Missing Requirements</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>ADM-2026-901</td>
                            <td>James Wilson</td>
                            <td style={{ color: 'var(--text-muted)' }}>None</td>
                            <td><Badge variant="warning">Under Review</Badge></td>
                            <td>
                                <Button size="small" variant="primary" onClick={() => handleVerify('ADM-2026-901')}>
                                    Verify Completeness
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
