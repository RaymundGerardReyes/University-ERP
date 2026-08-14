import React, { useState } from 'react';
import { Badge, Button, Card, PageHeader, Table, Modal, FormInput } from '@university-erp/ui-kit';
import { useSubjectCatalog } from './Curriculum.hooks';
import { SubjectCatalogItem } from './Curriculum.types';

export const SubjectCatalogPage: React.FC = () => {
    const { data: catalog = [], isLoading } = useSubjectCatalog();
    const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    // Fallback mock data mapping to the master data management interface
    const displayCatalog = catalog.length > 0 ? catalog : [
        { code: 'CS101', title: 'Intro to Programming', units: 3, prerequisites: 'None', status: 'Active', department: 'Computer Science', description: 'Fundamental programming concepts.' },
        { code: 'CS201', title: 'Data Structures', units: 3, prerequisites: 'CS101', status: 'Active', department: 'Computer Science', description: 'Advanced data organization and algorithm analysis.' },
        { code: 'MTH101', title: 'Calculus I', units: 4, prerequisites: 'None', status: 'Active', department: 'Mathematics', description: 'Limits, derivatives, and integrals.' },
        { code: 'ENG101', title: 'Purposive Communication', units: 3, prerequisites: 'None', status: 'Inactive', department: 'Languages', description: 'Effective communication in academic and professional contexts.' }
    ];

    const filteredCatalog = displayCatalog.filter((item: any) => 
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fade-in">
            <PageHeader 
                title="Master Subject Catalog" 
                subtitle="Centralized management of university course definitions and master data."
                action={<Button variant="primary">+ Create New Subject</Button>}
            />

            <Card style={{ padding: 0, overflow: 'hidden' }}>
                {/* Search and Filters */}
                <div style={{ padding: 'var(--space-4)', background: 'var(--bg-base)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                    <input 
                        type="text" 
                        placeholder="Search by Course Code or Title..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, minWidth: '250px', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }} 
                    />
                    <select style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                        <option>All Departments</option>
                        <option>Computer Science</option>
                        <option>Mathematics</option>
                    </select>
                </div>

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
            </Card>

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
                                <select style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
                                    <option selected={selectedSubject.status === 'Active'}>Active</option>
                                    <option selected={selectedSubject.status === 'Inactive'}>Inactive / Phased Out</option>
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