import React, { useState } from 'react';
import { Card, Table, Badge, Button, PageHeader, Modal } from '@university-erp/ui-kit';

export const FacultyEndorsementsPage: React.FC = () => {
    const [selectedEndorsement, setSelectedEndorsement] = useState<any | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Mock data for UI demonstration based on the admissions pipeline
    const endorsements = [
        {
            id: 'APP-2026-088',
            name: 'James Wilson',
            program: 'BS Architecture',
            faculty: 'Arch. Sarah Jenkins (Chairperson)',
            date: 'Aug 14, 2026',
            status: 'Endorsed',
            remarks: 'Applicant shows exceptional spatial reasoning in their portfolio. Highly recommended for the Fall intake.'
        },
        {
            id: 'APP-2026-091',
            name: 'Maria Clara',
            program: 'BS Nursing',
            faculty: 'Dr. Roberto Gomez (Dean)',
            date: 'Aug 13, 2026',
            status: 'Waitlisted',
            remarks: 'Strong academic background, but our clinical slots are currently full. Place on priority waitlist.'
        }
    ];

    const handleForwardAction = (action: 'FORWARD' | 'RETURN') => {
        setIsProcessing(true);
        // Simulate backend workflow SDK call: AdmissionWorkflow.advance()
        setTimeout(() => {
            alert(`Application successfully processed and routed.`);
            setIsProcessing(false);
            setSelectedEndorsement(null);
        }, 800);
    };

    return (
        <div className="fade-in">
            <PageHeader 
                title="Faculty Endorsements" 
                subtitle="Review academic department decisions and route applicants to enrollment activation." 
            />
            
            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Application ID</th>
                            <th>Applicant Name</th>
                            <th>Target Program</th>
                            <th>Endorsing Faculty</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {endorsements.map((end) => (
                            <tr key={end.id}>
                                <td style={{ fontFamily: 'monospace' }}>{end.id}</td>
                                <td><strong style={{ color: 'var(--text-bright, var(--text-primary))' }}>{end.name}</strong></td>
                                <td>{end.program}</td>
                                <td>{end.faculty}</td>
                                <td>
                                    <Badge colorScheme={end.status === 'Endorsed' ? 'success' : 'warning'}>
                                        {end.status}
                                    </Badge>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <Button variant="outline" size="small" onClick={() => setSelectedEndorsement(end)}>
                                        Review Decision
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            {/* Endorsement Review Modal */}
            {selectedEndorsement && (
                <Modal isOpen={!!selectedEndorsement} onClose={() => setSelectedEndorsement(null)}>
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-bright, var(--text-primary))' }}>Department Endorsement Review</h2>
                        <div style={{ color: 'var(--text-secondary)' }}>Application: <span style={{ fontFamily: 'monospace' }}>{selectedEndorsement.id}</span></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: '1.5rem' }}>
                        {/* Applicant Summary */}
                        <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Applicant</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{selectedEndorsement.name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedEndorsement.program}</div>
                        </div>

                        {/* Faculty Summary */}
                        <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${selectedEndorsement.status === 'Endorsed' ? 'var(--success-text, #10b981)' : 'var(--warning-text, #f59e0b)'}` }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Academic Decision</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{selectedEndorsement.status.toUpperCase()}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>By: {selectedEndorsement.faculty}</div>
                        </div>
                    </div>

                    {/* Verbatim Remarks */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Faculty Remarks</h4>
                        <div style={{ 
                            background: 'var(--bg-elevated, var(--bg-surface))', 
                            padding: '1rem', 
                            borderRadius: '4px', 
                            borderLeft: '3px solid var(--brand-primary)',
                            fontStyle: 'italic',
                            color: 'var(--text-bright, var(--text-primary))'
                        }}>
                            "{selectedEndorsement.remarks}"
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'right' }}>
                            Logged on: {selectedEndorsement.date}
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                        <Button 
                            variant="ghost" 
                            onClick={() => handleForwardAction('RETURN')} 
                            disabled={isProcessing}
                        >
                            Return to Faculty
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={() => handleForwardAction('FORWARD')} 
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : 'Forward to Enrollment Activation'}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
