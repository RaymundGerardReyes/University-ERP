import React, { useState } from 'react';
import { Card, PageHeader, Badge, Button } from '@university-erp/ui-kit';
import { useStudentInquiries } from './Services.hooks';
import { StudentInquiryItem } from './Services.types';

export const StudentInquiriesPage: React.FC = () => {
    const { data: inquiries = [], isLoading } = useStudentInquiries();
    const [selectedTicket, setSelectedTicket] = useState<StudentInquiryItem | null>(null);

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    return (
        <div className="fade-in">
            <PageHeader 
                title="Student Inquiry Center" 
                subtitle="Manage helpdesk tickets, general requests, and SLA timelines." 
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)', height: '70vh' }}>
                
                {/* Left Pane: Ticket Work Queue */}
                <Card style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-base)' }}>
                        <input 
                            type="text" 
                            placeholder="Filter tickets..." 
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }} 
                        />
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {inquiries.map((inq: StudentInquiryItem) => (
                            <div 
                                key={inq.id}
                                onClick={() => setSelectedTicket(inq)}
                                style={{
                                    padding: 'var(--space-4)',
                                    borderBottom: '1px solid var(--border-subtle, var(--border-color))',
                                    cursor: 'pointer',
                                    background: selectedTicket?.id === inq.id ? 'var(--bg-active, var(--bg-hover))' : 'transparent',
                                    borderLeft: `4px solid ${inq.priority === 'High' ? 'var(--danger-text, #ef4444)' : 'var(--info-text, #3b82f6)'}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <strong style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{inq.id}</strong>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 hours ago</span>
                                </div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{inq.category}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{inq.student}</span>
                                    <Badge colorScheme={inq.status === 'Open' ? 'warning' : 'success'}>{inq.status}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Right Pane: Conversation & Details */}
                <Card style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {selectedTicket ? (
                        <>
                            <div style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h2 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-bright, var(--text-primary))' }}>{selectedTicket.category}</h2>
                                        <div style={{ color: 'var(--text-secondary)' }}>Requester: <strong>{selectedTicket.student}</strong></div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <Badge colorScheme={selectedTicket.priority === 'High' ? 'danger' : 'info'} style={{ marginBottom: '8px' }}>
                                            {selectedTicket.priority} Priority
                                        </Badge>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SLA: <span style={{ color: 'var(--warning-text, #f59e0b)' }}>Response due in 4 hrs</span></div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingRight: 'var(--space-2)' }}>
                                {/* Mock Timeline based on UX Blueprint */}
                                <div style={{ background: 'var(--bg-base)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                                        <strong style={{ color: 'var(--text-primary)' }}>{selectedTicket.student}</strong>
                                        <span style={{ color: 'var(--text-muted)' }}>Yesterday, 14:30</span>
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                                        Hello, my name spelling is incorrect on my portal. It shows "Liam Jonson" but it should be "Liam Johnson". How do I fix this before graduation?
                                    </p>
                                </div>
                                <div style={{ background: 'var(--bg-elevated, var(--bg-surface))', border: '1px solid var(--border-accent, var(--border-color))', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', alignSelf: 'flex-end', width: '90%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                                        <strong style={{ color: 'var(--brand-primary)' }}>Registrar Office (You)</strong>
                                        <span style={{ color: 'var(--text-muted)' }}>Today, 09:15</span>
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                                        Hi Liam, I can help with that. Please submit a formal Data Correction request and attach a copy of your Birth Certificate as evidence.
                                    </p>
                                </div>
                            </div>

                            <div style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)', marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)' }}>
                                <input 
                                    type="text" 
                                    placeholder="Type your reply to the student..." 
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                                />
                                <Button variant="primary">Send Reply</Button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📬</div>
                            <h3>No Ticket Selected</h3>
                            <p>Select a request from the queue to view details and respond.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};
