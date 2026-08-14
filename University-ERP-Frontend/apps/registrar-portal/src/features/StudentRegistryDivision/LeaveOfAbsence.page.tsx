// src/features/StudentRegistryDivision/LeaveOfAbsence.page.tsx
import React, { useState } from 'react';
import { Card, Table, Badge, Button, PageHeader, Modal, FormInput, EmptyState } from '@university-erp/ui-kit';

export const LeaveOfAbsencePage: React.FC = () => {
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data for UI demonstration
    const loaRequests = [
        {
            id: 'LOA-8120', studentId: 'STU-2023-1102', name: 'Michael Chang', program: 'BS Engineering',
            duration: '1 Semester', returnTerm: 'AY 27-28, Sem 1', reason: 'Medical Leave - Surgery and Recovery',
            gwa: '1.75', standing: 'Good Standing', status: 'Pending Review'
        },
        {
            id: 'LOA-8122', studentId: 'STU-2022-0414', name: 'Sarah Jenkins', program: 'BA Psychology',
            duration: '1 Academic Year', returnTerm: 'AY 28-29, Sem 1', reason: 'Financial Constraints',
            gwa: '2.50', standing: 'Warning', status: 'Pending Review'
        }
    ];

    const filteredRequests = loaRequests.filter(req => 
        req.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRequests = loaRequests.length;
    const pendingReviews = loaRequests.filter(r => r.status === 'Pending Review').length;

    const handleDecision = (action: 'APPROVED' | 'REJECTED') => {
        setIsProcessing(true);
        setTimeout(() => {
            alert(`LOA Application ${action}. Student record updated.`);
            setIsProcessing(false);
            setSelectedRequest(null);
        }, 600);
    };

    return (
        <div className="fade-in">
            <PageHeader 
                title="Leave of Absence (LOA) Queue" 
                subtitle="Evaluate student leave applications and manage academic interruptions." 
            />

            {/* KPI STATS */}
            <div className="grid-stats" style={{ marginBottom: 'var(--space-6)' }}>
                <Card style={{ borderLeft: '4px solid var(--info-text)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Requests</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-bright)' }}>{totalRequests}</div>
                </Card>
                <Card style={{ borderLeft: '4px solid var(--warning-text)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Review</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-text)' }}>{pendingReviews}</div>
                </Card>
            </div>

            {/* TOOLBAR */}
            <div className="toolbar">
                <div className="search-input-wrapper">
                    <span className="search-icon"> </span>
                    <FormInput 
                        placeholder="Search by ID or Name..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
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
                                    <th>Request ID</th>
                                    <th>Student</th>
                                    <th>Duration</th>
                                    <th>Reason Category</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map((req) => (
                                    <tr key={req.id}>
                                        <td style={{ fontFamily: 'monospace' }}>{req.id}</td>
                                        <td>
                                            <strong style={{ color: 'var(--text-bright, var(--text-primary))' }}>{req.name}</strong> <br/>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.studentId}</span>
                                        </td>
                                        <td>{req.duration}</td>
                                        <td>{req.reason.split('-')[0]}</td>
                                        <td><Badge colorScheme="warning">{req.status}</Badge></td>
                                        <td style={{ textAlign: 'right' }}>
                                            <Button variant="outline" size="small" onClick={() => setSelectedRequest(req)}>
                                                Evaluate
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
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
                            <Badge colorScheme="warning">{req.status}</Badge>
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-1)', fontSize: '1.1rem', color: 'var(--text-bright)' }}>{req.name}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>{req.studentId}</p>
                        <div style={{ background: 'var(--bg-base)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reason</div>
                            <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{req.reason.split('-')[0]}</div>
                        </div>
                        <Button variant="outline" style={{ width: '100%' }} onClick={() => setSelectedRequest(req)}>
                            Evaluate Application
                        </Button>
                    </Card>
                ))}
            </div>

            {/* EMPTY STATE */}
            {filteredRequests.length === 0 && (
                <EmptyState 
                    title="No Pending LOA Requests" 
                    description={`No requests found matching "${searchTerm}".`} 
                    icon=" " 
                />
            )}

            {/* LOA Evaluation Modal */}
            {selectedRequest && (
                <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)}>
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-bright, var(--text-primary))' }}>LOA Application Review</h2>
                        <div style={{ color: 'var(--text-secondary)' }}>Ticket: <span style={{ fontFamily: 'monospace' }}>{selectedRequest.id}</span></div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Applicant</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{selectedRequest.name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedRequest.program}</div>
                        </div>
                        <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--brand-primary)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Academic Standing</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{selectedRequest.standing}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>GWA: {selectedRequest.gwa}</div>
                        </div>
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-elevated, var(--bg-surface))', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Requested Duration</span>
                                <strong style={{ color: 'var(--text-bright, var(--text-primary))' }}>{selectedRequest.duration}</strong>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Expected Return</span>
                                <strong style={{ color: 'var(--text-bright, var(--text-primary))' }}>{selectedRequest.returnTerm}</strong>
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-subtle, var(--border-color))', paddingTop: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Student Justification</span>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{selectedRequest.reason}"</p>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        <Button variant="danger" onClick={() => handleDecision('REJECTED')} disabled={isProcessing}>Deny Request</Button>
                        <Button variant="primary" onClick={() => handleDecision('APPROVED')} disabled={isProcessing}>
                            {isProcessing ? 'Processing...' : 'Approve LOA'}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
