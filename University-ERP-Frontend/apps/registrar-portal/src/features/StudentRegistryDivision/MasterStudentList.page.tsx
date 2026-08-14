// src/features/StudentRegistryDivision/MasterStudentList.page.tsx
import React, { useState } from 'react';
import { Card, Table, Badge, Button, PageHeader, EmptyState, FormInput } from '@university-erp/ui-kit';
import { useNavigate } from 'react-router-dom';

export const MasterStudentListPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [programFilter, setProgramFilter] = useState('All Programs');
    const [statusFilter, setStatusFilter] = useState('All Statuses');

    // Mock data for UI demonstration
    const students = [
        { id: 'STU-2024-0012', name: 'Alex Mercer', program: 'BS Computer Science', year: '3rd Year', standing: 'Good', status: 'Enrolled' },
        { id: 'STU-2023-1102', name: 'Michael Chang', program: 'BS Engineering', year: '4th Year', standing: 'Warning', status: 'LOA' },
        { id: 'STU-2025-0891', name: 'Sophia Patel', program: 'BA Psychology', year: '2nd Year', standing: 'Good', status: 'Enrolled' },
        { id: 'STU-2022-0491', name: 'Emma Watson', program: 'BS Accountancy', year: '4th Year', standing: 'Good', status: 'Graduating' },
    ];

    const filteredStudents = students.filter(stu => {
        const matchesSearch = stu.name.toLowerCase().includes(searchTerm.toLowerCase()) || stu.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProgram = programFilter === 'All Programs' || stu.program === programFilter;
        const matchesStatus = statusFilter === 'All Statuses' || stu.status === statusFilter;
        return matchesSearch && matchesProgram && matchesStatus;
    });

    const totalStudents = students.length;
    const activeEnrolled = students.filter(s => s.status === 'Enrolled').length;

    return (
        <div className="fade-in">
            <PageHeader 
                title="Master Student Directory" 
                subtitle="Central operational entry point for all student records and lifecycles." 
                action={<Button variant="primary">+ Provision New Student</Button>}
            />
            
            {/* KPI STATS */}
            <div className="grid-stats" style={{ marginBottom: 'var(--space-6)' }}>
                <Card style={{ borderLeft: '4px solid var(--brand-primary)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Directory</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-bright)' }}>{totalStudents}</div>
                </Card>
                <Card style={{ borderLeft: '4px solid var(--success-text)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Enrollments</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-text)' }}>{activeEnrolled}</div>
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
                <div className="toolbar-actions">
                    <select 
                        value={programFilter} 
                        onChange={(e) => setProgramFilter(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    >
                        <option>All Programs</option>
                        <option>BS Computer Science</option>
                        <option>BS Engineering</option>
                        <option>BA Psychology</option>
                        <option>BS Accountancy</option>
                    </select>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    >
                        <option>All Statuses</option>
                        <option>Enrolled</option>
                        <option>LOA</option>
                        <option>Graduating</option>
                    </select>
                </div>
            </div>

            {/* DESKTOP VIEW: TABLE */}
            <div className="desktop-only fade-in">
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="data-table-container">
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
                                {filteredStudents.map((stu) => (
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
                                                    e.stopPropagation();
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
                    </div>
                </Card>
            </div>

            {/* MOBILE VIEW: CARDS */}
            <div className="mobile-only flex-stack fade-in">
                {filteredStudents.map((stu) => (
                    <Card key={stu.id} onClick={() => navigate(`/registry/student/${stu.id}`)} style={{ cursor: 'pointer' }}>
                        <div className="card-accent-top" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--brand-primary)' }}>{stu.id}</span>
                            <Badge colorScheme={stu.status === 'Enrolled' ? 'info' : stu.status === 'Graduating' ? 'success' : 'default'}>
                                {stu.status}
                            </Badge>
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-1)', fontSize: '1.1rem', color: 'var(--text-bright)' }}>{stu.name}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{stu.program} - {stu.year}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)' }}>
                            <Badge colorScheme={stu.standing === 'Good' ? 'success' : 'warning'}>{stu.standing} Standing</Badge>
                            <Button variant="outline" size="small">Open</Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* EMPTY STATE */}
            {filteredStudents.length === 0 && (
                <EmptyState 
                    title="No Students Found" 
                    description={`No records match your search criteria "${searchTerm}".`} 
                    icon=" " 
                />
            )}
        </div>
    );
};
