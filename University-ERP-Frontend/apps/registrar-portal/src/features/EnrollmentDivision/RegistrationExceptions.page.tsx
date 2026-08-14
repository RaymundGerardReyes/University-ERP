// src/features/EnrollmentDivision/RegistrationExceptions.page.tsx
import React, { useState } from 'react';
import { Badge, Button, Card, PageHeader, Table, Modal, FormInput, EmptyState } from '@university-erp/ui-kit';
import { useProcessException, useRegistrationExceptions } from './Enrollment.hooks';

export const RegistrationExceptionsPage: React.FC = () => {
    const { data: exceptions = [], isLoading } = useRegistrationExceptions();
    const processMutation = useProcessException();
    
    const [selectedException, setSelectedException] = useState<any | null>(null);
    const [rejectReason, setRejectReason] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    const handleAction = (action: 'APPROVED' | 'REJECTED') => {
        if (selectedException) {
            processMutation.mutate({ id: selectedException.exceptionId, action });
            setSelectedException(null);
            setRejectReason(false);
        }
    };

    const pendingCount = exceptions.filter((e: any) => e.status === 'PENDING').length;
    
    // Add our mock if the array is empty for UI demonstration
    const displayExceptions = exceptions.length > 0 ? exceptions : [
        {
            exceptionId: 'EXC-1', studentId: 'STU-2023-011', requestType: 'OVERLOAD',
            reason: 'Requesting 24 units for final semester to graduate on time.', status: 'PENDING'
        }
    ];

    const filteredExceptions = displayExceptions.filter((e: any) => 
        e.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.requestType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fade-in">
            <PageHeader
                title="Registration Exceptions"
                subtitle="Review requests for prerequisite waivers, overloads, and late registrations."
            />

            {/* KPI STATS */}
            <div className="grid-stats" style={{ marginBottom: 'var(--space-6)' }}>
                <Card style={{ borderLeft: '4px solid var(--warning-text)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Review</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-bright)' }}>{pendingCount || displayExceptions.length}</div>
                </Card>
            </div>

            {/* TOOLBAR */}
            <div className="toolbar">
                <div className="search-input-wrapper">
                    <span className="search-icon"> </span>
                    <FormInput 
                        placeholder="Search by Student ID or Exception Type..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* DESKTOP VIEW */}
            <div className="desktop-only fade-in">
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="data-table-container">
                        <Table>
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Type</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExceptions.map((exc: any) => (
                                    <tr key={exc.exceptionId}>
                                        <td><span style={{ fontFamily: 'monospace' }}>{exc.studentId}</span></td>
                                        <td><Badge colorScheme="info">{exc.requestType.replace('_', ' ')}</Badge></td>
                                        <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{exc.reason}</td>
                                        <td>
                                            <Badge colorScheme={exc.status === 'PENDING' ? 'warning' : exc.status === 'APPROVED' ? 'success' : 'danger'}>
                                                {exc.status}
                                            </Badge>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <Button variant="outline" size="small" onClick={() => setSelectedException(exc)}>
                                                Review Request
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredExceptions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>No records match your search.</span>
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
                {filteredExceptions.map((exc: any) => (
                    <Card key={exc.exceptionId}>
                        <div className="card-accent-top" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--brand-primary)' }}>{exc.studentId}</span>
                            <Badge colorScheme={exc.status === 'PENDING' ? 'warning' : exc.status === 'APPROVED' ? 'success' : 'danger'}>
                                {exc.status}
                            </Badge>
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-1)', fontSize: '1rem', color: 'var(--text-bright)' }}>{exc.requestType.replace('_', ' ')}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontStyle: 'italic' }}>
                            "{exc.reason}"
                        </p>
                        <Button variant="outline" style={{ width: '100%' }} onClick={() => setSelectedException(exc)}>
                            Review Exception
                        </Button>
                    </Card>
                ))}
            </div>

            {/* Detail Review Modal */}
            {selectedException && (
                <Modal isOpen={!!selectedException} onClose={() => { setSelectedException(null); setRejectReason(false); }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <div>
                            <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-bright, var(--text-primary))' }}>Exception Review</h2>
                            <div style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{selectedException.studentId}</div>
                        </div>
                        <Badge colorScheme="info">{selectedException.requestType.replace('_', ' ')}</Badge>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '120px', padding: '1rem', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Current GWA</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-text, #10b981)' }}>1.45</div>
                        </div>
                        <div style={{ flex: 1, minWidth: '120px', padding: '1rem', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Current Load</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning-text, #f59e0b)' }}>21 / 21</div>
                        </div>
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Student Justification</h4>
                        <p style={{ background: 'var(--bg-elevated, var(--bg-surface))', padding: '1rem', borderRadius: '4px', borderLeft: '3px solid var(--brand-primary)', margin: 0, color: 'var(--text-primary)', fontStyle: 'italic' }}>
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
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            <Button variant="danger" onClick={() => setRejectReason(true)}>Deny Request</Button>
                            <Button variant="success" onClick={() => handleAction('APPROVED')}>Approve Overload</Button>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
};