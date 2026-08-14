import React, { useState } from 'react';
import { Card, Table, Badge, Button, PageHeader, Modal } from '@university-erp/ui-kit';

export const AdmissionsQueuePage: React.FC = () => {
    const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);

    // Mock data based on the UX Blueprint requirements
    const queue = [
        { id: 'APP-2026-088', name: 'James Wilson', program: 'BS Architecture', gpa: '3.8', status: 'Pending Review', age: '2 days', priority: 'High' },
        { id: 'APP-2026-092', name: 'Elena Rostova', program: 'BA Communication', gpa: '3.5', status: 'Pending Review', age: '5 hours', priority: 'Normal' },
        { id: 'APP-2026-104', name: 'David Chen', program: 'BS Computer Science', gpa: '2.9', status: 'Missing Docs', age: '4 days', priority: 'Normal' },
    ];

    return (
        <div className="fade-in">
            <PageHeader 
                title="Admissions Queue" 
                subtitle="Evaluate incoming applications, verify documents, and endorse to faculty." 
            />
            
            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Application ID</th>
                            <th>Applicant Details</th>
                            <th>Target Program</th>
                            <th>Age in Queue</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queue.map(app => (
                            <tr key={app.id}>
                                <td style={{ fontFamily: 'monospace' }}>
                                    {app.id}
                                    {app.priority === 'High' && <Badge colorScheme="danger" style={{ marginLeft: '8px' }}>Priority</Badge>}
                                </td>
                                <td>
                                    <strong style={{ color: 'var(--text-bright, var(--text-primary))' }}>{app.name}</strong>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Prev. GPA: {app.gpa}</div>
                                </td>
                                <td>{app.program}</td>
                                <td style={{ color: 'var(--text-muted)' }}>{app.age}</td>
                                <td>
                                    <Badge colorScheme={app.status === 'Missing Docs' ? 'danger' : 'warning'}>
                                        {app.status}
                                    </Badge>
                                </td>
                                <td>
                                    <Button variant="outline" size="small" onClick={() => setSelectedApplicant(app)}>
                                        Review File
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            {/* Application Evaluation Modal */}
            {selectedApplicant && (
                <Modal isOpen={!!selectedApplicant} onClose={() => setSelectedApplicant(null)}>
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-bright, var(--text-primary))' }}>Applicant Review</h2>
                        <div style={{ color: 'var(--text-secondary)' }}>Application: <span style={{ fontFamily: 'monospace' }}>{selectedApplicant.id}</span></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Applicant Profile</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{selectedApplicant.name}</div>
                            {selectedApplicant.status !== 'Missing Docs' ? (
                                <div style={{ fontSize: '0.85rem', color: 'var(--success-text, #10b981)' }}>✓ Documents Verified</div>
                            ) : (
                                <div style={{ fontSize: '0.85rem', color: 'var(--danger-text, #ef4444)' }}>⚠ Missing Requirements</div>
                            )}
                        </div>
                        <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--brand-primary)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Target Program</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{selectedApplicant.program}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Evaluated GPA: {selectedApplicant.gpa}</div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Submitted Evidence</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated, var(--bg-surface))', padding: '1rem', borderRadius: '4px', marginBottom: '8px' }}>
                            <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>📄 High_School_Transcript.pdf</span>
                            <Button variant="secondary" size="small">Preview File</Button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated, var(--bg-surface))', padding: '1rem', borderRadius: '4px' }}>
                            <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>📄 ID_Verification.pdf</span>
                            <Button variant="secondary" size="small">Preview File</Button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                        <Button variant="danger">Reject Application</Button>
                        <Button variant="warning">Request Missing Info</Button>
                        <Button variant="primary" onClick={() => setSelectedApplicant(null)}>Endorse to Faculty</Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
