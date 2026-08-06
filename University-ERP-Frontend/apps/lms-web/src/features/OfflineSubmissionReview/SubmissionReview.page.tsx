import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';

export const SubmissionReviewPage: React.FC = () => {
    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Offline Submission Review</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Review and grade assignments that have been synced back from the Avalonia Student Clients.</p>
            
            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Assignment</th>
                            <th>Synced At</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>STU-2026-8812</td>
                            <td>CS101 - Lab 1: Binary Search</td>
                            <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>2026-08-06 08:30 AM</td>
                            <td><Badge variant="warning">Pending Review</Badge></td>
                            <td><Button size="small" variant="primary">Grade Submission</Button></td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
