// src/features/GraduationDivision/GraduationCandidates.page.tsx
import React, { useState } from 'react';
import { Card, Table, Badge, Button, PageHeader, EmptyState, FormInput } from '@university-erp/ui-kit';
import { useGraduationCandidates, useEvaluateCandidate } from './Graduation.hooks';
import { GraduationCandidateItem } from './Graduation.types';

export const GraduationCandidatesPage: React.FC = () => {
    const { data: candidates = [], isLoading } = useGraduationCandidates();
    const evaluateMutation = useEvaluateCandidate();
    const [selectedCandidate, setSelectedCandidate] = useState<GraduationCandidateItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    const filteredCandidates = candidates.filter((cand: GraduationCandidateItem) => 
        cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cand.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCandidates = candidates.length;
    const pendingAudit = candidates.filter((c: GraduationCandidateItem) => c.status === 'Pending').length || totalCandidates; // Fallback logic based on mock

    // Main Candidate Queue View
    if (!selectedCandidate) {
        return (
            <div className="fade-in">
                <PageHeader 
                    title="Graduation Candidates" 
                    subtitle="Queue of students applying for graduation clearance." 
                />

                {/* KPI STATS */}
                <div className="grid-stats" style={{ marginBottom: 'var(--space-6)' }}>
                    <Card style={{ borderLeft: '4px solid var(--info-text)', padding: 'var(--space-4)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Candidates</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-bright)' }}>{totalCandidates}</div>
                    </Card>
                    <Card style={{ borderLeft: '4px solid var(--warning-text)', padding: 'var(--space-4)' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Audit</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-text)' }}>{pendingAudit}</div>
                    </Card>
                </div>

                {/* TOOLBAR */}
                <div className="toolbar">
                    <div className="search-input-wrapper">
                        <span className="search-icon"> </span>
                        <FormInput 
                            placeholder="Search by Candidate ID or Name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* DESKTOP VIEW */}
                <div className="desktop-only fade-in">
                    <Card style={{ padding: 0, overflow: 'hidden' }}>
                        <div className="data-table-container">
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Candidate Name</th>
                                        <th>Program</th>
                                        <th>GWA / GPA</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCandidates.map((cand: GraduationCandidateItem) => (
                                        <tr key={cand.id}>
                                            <td style={{ fontFamily: 'monospace' }}>{cand.id}</td>
                                            <td style={{ fontWeight: 600, color: 'var(--text-bright, var(--text-primary))' }}>{cand.name}</td>
                                            <td>{cand.program}</td>
                                            <td style={{ fontWeight: 700, color: 'var(--warning-text, #f59e0b)' }}>{cand.gpa}</td>
                                            <td><Badge colorScheme="info">{cand.status}</Badge></td>
                                            <td style={{ textAlign: 'right' }}>
                                                <Button variant="outline" size="small" onClick={() => setSelectedCandidate(cand)}>
                                                    Open Degree Audit
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
                    {filteredCandidates.map((cand: GraduationCandidateItem) => (
                        <Card key={cand.id}>
                            <div className="card-accent-top" />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--brand-primary)' }}>{cand.id}</span>
                                <Badge colorScheme="info">{cand.status}</Badge>
                            </div>
                            <h3 style={{ marginBottom: 'var(--space-1)', fontSize: '1.1rem', color: 'var(--text-bright)' }}>{cand.name}</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>{cand.program}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)' }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>GWA: <strong style={{ color: 'var(--warning-text)' }}>{cand.gpa}</strong></span>
                                <Button variant="outline" size="small" onClick={() => setSelectedCandidate(cand)}>
                                    Audit
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* EMPTY STATE */}
                {filteredCandidates.length === 0 && (
                    <EmptyState 
                        title="No Candidates Found" 
                        description={`No graduation candidates match your search for "${searchTerm}".`} 
                        icon=" " 
                    />
                )}
            </div>
        );
    }

    // Degree Audit Detailed Workspace
    return (
        <div className="fade-in">
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <Button variant="ghost" onClick={() => setSelectedCandidate(null)} style={{ padding: 0, marginBottom: 'var(--space-4)', color: 'var(--text-muted)' }}>
                      Back to Candidates Queue
                </Button>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', margin: '0 0 var(--space-2) 0', color: 'var(--text-bright, var(--text-primary))' }}>{selectedCandidate.name}</h1>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            <span style={{ fontFamily: 'monospace' }}>{selectedCandidate.id}</span> • {selectedCandidate.program}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--warning-text, #f59e0b)', lineHeight: 1 }}>{selectedCandidate.gpa}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 'var(--space-1)' }}>Computed GWA</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
                {/* Left: Curriculum Audit */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Core Major Requirements</h3>
                            <Badge colorScheme="success">Completed (45/45)</Badge>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--success-text, #10b981)' }}>
                            <span style={{ color: 'var(--success-text, #10b981)' }}> </span>
                            <span style={{ flex: 1, fontFamily: 'monospace' }}>CS301 Software Engineering</span>
                            <span style={{ fontSize: '0.9rem' }}>3.0 Units</span>
                        </div>
                    </Card>

                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>General Education</h3>
                            <Badge colorScheme="danger">Missing (2 Units)</Badge>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--danger-text, #ef4444)' }}>
                            <span style={{ color: 'var(--danger-text, #ef4444)' }}> </span>
                            <span style={{ flex: 1, fontFamily: 'monospace' }}>PE104 Physical Education IV</span>
                            <span style={{ color: 'var(--danger-text, #ef4444)', fontWeight: 600, fontSize: '0.9rem' }}>Missing</span>
                        </div>
                    </Card>

                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Electives</h3>
                            <Badge colorScheme="warning">In Progress (3 Units)</Badge>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--warning-text, #f59e0b)' }}>
                            <span style={{ color: 'var(--warning-text, #f59e0b)' }}> </span>
                            <span style={{ flex: 1, fontFamily: 'monospace' }}>IT401 Artificial Intelligence</span>
                            <span style={{ color: 'var(--warning-text, #f59e0b)', fontSize: '0.9rem' }}>Enrolled</span>
                        </div>
                    </Card>
                </div>

                {/* Right: Clearance Checklist & Decision */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Card style={{ borderTop: '3px solid var(--brand-primary)' }}>
                        <h3 style={{ margin: '0 0 var(--space-4) 0', color: 'var(--text-bright)' }}>Clearance Checklist</h3>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)', color: 'var(--success-text, #10b981)' }}>
                            <span> </span> Financial Clearance
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)', color: 'var(--success-text, #10b981)' }}>
                            <span> </span> Library Clearance
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', color: 'var(--danger-text, #ef4444)' }}>
                            <span> </span> Academic Deficiencies (1 Missing)
                        </div>
                        
                        <div style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <Button 
                                variant="primary" 
                                disabled={true} // Disabled because of missing PE104
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                Approve Clearance
                            </Button>
                            <Button 
                                variant="danger" 
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={() => {
                                    evaluateMutation.mutate(selectedCandidate.id);
                                    alert(`Clearance held for ${selectedCandidate.name} due to missing academic requirements.`);
                                }}
                            >
                                Hold Clearance (Deficiency)
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
