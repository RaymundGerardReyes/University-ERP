import React, { useState } from 'react';
import { Card, Table, Badge, Button, Modal, PageHeader, FormInput } from '@university-erp/ui-kit';

export const DataCorrectionsPage: React.FC = () => {
    // State for managing the selected correction request and strict confirmation
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [confirmText, setConfirmText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Mock data for UI demonstration
    const requests = [
        {
            id: 'COR-9192',
            studentId: 'STU-2022-0411',
            studentName: 'Maria Garcia',
            fieldToChange: 'Civil Status & Last Name',
            currentValue: 'Maria Garcia (Single)',
            requestedValue: 'Maria Garcia-Smith (Married)',
            evidence: 'Marriage_Certificate_Signed.pdf',
            status: 'Awaiting Review',
            submittedAt: '2026-08-12T10:30:00Z'
        },
        {
            id: 'COR-9195',
            studentId: 'STU-2024-0012',
            studentName: 'Alex Mercer',
            fieldToChange: 'Date of Birth',
            currentValue: '1999-05-14',
            requestedValue: '1999-05-24',
            evidence: 'Birth_Certificate_PSA.pdf',
            status: 'Awaiting Review',
            submittedAt: '2026-08-13T14:15:00Z'
        }
    ];

    const handleCloseModal = () => {
        setSelectedRequest(null);
        setConfirmText('');
    };

    const handleApproveCorrection = () => {
        setIsProcessing(true);
        // Simulate backend workflow SDK call: IdentityWorkflow.process()
        setTimeout(() => {
            alert(`Correction for ${selectedRequest.studentName} approved. Audit ledger updated.`);
            setIsProcessing(false);
            handleCloseModal();
        }, 800);
    };

    return (
        <div className="fade-in">
            <PageHeader 
                title="Data Corrections Queue" 
                subtitle="Review, verify, and safely process sensitive student identity updates." 
            />
            
            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Target Student</th>
                            <th>Field to Change</th>
                            <th>Evidence</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req.id}>
                                <td><span style={{ fontFamily: 'monospace' }}>{req.id}</span></td>
                                <td><strong>{req.studentName}</strong> <br/><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.studentId}</span></td>
                                <td>{req.fieldToChange}</td>
                                <td><Badge colorScheme="info">1 Document</Badge></td>
                                <td><Badge colorScheme="warning">{req.status}</Badge></td>
                                <td>
                                    <Button variant="outline" size="small" onClick={() => setSelectedRequest(req)}>
                                        Review Request
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            {/* Strict Confirmation Review Modal */}
            {selectedRequest && (
                <Modal isOpen={!!selectedRequest} onClose={handleCloseModal}>
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-bright, var(--text-primary))' }}>Identity Data Correction Review</h2>
                        <div style={{ color: 'var(--text-secondary)' }}>Ticket: <span style={{ fontFamily: 'monospace' }}>{selectedRequest.id}</span></div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: '1.5rem' }}>
                        {/* Current Value Display */}
                        <div style={{ padding: '1rem', background: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Current Database Record</div>
                            <div style={{ fontSize: '1.1rem', color: 'var(--danger-text, #ef4444)', textDecoration: 'line-through' }}>
                                {selectedRequest.currentValue}
                            </div>
                        </div>

                        {/* Requested Value Display */}
                        <div style={{ padding: '1rem', background: 'var(--success-bg, rgba(16, 185, 129, 0.1))', border: '1px solid var(--success-border, #10b981)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--success-text, #10b981)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Requested Change</div>
                            <div style={{ fontSize: '1.1rem', color: 'var(--text-bright, var(--text-primary))', fontWeight: 600 }}>
                                {selectedRequest.requestedValue}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Submitted Evidence</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated, var(--bg-surface))', padding: '1rem', borderRadius: '4px', borderLeft: '3px solid var(--info-text, #3b82f6)' }}>
                            <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>📄 {selectedRequest.evidence}</span>
                            <Button variant="secondary" size="small">View Document</Button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--danger-border, var(--border-color))', borderRadius: 'var(--radius-md)', background: 'var(--bg-base)' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--danger-text, #ef4444)' }}>⚠️ Commit Permanent Identity Update</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            Approving this request modifies the student's core identity record. This action will be logged in the immutable Access Audit ledger under your User ID.
                        </p>
                        <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                            Type <strong>CONFIRM</strong> to authorize this correction:
                        </label>
                        <FormInput 
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="CONFIRM"
                            style={{ background: 'var(--bg-surface)', color: 'var(--text-bright, var(--text-primary))' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={handleCloseModal} disabled={isProcessing}>Cancel</Button>
                        <Button variant="danger" disabled={isProcessing}>Reject Request</Button>
                        <Button 
                            variant="primary" 
                            disabled={confirmText !== 'CONFIRM' || isProcessing} 
                            onClick={handleApproveCorrection}
                        >
                            {isProcessing ? 'Auditing & Updating...' : 'Approve & Update Record'}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
