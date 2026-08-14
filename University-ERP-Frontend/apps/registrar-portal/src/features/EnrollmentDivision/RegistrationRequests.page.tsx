import React, { useState } from 'react';
import { Badge, Card, PageHeader, Table, Button } from '@university-erp/ui-kit';
import { useRegistrationRequests } from './Enrollment.hooks';

export const RegistrationRequestsPage: React.FC = () => {
    const { data: requests, isLoading } = useRegistrationRequests();
    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    // Mock data for UI demonstration representing a multi-line request
    const mockRequests = [
        {
            requestId: 'REG-2026-901',
            studentId: 'STU-2024-0012',
            studentName: 'Alex Mercer',
            termId: 'AY 26-27, Sem 1',
            status: 'PENDING',
            validationErrors: ['Prerequisite missing for IT401'],
            lineItems: [
                { courseId: 'CS201', title: 'Data Structures', sectionId: 'CS201-A', status: 'Valid' },
                { courseId: 'IT401', title: 'Artificial Intelligence', sectionId: 'IT401-C', status: 'Invalid - PreReq Missing' }
            ]
        },
        {
            requestId: 'REG-2026-905',
            studentId: 'STU-2025-0891',
            studentName: 'Sophia Patel',
            termId: 'AY 26-27, Sem 1',
            status: 'PENDING',
            validationErrors: [],
            lineItems: [
                { courseId: 'ENG101', title: 'Purposive Communication', sectionId: 'ENG101-A', status: 'Valid' }
            ]
        }
    ];

    const displayRequests = requests && requests.length > 0 ? requests : mockRequests;

    return (
        <div className="fade-in">
            <PageHeader
                title="Registration Requests"
                subtitle="Queue of pending multi-line registration requests requiring manual validation."
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)', height: '70vh' }}>
                
                {/* Left Pane: Request Queue */}
                <Card style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-base)' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-bright, var(--text-primary))' }}>Pending Approvals</h3>
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
                                    borderLeft: `4px solid ${req.validationErrors.length > 0 ? 'var(--danger-text, #ef4444)' : 'var(--success-text, #10b981)'}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <strong style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{req.requestId}</strong>
                                    {req.validationErrors.length > 0 ? (
                                        <Badge colorScheme="danger">{req.validationErrors.length} Errors</Badge>
                                    ) : (
                                        <Badge colorScheme="success">Clean</Badge>
                                    )}
                                </div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{req.studentName}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{req.studentId} • {req.lineItems.length} Subjects</div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Right Pane: Multi-Line Detail View */}
                <Card style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {selectedRequest ? (
                        <>
                            <div style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h2 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-bright, var(--text-primary))' }}>Request: {selectedRequest.requestId}</h2>
                                        <div style={{ color: 'var(--text-secondary)' }}>Student: <strong>{selectedRequest.studentName}</strong> ({selectedRequest.studentId})</div>
                                    </div>
                                    <Badge colorScheme="warning">PENDING</Badge>
                                </div>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto' }}>
                                {selectedRequest.validationErrors.length > 0 && (
                                    <div style={{ padding: '1rem', background: 'var(--danger-bg, rgba(239,68,68,0.1))', border: '1px solid var(--danger-border, var(--border-color))', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--danger-text, #ef4444)' }}>Validation Blocks Detected</h4>
                                        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-primary)' }}>
                                            {selectedRequest.validationErrors.map((err: string, i: number) => <li key={i}>{err}</li>)}
                                        </ul>
                                    </div>
                                )}

                                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Requested Subjects</h4>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Course</th>
                                            <th>Section</th>
                                            <th>Line Status</th>
                                            <th style={{ textAlign: 'right' }}>Line Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedRequest.lineItems.map((line: any, idx: number) => (
                                            <tr key={idx}>
                                                <td>
                                                    <strong style={{ fontFamily: 'monospace' }}>{line.courseId}</strong>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{line.title}</div>
                                                </td>
                                                <td>{line.sectionId}</td>
                                                <td>
                                                    <Badge colorScheme={line.status === 'Valid' ? 'success' : 'danger'}>
                                                        {line.status}
                                                    </Badge>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    {line.status === 'Valid' ? (
                                                        <Button variant="outline" size="small">Drop Line</Button>
                                                    ) : (
                                                        <Button variant="danger" size="small">Override</Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>

                            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <Button variant="danger">Reject Entire Request</Button>
                                <Button variant="primary">Approve Valid Lines Only</Button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📑</div>
                            <h3>No Request Selected</h3>
                            <p>Select a registration request from the queue to review subject lines.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};