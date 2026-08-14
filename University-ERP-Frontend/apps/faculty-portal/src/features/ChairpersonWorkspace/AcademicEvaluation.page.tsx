import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdmissionWorkflow } from '@university-erp/workflow-sdk';
import { admissionsApi } from '@university-erp/api-clients';
import { Button, Card, Table, Badge, Modal } from '@university-erp/ui-kit';
import { createLogger } from '@university-erp/core-logger';

const logger = createLogger('faculty-portal', 'AcademicEvaluation');

export const AcademicEvaluationPage: React.FC = () => {
    const queryClient = useQueryClient();
    
    // UI State for the Evaluation Modal
    const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
    const [remarks, setRemarks] = useState('');

    // Fetch applications currently sitting in the Chairperson's evaluation stage
    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['admissions', 'underEvaluation'],
        queryFn: async () => {
            const res = await admissionsApi.getPendingApplications();
            // Filter down to only those needing academic evaluation
            return res.filter((app: any) => app.status === 'UnderAcademicEvaluation');
        },
        // Fallback mock data to ensure the UI renders during frontend development
        initialData: [
            { id: 'APP-2026-003', name: 'Alice Johnson', program: 'BS Computer Science', interviewScore: '92/100', preReqsMet: true },
            { id: 'APP-2026-004', name: 'Bob Williams', program: 'BS Information Technology', interviewScore: '85/100', preReqsMet: false },
        ] as any
    });

    // Mutation to advance the enterprise workflow to the Dean
    const recommendMutation = useMutation({
        mutationFn: ({ id, remarks }: { id: string, remarks: string }) => 
            AdmissionWorkflow.advance(id, 'ChairpersonRecommendation', remarks),
        onSuccess: (data, variables) => {
            logger.info(`Successfully recommended applicant ${variables.id}.`);
            queryClient.invalidateQueries({ queryKey: ['admissions', 'underEvaluation'] });
            setSelectedApplicant(null);
            setRemarks('');
        },
        onError: (err) => {
            logger.error('Failed to recommend applicant', err);
            alert('Failed to process recommendation. Please check the system logs.');
        }
    });

    const confirmRecommendation = () => {
        if (selectedApplicant) {
            recommendMutation.mutate({ id: selectedApplicant.id, remarks });
        }
    };

    return (
        <div className="fade-in">
            <div style={{ marginBottom: 'var(--space-8)' }}>
                <h1 className="page-title">Academic Evaluation</h1>
                <p className="page-subtitle">
                    Review applicant credentials, interview scores, and issue program recommendations.
                </p>
            </div>

            <Card style={{ padding: '0', overflow: 'hidden' }}>
                {isLoading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading evaluation queue...</div>
                ) : applications.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
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
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.name}</div>
                                        <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{app.id}</div>
                                    </td>
                                    <td>{app.program}</td>
                                    <td style={{ fontWeight: 600 }}>{app.interviewScore}</td>
                                    <td>
                                        {app.preReqsMet ? 
                                             <Badge colorScheme="success">Satisfied</Badge> : 
                                             <Badge colorScheme="warning">Deficient</Badge>
                                        }
                                    </td>
                                    <td>
                                        <Badge colorScheme="info">Pending Review</Badge>
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

            {/* Evaluation Decision Modal */}
            {selectedApplicant && (
                <Modal 
                     isOpen={!!selectedApplicant} 
                     onClose={() => { setSelectedApplicant(null); setRemarks(''); }}
                >
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Submit Recommendation</h3>
                        
                        <div style={{ padding: '1rem', background: 'var(--bg-active)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-accent)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Applicant</div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedApplicant.name}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Target Program</div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedApplicant.program}</div>
                                </div>
                            </div>
                        </div>

                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            Academic Remarks
                        </label>
                        <textarea 
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="e.g., Strongly recommended. Applicant shows high aptitude in logical reasoning."
                            style={{ 
                                 width: '100%', minHeight: '100px', padding: '0.75rem', borderRadius: 'var(--radius-md)', 
                                 border: '1px solid var(--border-color)', background: 'var(--bg-base)', 
                                 color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical'
                            }}
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            This recommendation will be forwarded to the Dean for final capacity endorsement.
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
