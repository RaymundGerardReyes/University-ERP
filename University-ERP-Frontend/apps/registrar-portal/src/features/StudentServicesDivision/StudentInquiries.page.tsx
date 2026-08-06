import React from 'react';
import { Card, Table, Badge } from '@university-erp/ui-kit';
import { useStudentInquiries } from './Services.hooks';
import { StudentInquiryItem } from './Services.types';

export const StudentInquiriesPage: React.FC = () => {
    const { data: inquiries = [], isLoading } = useStudentInquiries();

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Student Inquiries</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage helpdesk tickets, name corrections, and general student requests.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                {isLoading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div> : (
                    <Table>
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>Student</th>
                                <th>Category</th>
                                <th>Priority</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.map((inq: StudentInquiryItem) => (
                                <tr key={inq.id}>
                                    <td style={{ fontFamily: 'monospace' }}>{inq.id}</td>
                                    <td>{inq.student}</td>
                                    <td>{inq.category}</td>
                                    <td><Badge variant={inq.priority === 'High' ? 'danger' : 'info'}>{inq.priority}</Badge></td>
                                    <td><Badge variant="info">{inq.status}</Badge></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>
        </div>
    );
};
