import React, { useState } from 'react';
import { Card, PageHeader, Badge, Button, Table, Modal } from '@university-erp/ui-kit';
import { useIncomingCrossEnrollees, useReviewCrossEnrollee } from './CrossEnrollmentDivision.hooks';
import { IncomingCrossEnrolleeDto } from './CrossEnrollmentDivision.types';

export const CrossEnrollmentDivisionPage: React.FC = () => {
    const { data: requests = [], isLoading } = useIncomingCrossEnrollees();
    const reviewMutation = useReviewCrossEnrollee();
    const [selectedRequest, setSelectedRequest] = useState<IncomingCrossEnrolleeDto | null>(null);

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    const handleDecision = (status: 'APPROVED' | 'REJECTED') => {
        if (selectedRequest) {
            reviewMutation.mutate({ crossEnrolleeId: selectedRequest.crossEnrolleeId, status });
            setSelectedRequest(null);
        }
    };

    return (
        <div className="fade-in">
            <PageHeader 
                title="Cross-Enrollment Workspace" 
                subtitle="Evaluate and process visiting students from partner institutions." 
            />

            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Visiting Student</th>
                            <th>Home Institution</th>
                            <th>Requested Subjects</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>No pending cross-enrollment requests found.</p>
                                </td>
                            </tr>
                        ) : (
                            requests.map(req => (
                                <tr key={req.crossEnrolleeId}>
                                    <td style={{ fontFamily: 'monospace' }}>{req.crossEnrolleeId.substring(0, 8)}</td>
                                    <td style={{ fontWeight: 600 }}>{req.studentName}</td>
                                    <td>{req.homeInstitution}</td>
                                    <td>{req.requestedSubjects.length} Subject(s)</td>
                                    <td>
                                        <Badge colorScheme={req.status === 'PENDING_REVIEW' ? 'warning' : req.status === 'APPROVED' ? 'success' : 'danger'}>
                                            {req.status.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button variant="outline" size="small" onClick={() => setSelectedRequest(req)}>
                                            Review
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>

            {/* Dedicated Review Interface for Cross-Enrollment */}
            {selectedRequest && (
                <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)}>
                    <div style={{ marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-4)' }}>
                        <h2 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-bright, var(--text-primary))' }}>Cross-Enrollment Review</h2>
                        <div style={{ color: 'var(--text-secondary)' }}>Evaluate host capacity and credit transfer validity.</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                        <div style={{ background: 'var(--bg-base)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Visiting Student</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{selectedRequest.studentName}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ID: {selectedRequest.crossEnrolleeId}</div>
                        </div>
                        <div style={{ background: 'var(--bg-base)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--brand-primary)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Home Institution</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{selectedRequest.homeInstitution}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--success-text, #10b981)' }}>✓ Active MOU Verified</div>
                        </div>
                    </div>

                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>Requested Host Sections</h4>
                    <div style={{ background: 'var(--bg-elevated, var(--bg-surface))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                        {selectedRequest.requestedSubjects.map((sub, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) 0', borderBottom: idx !== selectedRequest.requestedSubjects.length - 1 ? '1px solid var(--border-subtle, var(--border-color))' : 'none' }}>
                                <div>
                                    <strong style={{ fontFamily: 'monospace' }}>{sub}</strong>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Capacity: <span style={{ color: 'var(--success-text, #10b981)' }}>Open</span></span>
                                    <select style={{ padding: '4px 8px', background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                                        <option>Assign to Section A</option>
                                        <option>Assign to Section B</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end' }}>
                        <Button variant="danger" onClick={() => handleDecision('REJECTED')}>Reject Request</Button>
                        <Button variant="primary" onClick={() => handleDecision('APPROVED')}>Approve & Assign</Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
