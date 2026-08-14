import React, { useState } from 'react';
import { Card, Badge, Button, PageHeader, Modal } from '@university-erp/ui-kit';
import { useTranscriptRequests } from './Certification.hooks';

export const TranscriptRequestsPage: React.FC = () => {
    const { data: requests = [], isLoading } = useTranscriptRequests();
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    // Mock data mapped to Kanban columns for UI demonstration
    const pipeline = {
        pending: [
            { id: 'REQ-8831', requester: 'Alex Mercer (STU-2024-0012)', type: 'Official Transcript (TOR)', purpose: 'Transfer Evaluation', status: 'Pending Verification', date: 'Aug 14, 2026' },
            { id: 'REQ-8832', requester: 'Sarah Jenkins (STU-2022-0414)', type: 'Certificate of Enrollment', purpose: 'Scholarship', status: 'Pending Verification', date: 'Aug 14, 2026' }
        ],
        processing: [
            { id: 'REQ-8820', requester: 'Michael Chang (STU-2023-1102)', type: 'Official Transcript (TOR)', purpose: 'Employment', status: 'Generating PDF', date: 'Aug 12, 2026' }
        ],
        ready: [
            { id: 'REQ-8815', requester: 'Emma Watson (STU-2022-0491)', type: 'Certificate of Grades', purpose: 'Personal Copy', status: 'Ready for Pickup', date: 'Aug 10, 2026' }
        ]
    };

    const handleAdvancePhase = () => {
        setIsProcessing(true);
        setTimeout(() => {
            alert(`Request ${selectedRequest.id} advanced to the next processing phase.`);
            setIsProcessing(false);
            setSelectedRequest(null);
        }, 800);
    };

    const RequestCard = ({ req }: { req: any }) => (
        <div 
            onClick={() => setSelectedRequest(req)}
            style={{
                padding: 'var(--space-3)',
                background: 'var(--bg-elevated, var(--bg-surface))',
                border: '1px solid var(--border-subtle, var(--border-color))',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-3)',
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.1s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle, var(--border-color))'}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ fontFamily: 'monospace', color: 'var(--text-bright, var(--text-primary))' }}>{req.id}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.date}</span>
            </div>
            <div style={{ fontWeight: 600, color: 'var(--brand-primary)', marginBottom: '4px' }}>{req.type}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{req.requester}</div>
        </div>
    );

    return (
        <div className="fade-in">
            <PageHeader 
                title="Document Request Center" 
                subtitle="Manage official records, certifications, and transcript issuances." 
            />
            
            {/* Kanban Board Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)', minHeight: '60vh' }}>
                
                {/* Column 1: Pending Verification */}
                <Card style={{ background: 'var(--bg-surface)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '2px solid var(--warning-text, #f59e0b)' }}>
                        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>Verification Queue</h3>
                        <Badge colorScheme="warning">{pipeline.pending.length}</Badge>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {pipeline.pending.map(req => <RequestCard key={req.id} req={req} />)}
                    </div>
                </Card>

                {/* Column 2: Processing & Printing */}
                <Card style={{ background: 'var(--bg-surface)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '2px solid var(--info-text, #3b82f6)' }}>
                        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>Processing</h3>
                        <Badge colorScheme="info">{pipeline.processing.length}</Badge>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {pipeline.processing.map(req => <RequestCard key={req.id} req={req} />)}
                    </div>
                </Card>

                {/* Column 3: Ready for Release */}
                <Card style={{ background: 'var(--bg-surface)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '2px solid var(--success-text, #10b981)' }}>
                        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>Ready for Release</h3>
                        <Badge colorScheme="success">{pipeline.ready.length}</Badge>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {pipeline.ready.map(req => <RequestCard key={req.id} req={req} />)}
                    </div>
                </Card>
            </div>

            {/* Document Lifecycle Modal */}
            {selectedRequest && (
                <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)}>
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-bright, var(--text-primary))' }}>Request Details</h2>
                            <Badge colorScheme="info">{selectedRequest.status}</Badge>
                        </div>
                        <div style={{ color: 'var(--text-secondary)' }}>Ticket: <span style={{ fontFamily: 'monospace' }}>{selectedRequest.id}</span></div>
                    </div>

                    <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Student</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedRequest.requester}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Document Type</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedRequest.type}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Declared Purpose</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedRequest.purpose}</span>
                        </div>
                    </div>

                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Processing Lifecycle</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', color: 'var(--text-primary)', background: 'var(--bg-elevated, var(--bg-surface))', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <li style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle, var(--border-color))', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'var(--success-text, #10b981)', fontSize: '1.2rem' }}>✓</span> 
                            <div>
                                <strong style={{ display: 'block' }}>Requirements Checked</strong>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Clearance confirmed by Finance.</span>
                            </div>
                        </li>
                        <li style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-hover, var(--bg-base))' }}>
                            <span style={{ color: 'var(--brand-primary)', fontSize: '1.2rem' }}>⟳</span> 
                            <div>
                                <strong style={{ display: 'block', color: 'var(--brand-primary)' }}>Currently Generating PDF</strong>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Awaiting registrar officer signature.</span>
                            </div>
                        </li>
                    </ul>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setSelectedRequest(null)} disabled={isProcessing}>Close</Button>
                        <Button variant="primary" onClick={handleAdvancePhase} disabled={isProcessing}>
                            {isProcessing ? 'Processing...' : 'Advance to Next Phase'}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
