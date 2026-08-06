import React from 'react';
import { Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { useMasterStudents } from './Registry.hooks';
import { MasterStudentItem } from './Registry.types';

export const MasterStudentListPage: React.FC = () => {
    const { data: students = [], isLoading } = useMasterStudents();

    return (
        <div className="fade-in" style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Master Student Registry</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Search and manage the university's golden record of students.</p>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <input type="text" placeholder="Search by Student ID or Name..." style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)' }} />
                <Button variant="primary">Search Directory</Button>
            </div>

            <Card style={{ background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                {isLoading ? <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div> : (
                    <Table>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Full Name</th>
                                <th>Program</th>
                                <th>Year Level</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((stu: MasterStudentItem) => (
                                <tr key={stu.id}>
                                    <td style={{ fontFamily: 'monospace' }}>{stu.id}</td>
                                    <td style={{ fontWeight: 600 }}>{stu.name}</td>
                                    <td>{stu.program}</td>
                                    <td>{stu.year}</td>
                                    <td><Badge variant="success">{stu.status}</Badge></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>
        </div>
    );
};
