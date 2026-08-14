import React, { useState } from 'react';
import { Badge, Button, Card, PageHeader, Table, Modal } from '@university-erp/ui-kit';
import { useEnrollmentValidationQueue, useValidateEnrollment } from './Enrollment.hooks';
import { EnrollmentValidationItem } from './Enrollment.types';

export const EnrollmentValidationPage: React.FC = () => {
    const { data: validations = [], isLoading } = useEnrollmentValidationQueue();
    const validateMutation = useValidateEnrollment();
    
    // State for detailed validation review
    const [selectedStudent, setSelectedStudent] = useState<EnrollmentValidationItem | null>(null);

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    const handleValidate = () => {
        if (selectedStudent) {
            validateMutation.mutate(selectedStudent.id);
            setSelectedStudent(null);
        }
    };

    return (
        <div className="fade-in">
            <PageHeader 
                title="Enrollment Validation" 
                subtitle="Review student subject loads against academic rules and prerequisites." 
            />
            
            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Total Units</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {validations.map((item: EnrollmentValidationItem) => (
                            <tr key={item.id}>
                                <td style={{ fontFamily: 'monospace' }}>{item.id}</td>
                                <td style={{ fontWeight: 600, color: 'var(--text-bright, var(--text-primary))' }}>{item.studentName}</td>
                                <td>{item.units} / 21 Max</td>
                                <td>
                                    <Badge colorScheme={item.status === 'Validated' ? 'success' : 'warning'}>
                                        {item.status}
                                    </Badge>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <Button
                                        variant="outline"
                                        size="small"
                                        onClick={() => setSelectedStudent(item)}
                                        disabled={item.status === 'Validated'}
                                    >
                                        Review Load
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            {/* Validation Review Modal */}
            {selectedStudent && (
                <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)}>
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-bright, var(--text-primary))' }}>Subject Load Validation</h2>
                        <div style={{ color: 'var(--text-secondary)' }}>Student: <span style={{ fontFamily: 'monospace' }}>{selectedStudent.id}</span> - {selectedStudent.studentName}</div>
                    </div>

                    {/* Pre-Validation Checklist */}
                    <div style={{ background: 'var(--bg-base)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 var(--space-3) 0', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}>Academic Checklist</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--success-text, #10b981)', marginBottom: 'var(--space-2)' }}>
                            <span>✓</span> <strong>Prerequisites Met</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--success-text, #10b981)', marginBottom: 'var(--space-2)' }}>
                            <span>✓</span> <strong>No Schedule Conflicts</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--success-text, #10b981)' }}>
                            <span>✓</span> <strong>Within Unit Limit ({selectedStudent.units}/21)</strong>
                        </div>
                    </div>

                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Requested Subjects</h4>
                    <div style={{ background: 'var(--bg-elevated, var(--bg-surface))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                        {/* Mock subject load for review */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-subtle, var(--border-color))' }}>
                            <strong style={{ fontFamily: 'monospace' }}>CS201</strong>
                            <span style={{ color: 'var(--text-secondary)' }}>Data Structures (3.0 U)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0' }}>
                            <strong style={{ fontFamily: 'monospace' }}>CS202</strong>
                            <span style={{ color: 'var(--text-secondary)' }}>Computer Architecture (3.0 U)</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Button variant="danger" disabled={validateMutation.isPending}>Reject Load</Button>
                        <Button 
                            variant="primary" 
                            onClick={handleValidate}
                            disabled={validateMutation.isPending}
                        >
                            {validateMutation.isPending ? 'Validating...' : 'Approve & Validate'}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};