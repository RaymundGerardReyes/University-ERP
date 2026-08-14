import React, { useState } from 'react';
import { Card, Table, Badge, Button, PageHeader } from '@university-erp/ui-kit';

export const AcademicStandingPage: React.FC = () => {
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Mock data representing automated standing flags from the backend
    const flaggedStudents = [
        {
            id: 'STU-2022-8412', name: 'Olivia Roberts', program: 'BS Engineering',
            termGwa: '3.25', previousStanding: 'Good', recommendedStanding: 'Probationary',
            reason: 'Term GWA fell below the 2.50 threshold for the College of Engineering.',
            type: 'DELINQUENCY'
        },
        {
            id: 'STU-2023-1105', name: 'Marcus Johnson', program: 'BA Economics',
            termGwa: '1.45', previousStanding: 'Good', recommendedStanding: 'Dean\'s Lister',
            reason: 'Term GWA exceeded the 1.50 minimum requirement for honors.',
            type: 'HONOR'
        }
    ];

    const handleUpdateStanding = () => {
        setIsProcessing(true);
        setTimeout(() => {
            alert(`Academic standing for ${selectedStudent.name} officially updated to ${selectedStudent.recommendedStanding}. Notification dispatched.`);
            setIsProcessing(false);
            setSelectedStudent(null);
        }, 800);
    };

    return (
        <div className="fade-in">
            <PageHeader 
                title="Academic Standing Review" 
                subtitle="Evaluate scholastic delinquencies and confer term honors." 
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)', height: '70vh' }}>
                
                {/* Left Pane: Flagged Queue */}
                <Card style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-base)' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-bright, var(--text-primary))' }}>Pending Standing Updates</h3>
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {flaggedStudents.map((stu) => (
                            <div 
                                key={stu.id}
                                onClick={() => setSelectedStudent(stu)}
                                style={{
                                    padding: 'var(--space-4)',
                                    borderBottom: '1px solid var(--border-subtle, var(--border-color))',
                                    cursor: 'pointer',
                                    background: selectedStudent?.id === stu.id ? 'var(--bg-active, var(--bg-hover))' : 'transparent',
                                    borderLeft: `4px solid ${stu.type === 'HONOR' ? 'var(--success-text, #10b981)' : 'var(--danger-text, #ef4444)'}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <strong style={{ color: 'var(--text-bright, var(--text-primary))' }}>{stu.name}</strong>
                                    <span style={{ fontWeight: 'bold', color: stu.type === 'HONOR' ? 'var(--success-text, #10b981)' : 'var(--danger-text, #ef4444)' }}>
                                        GWA: {stu.termGwa}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{stu.program}</div>
                                <Badge colorScheme={stu.type === 'HONOR' ? 'success' : 'danger'}>{stu.recommendedStanding}</Badge>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Right Pane: Standing Evaluation */}
                <Card style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {selectedStudent ? (
                        <>
                            <div style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h2 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-bright, var(--text-primary))' }}>Standing Audit: {selectedStudent.name}</h2>
                                        <div style={{ color: 'var(--text-secondary)' }}>Student ID: <span style={{ fontFamily: 'monospace' }}>{selectedStudent.id}</span></div>
                                    </div>
                                    <Badge colorScheme={selectedStudent.type === 'HONOR' ? 'success' : 'danger'}>Flagged for Update</Badge>
                                </div>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: '1.5rem' }}>
                                    <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Previous Standing</div>
                                        <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.2rem' }}>{selectedStudent.previousStanding}</div>
                                    </div>
                                    <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${selectedStudent.type === 'HONOR' ? 'var(--success-text, #10b981)' : 'var(--warning-text, #f59e0b)'}` }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Recommended Standing</div>
                                        <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.2rem' }}>{selectedStudent.recommendedStanding}</div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem', background: 'var(--bg-elevated, var(--bg-surface))', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', marginTop: 0 }}>System Trigger Reason</h4>
                                    <p style={{ margin: 0, color: 'var(--text-primary)' }}>{selectedStudent.reason}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <Button variant="ghost" onClick={() => setSelectedStudent(null)} disabled={isProcessing}>Dismiss Flag</Button>
                                <Button 
                                    variant={selectedStudent.type === 'HONOR' ? 'success' : 'danger'}
                                    onClick={handleUpdateStanding} 
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Updating Ledger...' : `Confirm ${selectedStudent.recommendedStanding} Status`}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>⚖️</div>
                            <h3>No Record Selected</h3>
                            <p>Select a flagged student to evaluate and update their academic standing.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};
