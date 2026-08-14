import React, { useState } from 'react';
import { Card, Table, Badge, Button, PageHeader } from '@university-erp/ui-kit';

export const LatinHonorsPage: React.FC = () => {
    const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Mock data representing the automated backend computations
    const candidates = [
        {
            id: 'STU-2022-0491',
            name: 'Emma Watson',
            program: 'BS Accountancy',
            gwa: '1.18',
            projectedHonor: 'Summa Cum Laude',
            totalUnits: 145,
            residencyUnits: 145,
            hasFailingGrades: false,
            disciplinaryClear: true,
            status: 'Pending Final Audit'
        },
        {
            id: 'STU-2022-0812',
            name: 'David Chen',
            program: 'BS Computer Science',
            gwa: '1.42',
            projectedHonor: 'Magna Cum Laude',
            totalUnits: 150,
            residencyUnits: 120, // Transfer student, but meets minimum residency
            hasFailingGrades: false,
            disciplinaryClear: true,
            status: 'Pending Final Audit'
        },
        {
            id: 'STU-2021-0091',
            name: 'Michael Scott',
            program: 'BA Business Administration',
            gwa: '1.65',
            projectedHonor: 'Cum Laude',
            totalUnits: 135,
            residencyUnits: 135,
            hasFailingGrades: true, // Rule violation
            disciplinaryClear: true,
            status: 'Rule Violation Detected'
        }
    ];

    const handleDecision = (decision: 'CONFER' | 'DISQUALIFY') => {
        setIsProcessing(true);
        setTimeout(() => {
            alert(`Honors designation for ${selectedCandidate.name} has been ${decision === 'CONFER' ? 'officially conferred' : 'disqualified'}.`);
            setIsProcessing(false);
            setSelectedCandidate(null);
        }, 800);
    };

    return (
        <div className="fade-in">
            <PageHeader 
                title="Latin Honors Computation" 
                subtitle="Automated GWA calculation and institutional policy validation for graduating candidates." 
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)', height: '70vh' }}>
                
                {/* Left Pane: Candidates Queue */}
                <Card style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-base)' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-bright, var(--text-primary))' }}>Eligible Candidates</h3>
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {candidates.map((cand) => (
                            <div 
                                key={cand.id}
                                onClick={() => setSelectedCandidate(cand)}
                                style={{
                                    padding: 'var(--space-4)',
                                    borderBottom: '1px solid var(--border-subtle, var(--border-color))',
                                    cursor: 'pointer',
                                    background: selectedCandidate?.id === cand.id ? 'var(--bg-active, var(--bg-hover))' : 'transparent',
                                    borderLeft: `4px solid ${cand.hasFailingGrades ? 'var(--danger-text, #ef4444)' : 'var(--warning-text, #f59e0b)'}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <strong style={{ color: 'var(--text-bright, var(--text-primary))' }}>{cand.name}</strong>
                                    <span style={{ fontWeight: 'bold', color: 'var(--warning-text, #f59e0b)' }}>{cand.gwa}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{cand.program}</div>
                                <Badge colorScheme={cand.hasFailingGrades ? 'danger' : 'warning'}>{cand.projectedHonor}</Badge>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Right Pane: Computation & Audit Workspace */}
                <Card style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {selectedCandidate ? (
                        <>
                            <div style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h2 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-bright, var(--text-primary))' }}>Honors Audit: {selectedCandidate.name}</h2>
                                        <div style={{ color: 'var(--text-secondary)' }}>ID: <span style={{ fontFamily: 'monospace' }}>{selectedCandidate.id}</span></div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning-text, #f59e0b)', lineHeight: 1 }}>{selectedCandidate.gwa}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Final Computed GWA</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 'var(--space-2)' }}>
                                
                                {/* Honor Bracket Resolution */}
                                <div style={{ background: 'var(--warning-bg, rgba(245,158,11,0.1))', border: '1px solid var(--warning-border, var(--border-color))', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '1.5rem' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--warning-text, #f59e0b)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Projected Designation</div>
                                    <h2 style={{ margin: 0, color: 'var(--warning-text, #f59e0b)', fontSize: '2rem' }}>{selectedCandidate.projectedHonor}</h2>
                                </div>

                                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem' }}>Institutional Policy Validation</h4>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: '2rem' }}>
                                    {/* Residency Check */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: '1rem', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--success-text, #10b981)' }}>
                                        <span style={{ color: 'var(--success-text, #10b981)', fontSize: '1.2rem' }}>✓</span>
                                        <div style={{ flex: 1 }}>
                                            <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Academic Residency</strong>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Completed {selectedCandidate.residencyUnits} of {selectedCandidate.totalUnits} units at the university.</span>
                                        </div>
                                    </div>

                                    {/* Grade Check */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: '1rem', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${selectedCandidate.hasFailingGrades ? 'var(--danger-text, #ef4444)' : 'var(--success-text, #10b981)'}` }}>
                                        <span style={{ color: selectedCandidate.hasFailingGrades ? 'var(--danger-text, #ef4444)' : 'var(--success-text, #10b981)', fontSize: '1.2rem' }}>
                                            {selectedCandidate.hasFailingGrades ? '✗' : '✓'}
                                        </span>
                                        <div style={{ flex: 1 }}>
                                            <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Scholastic Record</strong>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {selectedCandidate.hasFailingGrades ? 'Violation: Student has a failing or dropped grade on record.' : 'No failing grades, dropped courses, or unremoved incompletes.'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Disciplinary Check */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: '1rem', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--success-text, #10b981)' }}>
                                        <span style={{ color: 'var(--success-text, #10b981)', fontSize: '1.2rem' }}>✓</span>
                                        <div style={{ flex: 1 }}>
                                            <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Disciplinary Clearance</strong>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Cleared by the Office of Student Affairs.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <Button 
                                    variant="danger" 
                                    onClick={() => handleDecision('DISQUALIFY')} 
                                    disabled={isProcessing}
                                >
                                    Disqualify Candidate
                                </Button>
                                <Button 
                                    variant="primary" 
                                    onClick={() => handleDecision('CONFER')} 
                                    disabled={isProcessing || selectedCandidate.hasFailingGrades}
                                >
                                    {isProcessing ? 'Auditing...' : 'Confer Honors Designation'}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎓</div>
                            <h3>No Candidate Selected</h3>
                            <p>Select a candidate from the queue to run the automated honors audit.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};
