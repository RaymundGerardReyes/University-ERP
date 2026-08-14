import React, { useState } from 'react';
import { Card, Table, Badge, Button, PageHeader } from '@university-erp/ui-kit';
import { useGraduationCandidates, useEvaluateCandidate } from './Graduation.hooks';
import { GraduationCandidateItem } from './Graduation.types';

export const GraduationCandidatesPage: React.FC = () => {
    const { data: candidates = [], isLoading } = useGraduationCandidates();
    const evaluateMutation = useEvaluateCandidate();
    const [selectedCandidate, setSelectedCandidate] = useState<GraduationCandidateItem | null>(null);

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    // Main Candidate Queue View
    if (!selectedCandidate) {
        return (
            <div className="fade-in">
                <PageHeader 
                    title="Graduation Candidates" 
                    subtitle="Queue of students applying for graduation clearance." 
                />
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <Table>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Candidate Name</th>
                                <th>Program</th>
                                <th>GWA / GPA</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidates.map((cand: GraduationCandidateItem) => (
                                <tr key={cand.id}>
                                    <td style={{ fontFamily: 'monospace' }}>{cand.id}</td>
                                    <td style={{ fontWeight: 600 }}>{cand.name}</td>
                                    <td>{cand.program}</td>
                                    <td style={{ fontWeight: 700, color: 'var(--warning-text, #f59e0b)' }}>{cand.gpa}</td>
                                    <td><Badge colorScheme="info">{cand.status}</Badge></td>
                                    <td>
                                        <Button variant="outline" size="small" onClick={() => setSelectedCandidate(cand)}>
                                            Open Degree Audit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            </div>
        );
    }

    // Degree Audit Detailed Workspace
    return (
        <div className="fade-in">
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <Button variant="ghost" onClick={() => setSelectedCandidate(null)} style={{ padding: 0, marginBottom: 'var(--space-2)', color: 'var(--text-muted)' }}>
                    ← Back to Candidates Queue
                </Button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', margin: '0 0 var(--space-2) 0', color: 'var(--text-bright, var(--text-primary))' }}>{selectedCandidate.name}</h1>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            <span style={{ fontFamily: 'monospace' }}>{selectedCandidate.id}</span> • {selectedCandidate.program}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning-text, #f59e0b)', lineHeight: 1 }}>{selectedCandidate.gpa}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Computed GWA</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
                {/* Left: Curriculum Audit */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <h3 style={{ margin: 0 }}>Core Major Requirements</h3>
                            <Badge colorScheme="success">Completed (45/45 Units)</Badge>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--success-text, #10b981)' }}>
                            <span style={{ color: 'var(--success-text, #10b981)' }}>✓</span>
                            <span style={{ flex: 1, fontFamily: 'monospace' }}>CS301 Software Engineering</span>
                            <span>3.0 Units</span>
                        </div>
                    </Card>

                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <h3 style={{ margin: 0 }}>General Education</h3>
                            <Badge colorScheme="danger">Missing (2 Units)</Badge>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--danger-text, #ef4444)' }}>
                            <span style={{ color: 'var(--danger-text, #ef4444)' }}>✕</span>
                            <span style={{ flex: 1, fontFamily: 'monospace' }}>PE104 Physical Education IV</span>
                            <span style={{ color: 'var(--danger-text, #ef4444)', fontWeight: 600 }}>Missing</span>
                        </div>
                    </Card>

                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <h3 style={{ margin: 0 }}>Electives</h3>
                            <Badge colorScheme="warning">In Progress (3 Units)</Badge>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--warning-text, #f59e0b)' }}>
                            <span style={{ color: 'var(--warning-text, #f59e0b)' }}>⟳</span>
                            <span style={{ flex: 1, fontFamily: 'monospace' }}>IT401 Artificial Intelligence</span>
                            <span style={{ color: 'var(--warning-text, #f59e0b)' }}>Currently Enrolled</span>
                        </div>
                    </Card>
                </div>

                {/* Right: Clearance Checklist & Decision */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <Card style={{ borderTop: '3px solid var(--brand-primary)' }}>
                        <h3 style={{ margin: '0 0 var(--space-4) 0' }}>Clearance Checklist</h3>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)', color: 'var(--success-text, #10b981)' }}>
                            <span>✓</span> Financial Clearance
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)', color: 'var(--success-text, #10b981)' }}>
                            <span>✓</span> Library Clearance
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', color: 'var(--danger-text, #ef4444)' }}>
                            <span>✕</span> Academic Deficiencies (1 Missing)
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
