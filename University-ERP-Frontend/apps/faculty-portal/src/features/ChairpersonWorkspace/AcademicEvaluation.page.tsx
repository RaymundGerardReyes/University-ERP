import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdmissionWorkflow } from '@university-erp/workflow-sdk';
import { admissionsApi } from '@university-erp/api-clients';
import { Button, Card, Table, Badge, Modal, FormInput } from '@university-erp/ui-kit';
import { createLogger } from '@university-erp/core-logger';

const logger = createLogger('faculty-portal', 'AcademicEvaluation');

export const AcademicEvaluationPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
    const [remarks, setRemarks] = useState('');

    // Fetch applications that have completed the interview
    const { data: applications, isLoading } = useQuery({
        queryKey: ['admissions', 'underEvaluation'],
        queryFn: () => admissionsApi.getPendingApplications().then(res => 
            res.filter((app: any) => app.status === 'UnderAcademicEvaluation') 
        ),
        // Mock fallback for UI development
        initialData: [
            { id: 'APP-2026-003', name: 'Alice Johnson', program: 'BS Computer Science', stage: 'UnderAcademicEvaluation', interviewScore: '92/100', preReqsMet: true },
            { id: 'APP-2026-004', name: 'Bob Williams', program: 'BS Information Technology', stage: 'UnderAcademicEvaluation', interviewScore: '85/100', preReqsMet: false },
        ] as any
    });

    const recommendMutation = useMutation({
        mutationFn: ({ id, remarks }: { id: string, remarks: string }) => AdmissionWorkflow.advance(id, 'ChairpersonRecommendation', remarks),
        onSuccess: (data, variables) => {
            logger.info(`Successfully recommended applicant ${variables.id}.`);
            queryClient.invalidateQueries({ queryKey: ['admissions', 'underEvaluation'] });
            setSelectedApplicant(null);
            setRemarks('');
        },
        onError: (err) => {
            logger.error('Failed to recommend applicant', err);
            alert('Failed to process recommendation.');
        }
    });

    const confirmRecommendation = () => {
        if (selectedApplicant) {
            recommendMutation.mutate({ id: selectedApplicant.id, remarks });
        }
    };

    return (
        <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                    Academic Evaluation
                </h1>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                    Review applicant credentials, interview scores, and issue program recommendations.
                </p>
            </div>

            <Card style={{ padding: '0', overflow: 'hidden', background: 'var(--surface-overlay)' }}>
                {isLoading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading evaluation queue...</div>
                ) : applications.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>No Pending Evaluations</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>All applicants have been processed.</p>
                    </div>
                ) : (
                    <Table>
                        <thead>
                            <tr>
                                <th>Applicant</th>
                                <th>Program</th>
                                <th>Interview Score</th>
                                <th>Prerequisites</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app: any) => (
                                <tr key={app.id}>
                                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                                        <div>{app.name}</div>
                                        <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{app.id}</div>
                                    </td>
                                    <td>{app.program}</td>
                                    <td style={{ fontWeight: 600 }}>{app.interviewScore}</td>
                                    <td>
                                        {app.preReqsMet ? 
                                            <Badge variant="success">Satisfied</Badge> : 
                                            <Badge variant="warning">Deficient</Badge>
                                        }
                                    </td>
                                    <td>
                                        <Badge variant="info">Pending Review</Badge>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <Button 
                                            variant="secondary" 
                                            size="small" 
                                            onClick={() => setSelectedApplicant(app)}
                                        >
                                            Evaluate & Recommend
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>

            {selectedApplicant && (
                <Modal 
                    isOpen={!!selectedApplicant} 
                    onClose={() => { setSelectedApplicant(null); setRemarks(''); }}
                >
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ padding: '1rem', background: 'var(--bg-active)', borderRadius: '8px', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Applicant</div>
                                    <div style={{ fontWeight: 600 }}>{selectedApplicant.name}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Program</div>
                                    <div style={{ fontWeight: 600 }}>{selectedApplicant.program}</div>
                                </div>
                            </div>
                        </div>

                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            Academic Recommendation Remarks
                        </label>
                        <textarea 
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="e.g., Strongly recommended. Applicant shows high aptitude in logical reasoning."
                            style={{ 
                                width: '100%', minHeight: '100px', padding: '0.75rem', borderRadius: '8px', 
                                border: '1px solid var(--border-color)', background: 'var(--bg-base)', 
                                color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical'
                            }}
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            This recommendation will be forwarded to the Dean for final endorsement. You are not officially enrolling the student.
                        </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setSelectedApplicant(null)} disabled={recommendMutation.isPending}>
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={confirmRecommendation} 
                            disabled={recommendMutation.isPending || remarks.trim() === ''}
                        >
                            {recommendMutation.isPending ? 'Processing...' : 'Submit Recommendation'}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
