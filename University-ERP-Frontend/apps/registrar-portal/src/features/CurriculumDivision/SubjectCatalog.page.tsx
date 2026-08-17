// src/features/CurriculumDivision/SubjectCatalog.page.tsx
import React, { useState } from 'react';
import { Badge, Button, Card, PageHeader, Table, Modal, FormInput, EmptyState } from '@university-erp/ui-kit';
import { useSubjectCatalog } from './Curriculum.hooks';

export const SubjectCatalogPage: React.FC = () => {
    const { data: catalog = [], isLoading } = useSubjectCatalog();
    const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    const displayCatalog = catalog || [];
    
    const filteredCatalog = displayCatalog.filter((item: any) => {
        const matchesSearch = item.code.toLowerCase().includes(searchTerm.toLowerCase()) || item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = departmentFilter === 'All Departments' || item.department === departmentFilter;
        return matchesSearch && matchesDept;
    });

    const totalSubjects = displayCatalog.length;
    const activeSubjects = displayCatalog.filter((item: any) => item.status === 'Active').length;

    return (
        <div className="fade-in">
            <PageHeader 
                title="Master Subject Catalog" 
                subtitle="Centralized management of university course definitions and master data."
                action={<Button variant="primary">+ Create New Subject</Button>}
            />

            {/* KPI STATS */}
            <div className="grid-stats" style={{ marginBottom: 'var(--space-6)' }}>
                <Card style={{ borderLeft: '4px solid var(--brand-primary)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Subjects</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-bright)' }}>{totalSubjects}</div>
                </Card>
                <Card style={{ borderLeft: '4px solid var(--success-text)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Courses</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-text)' }}>{activeSubjects}</div>
                </Card>
            </div>

            {/* TOOLBAR */}
            <div className="toolbar">
                <div className="search-input-wrapper">
                    <span className="search-icon"> </span>
                    <FormInput 
                        placeholder="Search by Course Code or Title..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="toolbar-actions">
                    <select 
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    >
                        <option>All Departments</option>
                        <option>Computer Science</option>
                        <option>Mathematics</option>
                        <option>Engineering</option>
                    </select>
                </div>
            </div>

            {/* DESKTOP VIEW */}
            <div className="desktop-only fade-in">
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="data-table-container">
                        <Table>
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Title</th>
                                    <th>Department</th>
                                    <th>Units</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCatalog.map((subject: any) => (
                                    <tr key={subject.code}>
                                        <td style={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--text-bright, var(--text-primary))' }}>{subject.code}</td>
                                        <td style={{ fontWeight: 600 }}>{subject.title}</td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{subject.department}</td>
                                        <td>{subject.units}.0</td>
                                        <td>
                                            <Badge colorScheme={subject.status === 'Active' ? 'success' : 'default'}>
                                                {subject.status}
                                            </Badge>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <Button variant="outline" size="small" onClick={() => setSelectedSubject(subject)}>
                                                Edit Master Data
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            </div>

            {/* MOBILE VIEW */}
            <div className="mobile-only flex-stack fade-in">
                {filteredCatalog.map((subject: any) => (
                    <Card key={subject.code}>
                        <div className="card-accent-top" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--brand-primary)' }}>{subject.code}</span>
                            <Badge colorScheme={subject.status === 'Active' ? 'success' : 'default'}>
                                {subject.status}
                            </Badge>
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-1)', fontSize: '1.1rem', color: 'var(--text-bright)' }}>{subject.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>{subject.department} • {subject.units}.0 Units</p>
                        <Button variant="outline" style={{ width: '100%', marginTop: 'var(--space-2)' }} onClick={() => setSelectedSubject(subject)}>
                            Edit Master Data
                        </Button>
                    </Card>
                ))}
            </div>

            {/* EMPTY STATE */}
            {filteredCatalog.length === 0 && (
                <EmptyState 
                    title="No Subjects Found" 
                    description={`No courses match your search for "${searchTerm}".`} 
                    icon=" " 
                />
            )}

            {/* Edit Master Data Modal */}
            {selectedSubject && (
                <Modal isOpen={!!selectedSubject} onClose={() => setSelectedSubject(null)}>
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                        <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-bright, var(--text-primary))' }}>Edit Subject Master Data</h2>
                        <div style={{ color: 'var(--text-secondary)' }}>Code: <strong style={{ color: 'var(--brand-primary)', fontFamily: 'monospace' }}>{selectedSubject.code}</strong></div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Course Title</label>
                            <FormInput defaultValue={selectedSubject.title} style={{ background: 'var(--bg-base)', color: 'var(--text-bright, var(--text-primary))' }} />
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Academic Units</label>
                                <FormInput type="number" defaultValue={selectedSubject.units} style={{ background: 'var(--bg-base)', color: 'var(--text-bright, var(--text-primary))' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Status</label>
                                <select 
                                    defaultValue={selectedSubject.status === 'Active' ? 'Active' : 'Inactive / Phased Out'}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive / Phased Out">Inactive / Phased Out</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Course Description (Syllabus Extract)</label>
                            <textarea 
                                rows={4} 
                                defaultValue={selectedSubject.description}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)', resize: 'none', fontFamily: 'inherit' }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <Button variant="ghost" onClick={() => setSelectedSubject(null)}>Cancel</Button>
                        <Button variant="primary" onClick={() => {
                            alert(`Master data for ${selectedSubject.code} successfully updated.`);
                            setSelectedSubject(null);
                        }}>
                            Save Changes
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};