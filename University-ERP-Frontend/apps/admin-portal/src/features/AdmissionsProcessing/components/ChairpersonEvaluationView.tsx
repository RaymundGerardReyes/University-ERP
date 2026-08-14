import React, { useState } from 'react';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, Modal, Table } from '@university-erp/ui-kit';
import { useChairpersonQueue, useRecommendApplication } from '../AdmissionsProcessing.hooks';

export const ChairpersonEvaluationView: React.FC = () => {
    const { identity } = useAuth();
    
    // In a real app, you would resolve the Chairperson's department from their Identity claims
    const department = "College of Computer Studies"; 
    
    const { data: applications, isLoading, isError } = useChairpersonQueue(department);
    const recommendMutation = useRecommendApplication();
    
    const [evaluatingApp, setEvaluatingApp] = useState<{ id: string, name: string } | null>(null);
    const [remarks, setRemarks] = useState('');

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;
    if (isError || !applications) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">Queue Unavailable</div>
                <div className="stub-subtitle">Failed to load the evaluation queue.</div>
            </div>
        );
    }

    // Filter to show applications that are under evaluation or submitted with paid fee
    const queue = applications.filter(app => app.status === 'UnderAcademicEvaluation' || app.status === 'Submitted');

    const handleRecommend = () => {
        if (!evaluatingApp) return;
        
        recommendMutation.mutate({ 
            applicationId: evaluatingApp.id, 
            remarks: remarks || 'Recommended for admission based on academic interview.' 
        }, {
            onSuccess: () => {
                setEvaluatingApp(null);
                setRemarks('');
            }
        });
    };

    return (
        <div className="fade-in">
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                    <h3>{department} - Chairperson Queue</h3>
                    <Badge colorScheme="info">{queue.length} Pending Evaluations</Badge>
                </div>

                <Table>
                    <thead>
                        <tr>
                            <th>Applicant</th>
                            <th>Target Program</th>
                            <th>GPA</th>
                            <th>Current Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queue.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No applications currently require academic evaluation.
                                </td>
                            </tr>
                        ) : (
                            queue.map(app => (
                                <tr key={app.id}>
                                    <td style={{ fontWeight: 'bold' }}>{app.applicantName}</td>
                                    <td>{app.program}</td>
                                    <td style={{ color: app.gpa >= 3.0 ? 'var(--success-text)' : 'var(--warning-text)', fontWeight: 600 }}>
                                        {app.gpa ? app.gpa.toFixed(2) : '3.50'}
                                    </td>
                                    <td><Badge colorScheme="warning">Awaiting Evaluation</Badge></td>
                                    <td>
                                        <Button 
                                            variant="outline" 
                                            size="small"
                                            onClick={() => setEvaluatingApp({ id: app.id, name: app.applicantName })}
                                        >
                                            Evaluate
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>

            {/* Evaluation Modal */}
            <Modal isOpen={!!evaluatingApp} onClose={() => setEvaluatingApp(null)}>
                <h3 style={{ marginBottom: 'var(--space-2)' }}>Academic Evaluation</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontSize: '0.9rem' }}>
                    Provide your formal recommendation for <strong>{evaluatingApp?.name}</strong>.
                </p>
                
                <textarea 
                    rows={4}
                    placeholder="Enter academic remarks and interview observations..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    style={{ 
                        width: '100%', 
                        padding: 'var(--space-3)', 
                        borderRadius: 'var(--radius-sm)', 
                        border: '1px solid var(--border-color)', 
                        background: 'var(--bg-base)', 
                        color: 'var(--text-primary)',
                        marginBottom: 'var(--space-4)'
                    }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                    <Button variant="secondary" onClick={() => setEvaluatingApp(null)}>Cancel</Button>
                    <Button 
                        variant="primary" 
                        onClick={handleRecommend}
                        disabled={recommendMutation.isPending}
                    >
                        {recommendMutation.isPending ? 'Processing...' : 'Recommend to Dean'}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};