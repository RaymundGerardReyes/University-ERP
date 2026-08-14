import React, { useState } from 'react';
import { Badge, Button, Card, PageHeader, Table, Modal } from '@university-erp/ui-kit';
import { useProcessException, useRegistrationExceptions } from './Enrollment.hooks';

export const RegistrationExceptionsPage: React.FC = () => {
    const { data: exceptions, isLoading } = useRegistrationExceptions();
    const processMutation = useProcessException();
    
    // State for the Detail Modal/Drawer
    const [selectedException, setSelectedException] = useState<any | null>(null);
    const [rejectReason, setRejectReason] = useState(false);

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    const handleAction = (action: 'APPROVED' | 'REJECTED') => {
        if (selectedException) {
            processMutation.mutate({ id: selectedException.exceptionId, action });
            setSelectedException(null);
            setRejectReason(false);
        }
    };

    return (
        <div className="fade-in">
            <PageHeader
                title="Registration Exceptions"
                subtitle="Review requests for prerequisite waivers, overloads, and late registrations."
            />
            <Card style={{ padding: 0, overflow: 'hidden' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Type</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* If API is empty, render a mock row for demonstration */}
                        {(!exceptions || exceptions.length === 0) && (
                             <tr>
                                 <td><span style={{ fontFamily: 'monospace' }}>STU-2023-011</span></td>
                                 <td><Badge colorScheme="info">OVERLOAD</Badge></td>
                                 <td>Requesting 24 units for final semester.</td>
                                 <td><Badge colorScheme="warning">PENDING</Badge></td>
                                 <td>
                                     <Button variant="outline" size="small" onClick={() => setSelectedException({
                                         exceptionId: 'EXC-1', studentId: 'STU-2023-011', requestType: 'OVERLOAD', 
                                         reason: 'Requesting 24 units for final semester to graduate on time.', status: 'PENDING'
                                     })}>
                                         Review Request
                                     </Button>
                                 </td>
                             </tr>
                        )}
                        {exceptions?.map(exc => (
                            <tr key={exc.exceptionId}>
                                <td><span style={{ fontFamily: 'monospace' }}>{exc.studentId}</span></td>
                                <td><Badge colorScheme="info">{exc.requestType.replace('_', ' ')}</Badge></td>
                                <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exc.reason}</td>
                                <td>
                                    <Badge colorScheme={exc.status === 'PENDING' ? 'warning' : exc.status === 'APPROVED' ? 'success' : 'danger'}>
                                        {exc.status}
                                    </Badge>
                                </td>
                                <td>
                                    <Button variant="outline" size="small" onClick={() => setSelectedException(exc)}>
                                        Review Request
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            {/* Detail Review Modal */}
            {selectedException && (
                <Modal isOpen={!!selectedException} onClose={() => setSelectedException(null)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <div>
                            <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-bright, var(--text-primary))' }}>Exception Review</h2>
                            <div style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{selectedException.studentId}</div>
                        </div>
                        <Badge colorScheme="info">{selectedException.requestType.replace('_', ' ')}</Badge>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1, padding: '1rem', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Current GWA</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-text, #10b981)' }}>1.45</div>
                        </div>
                        <div style={{ flex: 1, padding: '1rem', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Current Load</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning-text, #f59e0b)' }}>21 / 21</div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Student Justification</h4>
                        <p style={{ background: 'var(--bg-elevated, var(--bg-surface))', padding: '1rem', borderRadius: '4px', borderLeft: '3px solid var(--brand-primary)', margin: 0 }}>
                            "{selectedException.reason}"
                        </p>
                    </div>

                    {rejectReason ? (
                        <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--danger-border, var(--border-color))', borderRadius: 'var(--radius-md)', background: 'var(--danger-bg, rgba(239, 68, 68, 0.1))' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--danger-text, #ef4444)', fontWeight: 600 }}>Rejection Reason (Required)</label>
                            <textarea 
                                rows={3} 
                                style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-bright, var(--text-primary))', borderRadius: '4px', resize: 'none' }}
                                placeholder="Explain why this request is denied..."
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                                <Button variant="ghost" size="small" onClick={() => setRejectReason(false)}>Cancel</Button>
                                <Button variant="danger" size="small" onClick={() => handleAction('REJECTED')}>Confirm Rejection</Button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <Button variant="danger" onClick={() => setRejectReason(true)}>Deny Request</Button>
                            <Button variant="success" onClick={() => handleAction('APPROVED')}>Approve Overload</Button>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
};