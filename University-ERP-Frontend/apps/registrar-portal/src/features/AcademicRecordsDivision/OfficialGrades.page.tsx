import React, { useState } from 'react';
import { Badge, Button, Card, PageHeader, Table, Modal, FormInput, EmptyState } from '@university-erp/ui-kit';
import { useOfficialGrades } from './Records.hooks';
import { OfficialGradeItem } from './Records.types';

export const OfficialGradesPage: React.FC = () => {
    const { data: grades = [], isLoading } = useOfficialGrades();
    const [selectedSection, setSelectedSection] = useState<OfficialGradeItem | null>(null);
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);
    const [lockConfirmationText, setLockConfirmationText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    const handleLockGrades = () => {
        if (lockConfirmationText === 'LOCK') {
            alert(`Grades for ${selectedSection?.section} successfully locked and committed to transcripts.`);
            setIsLockModalOpen(false);
            setSelectedSection(null);
            setLockConfirmationText('');
        }
    };

    const totalSections = grades.length;
    const submittedSections = grades.filter((g: OfficialGradeItem) => g.status === 'Submitted').length;

    const filteredGrades = grades.filter((g: OfficialGradeItem) => 
        g.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.faculty.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (grades.length === 0) {
        return (
            <div className="fade-in" style={{ padding: 'var(--space-4)' }}>
                <PageHeader title="Official Grades Workspace" subtitle="Review, audit, and lock faculty-submitted grade rosters." />
                <EmptyState title="No Rosters Available" description="There are currently no grading rosters available for this term." icon="📊" />
            </div>
        );
    }

    // Right Pane Content (Reusable for Desktop and Mobile Detail Views)
    const renderRosterDetails = () => (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                    <h2 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-bright, var(--text-primary))' }}>{selectedSection!.subject} ({selectedSection!.section})</h2>
                    <div style={{ color: 'var(--text-secondary)' }}>Instructor: {selectedSection!.faculty} | Credits: {selectedSection!.credits}</div>
                </div>
                <div className="desktop-only">
                    <Button 
                        variant={selectedSection!.status === 'Submitted' ? 'primary' : 'outline'} 
                        disabled={selectedSection!.status !== 'Submitted'}
                        onClick={() => setIsLockModalOpen(true)}
                    >
                        Lock Grades
                    </Button>
                </div>
            </div>

            <div className="data-table-container">
                <Table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Prelim</th>
                            <th>Midterm</th>
                            <th>Final Grade</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Mock Roster Data for UI demonstration */}
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>STU-2024-0012</td>
                            <td>Alex Mercer</td>
                            <td>1.50</td>
                            <td>1.25</td>
                            <td style={{ fontWeight: 'bold', color: 'var(--text-bright, var(--text-primary))' }}>1.25</td>
                            <td><Badge colorScheme="success">Passed</Badge></td>
                        </tr>
                        <tr>
                            <td style={{ fontFamily: 'monospace' }}>STU-2024-0491</td>
                            <td>Emma Watson</td>
                            <td>2.00</td>
                            <td>1.75</td>
                            <td style={{ fontWeight: 'bold', color: 'var(--text-bright, var(--text-primary))' }}>1.75</td>
                            <td><Badge colorScheme="success">Passed</Badge></td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            
            <div className="mobile-only" style={{ marginTop: 'var(--space-4)' }}>
                <Button 
                    variant={selectedSection!.status === 'Submitted' ? 'primary' : 'outline'} 
                    disabled={selectedSection!.status !== 'Submitted'}
                    onClick={() => setIsLockModalOpen(true)}
                    style={{ width: '100%' }}
                >
                    Lock Official Grades
                </Button>
            </div>
        </>
    );

    return (
        <div className="fade-in" style={{ padding: 'var(--space-4)' }}>
            <PageHeader title="Official Grades Workspace" subtitle="Review, audit, and lock faculty-submitted grade rosters." />
            
            {/* KPI STATS */}
            <div className="grid-stats" style={{ marginBottom: 'var(--space-6)' }}>
                <Card style={{ borderLeft: '4px solid var(--brand-primary)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Active Rosters</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-bright)' }}>{totalSections}</div>
                </Card>
                <Card style={{ borderLeft: '4px solid var(--warning-text)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Awaiting Lock</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-text)' }}>{submittedSections}</div>
                </Card>
            </div>

            <div className="toolbar">
                <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <FormInput 
                        placeholder="Search Sections or Faculty..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* DESKTOP LAYOUT: Split Pane Master/Detail */}
            <div className="desktop-only" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)', minHeight: '500px' }}>
                {/* Left Pane: Master List */}
                <Card style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-base)' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>Term Sections</h3>
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {filteredGrades.map((grade: OfficialGradeItem) => (
                            <div 
                                key={grade.id}
                                onClick={() => setSelectedSection(grade)}
                                style={{ 
                                    padding: 'var(--space-4)', 
                                    borderBottom: '1px solid var(--border-subtle, var(--border-color))', 
                                    cursor: 'pointer',
                                    background: selectedSection?.id === grade.id ? 'var(--bg-active, var(--bg-hover))' : 'transparent',
                                    borderLeft: selectedSection?.id === grade.id ? '3px solid var(--brand-primary)' : '3px solid transparent'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                    <strong style={{ color: 'var(--text-bright, var(--text-primary))' }}>{grade.section}</strong>
                                    <Badge colorScheme={grade.status === 'Submitted' ? 'warning' : grade.status === 'Locked' ? 'success' : 'info'}>
                                        {grade.status}
                                    </Badge>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{grade.subject}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{grade.faculty}</div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Right Pane: Detail View */}
                <Card style={{ overflowY: 'auto' }}>
                    {selectedSection ? renderRosterDetails() : (
                        <EmptyState 
                            title="Select a Section" 
                            description="Choose a section from the left panel to review and lock its official grade roster." 
                            icon="📊" 
                        />
                    )}
                </Card>
            </div>

            {/* MOBILE LAYOUT: Stacked Master/Detail (Sequential) */}
            <div className="mobile-only flex-stack">
                {!selectedSection ? (
                    filteredGrades.map((grade: OfficialGradeItem) => (
                        <Card key={grade.id} onClick={() => setSelectedSection(grade)} style={{ cursor: 'pointer' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                <strong style={{ color: 'var(--text-bright, var(--text-primary))' }}>{grade.section}</strong>
                                <Badge colorScheme={grade.status === 'Submitted' ? 'warning' : grade.status === 'Locked' ? 'success' : 'info'}>
                                    {grade.status}
                                </Badge>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{grade.subject}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{grade.faculty}</div>
                            <Button variant="outline" size="small" style={{ width: '100%', marginTop: 'var(--space-3)' }}>View Roster</Button>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <Button variant="ghost" onClick={() => setSelectedSection(null)} style={{ marginBottom: 'var(--space-4)' }}>
                            ← Back to Sections
                        </Button>
                        {renderRosterDetails()}
                    </Card>
                )}
            </div>

            {/* Strict Grade Locking Confirmation Modal */}
            <Modal isOpen={isLockModalOpen} onClose={() => setIsLockModalOpen(false)}>
                <h3 style={{ marginTop: 0, color: 'var(--danger-text, #ef4444)' }}>⚠️ Commit Permanent Academic Record</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    You are about to lock the grades for <strong>{selectedSection?.section}</strong>. 
                    This commits the grades to the students' permanent transcripts. Subsequent corrections will require a formal <em>Grade Change Request</em> and academic audit.
                </p>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                        Type <strong>LOCK</strong> to confirm:
                    </label>
                    <FormInput 
                        value={lockConfirmationText}
                        onChange={(e) => setLockConfirmationText(e.target.value)}
                        placeholder="LOCK"
                        style={{ background: 'var(--bg-base)', color: 'var(--text-bright, var(--text-primary))' }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <Button variant="ghost" onClick={() => setIsLockModalOpen(false)}>Cancel</Button>
                    <Button variant="danger" disabled={lockConfirmationText !== 'LOCK'} onClick={handleLockGrades}>
                        Commit & Lock Grades
                    </Button>
                </div>
            </Modal>
        </div>
    );
};