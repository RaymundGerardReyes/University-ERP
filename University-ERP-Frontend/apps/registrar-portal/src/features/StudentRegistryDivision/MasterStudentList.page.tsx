import React, { useState } from 'react';
import { Card, Table, Badge, Button, PageHeader } from '@university-erp/ui-kit';
import { useNavigate } from 'react-router-dom';

export const MasterStudentListPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data for UI demonstration
    const students = [
        { id: 'STU-2024-0012', name: 'Alex Mercer', program: 'BS Computer Science', year: '3rd Year', standing: 'Good', status: 'Enrolled' },
        { id: 'STU-2023-1102', name: 'Michael Chang', program: 'BS Engineering', year: '4th Year', standing: 'Warning', status: 'LOA' },
        { id: 'STU-2025-0891', name: 'Sophia Patel', program: 'BA Psychology', year: '2nd Year', standing: 'Good', status: 'Enrolled' },
        { id: 'STU-2022-0491', name: 'Emma Watson', program: 'BS Accountancy', year: '4th Year', standing: 'Good', status: 'Graduating' },
    ];

    return (
        <div className="fade-in">
            <PageHeader 
                title="Master Student Directory" 
                subtitle="Central operational entry point for all student records and lifecycles." 
                action={<Button variant="primary">+ Provision New Student</Button>}
            />
            
            <Card style={{ padding: 0, overflow: 'hidden' }}>
                {/* Advanced Filter Bar */}
                <div style={{ padding: 'var(--space-4)', background: 'var(--bg-base)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                    <input 
                        type="text" 
                        placeholder="Search by ID, Name, or Email..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ flex: 2, minWidth: '250px', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }} 
                    />
                    <select style={{ flex: 1, minWidth: '150px', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                        <option>All Programs</option>
                        <option>BS Computer Science</option>
                        <option>BS Engineering</option>
                        <option>BA Psychology</option>
                    </select>
                    <select style={{ flex: 1, minWidth: '150px', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                        <option>All Statuses</option>
                        <option>Enrolled</option>
                        <option>LOA</option>
                        <option>Graduating</option>
                    </select>
                </div>

                <Table>
                    <thead>
                        <tr>
                            <th>Student Identity</th>
                            <th>Program & Year</th>
                            <th>Academic Standing</th>
                            <th>Current Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((stu) => (
                            <tr 
                                key={stu.id} 
                                style={{ cursor: 'pointer', transition: 'background 0.2s' }} 
                                onClick={() => navigate(`/registry/student/${stu.id}`)}
                            >
                                <td>
                                    <div style={{ fontWeight: 600, color: 'var(--text-bright, var(--text-primary))' }}>{stu.name}</div>
                                    <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stu.id}</div>
                                </td>
                                <td>
                                    <div>{stu.program}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{stu.year}</div>
                                </td>
                                <td>
                                    <Badge colorScheme={stu.standing === 'Good' ? 'success' : 'warning'}>{stu.standing}</Badge>
                                </td>
                                <td>
                                    <Badge colorScheme={stu.status === 'Enrolled' ? 'info' : stu.status === 'Graduating' ? 'success' : 'default'}>
                                        {stu.status}
                                    </Badge>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <Button 
                                        variant="outline" 
                                        size="small" 
                                        onClick={(e) => { 
                                            e.stopPropagation(); // Prevent double navigation
                                            navigate(`/registry/student/${stu.id}`); 
                                        }}
                                    >
                                        Open Workspace
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};
