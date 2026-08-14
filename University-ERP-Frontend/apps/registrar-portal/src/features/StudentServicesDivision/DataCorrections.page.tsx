import React, { useState } from 'react';
import { Card, Table, Badge, Button, Modal, PageHeader, FormInput, EmptyState } from '@university-erp/ui-kit';

export const DataCorrectionsPage: React.FC = () => {
    // State for managing the selected correction request and strict confirmation
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [confirmText, setConfirmText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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

    const totalRequests = requests.length;
    const pendingReviews = requests.filter(req => req.status === 'Awaiting Review').length;

    const filteredRequests = requests.filter(req => 
        req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (requests.length === 0) {
        return (
            <div className="fade-in" style={{ padding: 'var(--space-4)' }}>
                <PageHeader title="Data Corrections Queue" subtitle="Review, verify, and safely process sensitive student identity updates." />
                <EmptyState title="Queue Empty" description="There are no pending identity data correction requests at this time." icon="✅" />
            </div>
        );
    }

    return (
        <div className="fade-in" style={{ padding: 'var(--space-4)' }}>
            <PageHeader 
                title="Data Corrections Queue" 
                subtitle="Review, verify, and safely process sensitive student identity updates." 
            />
            
            {/* KPI STATS */}
            <div className="grid-stats" style={{ marginBottom: 'var(--space-6)' }}>
                <Card style={{ borderLeft: '4px solid var(--brand-primary)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Requests</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-bright)' }}>{totalRequests}</div>
                </Card>
                <Card style={{ borderLeft: '4px solid var(--warning-text)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Awaiting Review</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-text)' }}>{pendingReviews}</div>
                </Card>
            </div>

            {/* TOOLBAR */}
            <div className="toolbar">
                <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <FormInput 
                        placeholder="Search by ID or Student Name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="toolbar-actions">
                    <Button variant="outline">Filter: All Statuses</Button>
                </div>
            </div>

            {/* DESKTOP VIEW: TABLE */}
            <div className="desktop-only fade-in">
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="data-table-container">
                        <Table>
                            <thead>
                                <tr>
                                    <th>Request ID</th>
                                    <th>Target Student</th>
                                    <th>Field to Change</th>
                                    <th>Evidence</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map((req) => (
                                    <tr key={req.id}>
                                        <td><span style={{ fontFamily: 'monospace' }}>{req.id}</span></td>
                                        <td>
                                            <strong style={{ color: 'var(--text-primary)' }}>{req.studentName}</strong> <br/>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{req.studentId}</span>
                                        </td>
                                        <td>{req.fieldToChange}</td>
                                        <td><Badge colorScheme="info">1 Document</Badge></td>
                                        <td><Badge colorScheme={req.status === 'Awaiting Review' ? 'warning' : 'success'}>{req.status}</Badge></td>
                                        <td style={{ textAlign: 'right' }}>
                                            <Button variant="outline" size="small" onClick={() => setSelectedRequest(req)}>
                                                Review Request
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredRequests.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>No matches found for "{searchTerm}"</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            </div>

            {/* MOBILE VIEW: CARDS */}
            <div className="mobile-only flex-stack fade-in">
                {filteredRequests.map((req) => (
                    <Card key={req.id}>
                        <div className="card-accent-top" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--brand-primary)' }}>{req.id}</span>
                            <Badge colorScheme={req.status === 'Awaiting Review' ? 'warning' : 'success'}>{req.status}</Badge>
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-1)', fontSize: '1.1rem', color: 'var(--text-bright)' }}>{req.studentName}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            ID: <span style={{ fontFamily: 'monospace' }}>{req.studentId}</span>
                        </p>
                        <div style={{ margin: 'var(--space-3) 0', padding: 'var(--space-2)', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Field to Change</div>
                            <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{req.fieldToChange}</div>
                        </div>
                        <Button 
                            variant="outline" 
                            style={{ width: '100%' }}
                            onClick={() => setSelectedRequest(req)}
                        >
                            Review Request
                        </Button>
                    </Card>
                ))}
                {filteredRequests.length === 0 && (
                    <Card style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>No matches found for "{searchTerm}"</span>
                    </Card>
                )}
            </div>

            {/* Strict Confirmation Review Modal */}
            {selectedRequest && (
                <Modal isOpen={!!selectedRequest} onClose={handleCloseModal}>
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-bright, var(--text-primary))' }}>Identity Data Correction Review</h2>
                        <div style={{ color: 'var(--text-secondary)' }}>Ticket: <span style={{ fontFamily: 'monospace' }}>{selectedRequest.id}</span></div>
                    </div>

                    <div className="flex-stack" style={{ gap: 'var(--space-4)', marginBottom: '1.5rem', flexDirection: 'row', flexWrap: 'wrap' }}>
                        {/* Current Value Display */}
                        <div style={{ flex: 1, minWidth: '200px', padding: '1rem', background: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Current Database Record</div>
                            <div style={{ fontSize: '1.1rem', color: 'var(--danger-text, #ef4444)', textDecoration: 'line-through' }}>
                                {selectedRequest.currentValue}
                            </div>
                        </div>

                        {/* Requested Value Display */}
                        <div style={{ flex: 1, minWidth: '200px', padding: '1rem', background: 'var(--success-bg, rgba(16, 185, 129, 0.1))', border: '1px solid var(--success-border, #10b981)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--success-text, #10b981)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Requested Change</div>
                            <div style={{ fontSize: '1.1rem', color: 'var(--text-bright, var(--text-primary))', fontWeight: 600 }}>
                                {selectedRequest.requestedValue}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Submitted Evidence</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated, var(--bg-surface))', padding: '1rem', borderRadius: '4px', borderLeft: '3px solid var(--info-text, #3b82f6)' }}>
                            <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)', wordBreak: 'break-all' }}>📄 {selectedRequest.evidence}</span>
                            <Button variant="secondary" size="small" style={{ flexShrink: 0 }}>View Document</Button>
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

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
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
