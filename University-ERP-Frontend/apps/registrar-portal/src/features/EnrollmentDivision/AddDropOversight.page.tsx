import React, { useState } from 'react';
import { Badge, Card, PageHeader, Button } from '@university-erp/ui-kit';
import { useAddDropRequests } from './Enrollment.hooks';

export const AddDropOversightPage: React.FC = () => {
    const { data: requests, isLoading } = useAddDropRequests();
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    // Mock data for UI demonstration to ensure a rich preview
    const mockRequests = [
        { 
            requestId: 'AD-2026-001', studentId: 'STU-2024-0012', studentName: 'Alex Mercer', 
            action: 'ADD', courseCode: 'CS301', sectionId: 'CS301-A', courseTitle: 'Software Engineering',
            reason: 'Need this to stay on track for my minor requirements.', status: 'PENDING_APPROVAL', 
            currentUnits: 15, resultingUnits: 18 
        },
        { 
            requestId: 'AD-2026-002', studentId: 'STU-2023-1102', studentName: 'Michael Chang', 
            action: 'DROP', courseCode: 'PE104', sectionId: 'PE104-B', courseTitle: 'Physical Education IV',
            reason: 'Schedule conflict with my newly assigned part-time job shift.', status: 'PENDING_APPROVAL', 
            currentUnits: 21, resultingUnits: 19 
        }
    ];

    const displayRequests = requests && requests.length > 0 ? requests : mockRequests;

    const handleDecision = (decision: 'APPROVED' | 'REJECTED') => {
        setIsProcessing(true);
        // Simulate backend workflow API call
        setTimeout(() => {
            alert(`Request ${selectedRequest.requestId} has been ${decision}.`);
            setIsProcessing(false);
            setSelectedRequest(null);
        }, 800);
    };

    return (
        <div className="fade-in">
            <PageHeader
                title="Add/Drop Oversight"
                subtitle="Monitor and process manual course adjustments during the revision period."
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)', height: '70vh' }}>
                
                {/* Left Pane: Request Queue */}
                <Card style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-base)' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-bright, var(--text-primary))' }}>Pending Adjustments</h3>
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {displayRequests.map((req: any) => (
                            <div 
                                key={req.requestId}
                                onClick={() => setSelectedRequest(req)}
                                style={{
                                    padding: 'var(--space-4)',
                                    borderBottom: '1px solid var(--border-subtle, var(--border-color))',
                                    cursor: 'pointer',
                                    background: selectedRequest?.requestId === req.requestId ? 'var(--bg-active, var(--bg-hover))' : 'transparent',
                                    borderLeft: `4px solid ${req.action === 'ADD' ? 'var(--success-text, #10b981)' : 'var(--danger-text, #ef4444)'}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <strong style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{req.requestId}</strong>
                                    <Badge colorScheme={req.action === 'ADD' ? 'success' : 'danger'}>{req.action}</Badge>
                                </div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{req.studentName}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.courseCode} ({req.sectionId})</div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Right Pane: Adjustment Detail View */}
                <Card style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {selectedRequest ? (
                        <>
                            <div style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h2 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-bright, var(--text-primary))' }}>Adjustment Review</h2>
                                        <div style={{ color: 'var(--text-secondary)' }}>Student: <strong style={{ color: 'var(--text-primary)' }}>{selectedRequest.studentName}</strong> ({selectedRequest.studentId})</div>
                                    </div>
                                    <Badge colorScheme="warning">PENDING</Badge>
                                </div>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto' }}>
                                {/* Target Course Block */}
                                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase' }}>Target Section</h4>
                                <div style={{ 
                                    padding: '1rem', 
                                    background: 'var(--bg-base)', 
                                    borderRadius: 'var(--radius-md)', 
                                    border: '1px solid var(--border-color)',
                                    borderLeft: `4px solid ${selectedRequest.action === 'ADD' ? 'var(--success-text, #10b981)' : 'var(--danger-text, #ef4444)'}`,
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <strong style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--text-bright, var(--text-primary))' }}>{selectedRequest.sectionId}</strong>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{selectedRequest.courseTitle}</div>
                                    </div>
                                    <div style={{ textAlign: 'right', fontWeight: 600, color: selectedRequest.action === 'ADD' ? 'var(--success-text, #10b981)' : 'var(--danger-text, #ef4444)' }}>
                                        {selectedRequest.action === 'ADD' ? '+ Adding to Schedule' : '- Dropping from Schedule'}
                                    </div>
                                </div>

                                {/* Impact Analysis & Reason */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: '1.5rem' }}>
                                    <div style={{ background: 'var(--bg-elevated, var(--bg-surface))', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Load Impact Analysis</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                            <span style={{ color: 'var(--text-primary)' }}>{selectedRequest.currentUnits} U</span>
                                            <span style={{ color: 'var(--text-muted)' }}>→</span>
                                            <span style={{ color: selectedRequest.action === 'ADD' ? 'var(--warning-text, #f59e0b)' : 'var(--info-text, #3b82f6)' }}>
                                                {selectedRequest.resultingUnits} U
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ background: 'var(--bg-elevated, var(--bg-surface))', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Student Justification</div>
                                        <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                                            "{selectedRequest.reason}"
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Controls */}
                            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <Button 
                                    variant="danger" 
                                    disabled={isProcessing} 
                                    onClick={() => handleDecision('REJECTED')}
                                >
                                    Reject Request
                                </Button>
                                <Button 
                                    variant="primary" 
                                    disabled={isProcessing} 
                                    onClick={() => handleDecision('APPROVED')}
                                >
                                    {isProcessing ? 'Processing...' : `Approve ${selectedRequest.action}`}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>⚖️</div>
                            <h3>No Request Selected</h3>
                            <p>Select an adjustment request from the queue to evaluate.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};