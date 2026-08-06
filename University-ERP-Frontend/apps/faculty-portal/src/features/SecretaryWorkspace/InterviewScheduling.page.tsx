import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { AdmissionWorkflow } from '@university-erp/workflow-sdk';

export const InterviewSchedulingPage: React.FC = () => {
    const handleComplete = async (id: string) => {
        await AdmissionWorkflow.advance(id, 'InterviewCompletion');
        alert('Interview logged. Case forwarded to Chairperson for Academic Evaluation.');
    };

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Interview Scheduling</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Schedule applicant interviews with faculty members and log results.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Admission ID</th>
                            <th>Applicant</th>
                            <th>Interviewer</th>
                            <th>Schedule</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>ADM-2026-901</td>
                            <td>James Wilson</td>
                            <td>Arch. Jenkins</td>
                            <td>Tomorrow, 10:00 AM</td>
                            <td>
                                <Button size="small" variant="success" onClick={() => handleComplete('ADM-2026-901')}>
                                    Log Result & Forward
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
