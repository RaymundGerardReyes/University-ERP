import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { FinanceWorkflow } from '@university-erp/workflow-sdk';

export const TuitionAssessmentPage: React.FC = () => {
    const handleAssessment = async (studentId: string) => {
        await FinanceWorkflow.process(studentId, 'AssessTuition');
        alert('Tuition assessment completed. Modules verified.');
    };

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Tuition Assessment</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Evaluate enrolled units and calculate total tuition liabilities for the semester.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Program</th>
                            <th>Enrolled Units</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>STU-2026-8812</td>
                            <td>BS Computer Science</td>
                            <td>18</td>
                            <td><Badge variant="warning">Pending Assessment</Badge></td>
                            <td>
                                <Button size="small" variant="primary" onClick={() => handleAssessment('STU-2026-8812')}>
                                    Assess Tuition
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
