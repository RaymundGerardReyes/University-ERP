import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { LMSWorkflow } from '@university-erp/workflow-sdk';

export const GradebookSyncPage: React.FC = () => {
    const handleSync = async (studentId: string) => {
        await LMSWorkflow.process(studentId, 'SyncGrades');
        alert('Official grades synced to Registrar. Academic Record Workflow initiated.');
    };

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Gradebook Orchestration</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Finalize course grades and officially synchronize them to the Registrar's Academic Record database.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Course</th>
                            <th>Final Grade</th>
                            <th>Registrar Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>STU-2026-8812</td>
                            <td>CS101</td>
                            <td style={{ fontWeight: 700, color: 'var(--success-color)' }}>A- (91%)</td>
                            <td><Badge variant="warning">Not Synced</Badge></td>
                            <td>
                                <Button size="small" variant="primary" onClick={() => handleSync('STU-2026-8812')}>
                                    Sync to Registrar
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
