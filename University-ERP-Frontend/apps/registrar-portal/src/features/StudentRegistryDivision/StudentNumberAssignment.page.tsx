import React, { useState } from 'react';
import { Card, Table, Badge, Button, PageHeader, Modal } from '@university-erp/ui-kit';

export const StudentNumberAssignmentPage: React.FC = () => {
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
    const [isProvisioning, setIsProvisioning] = useState(false);

    // Mock data representing applicants who just passed Enrollment Activation
    const pendingAssignments = [
        { id: 'APP-2026-001', name: 'John Doe', program: 'BS Computer Science', term: 'AY 26-27, Sem 1', status: 'Awaiting ID' },
        { id: 'APP-2026-002', name: 'Jane Smith', program: 'BS Information Technology', term: 'AY 26-27, Sem 1', status: 'Awaiting ID' },
    ];

    const handleProvision = () => {
        setIsProvisioning(true);
        // Simulate backend workflow SDK call: IdentityWorkflow.process()
        setTimeout(() => {
            alert(`Official Student ID (STU-2026-XXXX) generated for ${selectedStudent.name}. LMS and SSO credentials are now provisioning.`);
            setIsProvisioning(false);
            setSelectedStudent(null);
        }, 1200);
    };

    return (
        <div className="fade-in">
            <PageHeader 
                title="Student Number Assignment" 
                subtitle="Provision official university IDs and trigger IT/LMS account creation." 
            />
            
            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Application Ref</th>
                            <th>Enrollee Name</th>
                            <th>Program</th>
                            <th>Entry Term</th>
                            <th>Pipeline Status</th>
                            <th style={{ textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingAssignments.map((student) => (
                            <tr key={student.id}>
                                <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{student.id}</td>
                                <td style={{ fontWeight: 600, color: 'var(--text-bright, var(--text-primary))' }}>{student.name}</td>
                                <td>{student.program}</td>
                                <td>{student.term}</td>
                                <td><Badge colorScheme="warning">{student.status}</Badge></td>
                                <td style={{ textAlign: 'right' }}>
                                    <Button variant="outline" size="small" onClick={() => setSelectedStudent(student)}>
                                        Assign Identity
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            {/* Provisioning Modal */}
            {selectedStudent && (
                <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)}>
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-bright, var(--text-primary))' }}>Identity Provisioning</h2>
                        <div style={{ color: 'var(--text-secondary)' }}>Enrollee: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedStudent.name}</span></div>
                    </div>

                    {/* Pipeline Sequence Visualization */}
                    <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)' }}>
                        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>Provisioning Sequence</h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--success-text, #10b981)' }}>
                                <span>✓</span> <span>1. FINANCIAL_CLEARANCE</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--success-text, #10b981)' }}>
                                <span>✓</span> <span>2. Enrollment Activation</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--brand-primary)', fontWeight: 'bold' }}>
                                <span>▶</span> <span>3. [Student Number Assignment]</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                                <span>⏸</span> <span>4. Identity / SSO Provisioning</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '2rem', background: 'var(--bg-elevated, var(--bg-surface))' }}>
                        <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                            Generating this identity will officially induct the student into the university directory.
                        </p>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <li>A permanent <strong>STU-YYYY-XXXX</strong> number will be minted.</li>
                            <li>University email (Microsoft 365 / Google Workspace) will be queued.</li>
                            <li>LMS access will be configured.</li>
                        </ul>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setSelectedStudent(null)} disabled={isProvisioning}>Cancel</Button>
                        <Button variant="primary" onClick={handleProvision} disabled={isProvisioning}>
                            {isProvisioning ? 'Minting Identity...' : 'Generate Official Student ID'}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
