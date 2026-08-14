import React, { useState } from 'react';
import { Card, Table, Badge, Button, PageHeader, Modal } from '@university-erp/ui-kit';

export const AcademicRecordInitializationPage: React.FC = () => {
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
    const [isInitializing, setIsInitializing] = useState(false);

    // Mock data for students who have an ID but lack an academic container
    const pendingInitialization = [
        { id: 'STU-2026-0182', name: 'John Doe', program: 'BS Computer Science', curriculumYear: '2026-2027', status: 'Pending Init' },
        { id: 'STU-2026-0183', name: 'Jane Smith', program: 'BS Information Technology', curriculumYear: '2026-2027', status: 'Pending Init' },
    ];

    const handleInitialize = () => {
        setIsInitializing(true);
        // Simulate backend workflow SDK call: AcademicRecordWorkflow.process()
        setTimeout(() => {
            alert(`Empty academic ledger and curriculum map generated for ${selectedStudent.id}. They may now log in and register for classes.`);
            setIsInitializing(false);
            setSelectedStudent(null);
        }, 1200);
    };

    return (
        <div className="fade-in">
            <PageHeader 
                title="Academic Record Initialization" 
                subtitle="Create the initial empty grade record and curriculum map for new students." 
            />
            
            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Target Program</th>
                            <th>Curriculum Year</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingInitialization.map((student) => (
                            <tr key={student.id}>
                                <td style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--brand-primary)' }}>{student.id}</td>
                                <td style={{ fontWeight: 600, color: 'var(--text-bright, var(--text-primary))' }}>{student.name}</td>
                                <td>{student.program}</td>
                                <td>{student.curriculumYear}</td>
                                <td><Badge colorScheme="warning">{student.status}</Badge></td>
                                <td style={{ textAlign: 'right' }}>
                                    <Button variant="outline" size="small" onClick={() => setSelectedStudent(student)}>
                                        Setup Container
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            {/* Initialization Modal */}
            {selectedStudent && (
                <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)}>
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-bright, var(--text-primary))' }}>Initialize Academic Record</h2>
                        <div style={{ color: 'var(--text-secondary)' }}>Student: <span style={{ fontFamily: 'monospace' }}>{selectedStudent.id}</span> - {selectedStudent.name}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Base Curriculum</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{selectedStudent.program}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Effective AY {selectedStudent.curriculumYear}</div>
                        </div>
                        <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--warning-text, #f59e0b)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Record State</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>UNINITIALIZED</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Registration Blocked</div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Year 1, Semester 1 Map Preview</h4>
                        <div style={{ background: 'var(--bg-elevated, var(--bg-surface))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-subtle, var(--border-color))' }}>
                                <strong style={{ fontFamily: 'monospace' }}>CS101</strong>
                                <span style={{ color: 'var(--text-secondary)' }}>Intro to Programming</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-subtle, var(--border-color))' }}>
                                <strong style={{ fontFamily: 'monospace' }}>ENG101</strong>
                                <span style={{ color: 'var(--text-secondary)' }}>Purposive Communication</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0' }}>
                                <strong style={{ fontFamily: 'monospace' }}>MTH101</strong>
                                <span style={{ color: 'var(--text-secondary)' }}>Calculus I</span>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                            These base subjects will be injected into the student's empty academic ledger.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setSelectedStudent(null)} disabled={isInitializing}>Cancel</Button>
                        <Button variant="primary" onClick={handleInitialize} disabled={isInitializing}>
                            {isInitializing ? 'Bootstrapping Record...' : 'Initialize Academic Container'}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
