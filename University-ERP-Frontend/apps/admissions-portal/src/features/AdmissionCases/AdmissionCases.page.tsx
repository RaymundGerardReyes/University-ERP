import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients';
import { Badge, Button, Card, Modal, PageHeader, Table } from '@university-erp/ui-kit';
import React, { useState } from 'react';

export const AdmissionCasesPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
    const [evaluatingAppId, setEvaluatingAppId] = useState<string | null>(null);
    const [evaluationNotes, setEvaluationNotes] = useState('');

    // Fetch pending applications based on the selected department
    const { data: applications, isLoading, isError } = useQuery({
        queryKey: ['pendingApplications', selectedDepartment],
        queryFn: () => admissionsApi.getPendingApplications(selectedDepartment === 'All' ? undefined : selectedDepartment)
    });

    // Mutation to submit the final evaluation decision
    const evaluateMutation = useMutation({
        mutationFn: ({ id, decision, notes }: { id: string, decision: 'Accept' | 'Reject' | 'Waitlist', notes: string }) =>
            admissionsApi.submitAcademicEvaluation(id, decision, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
            setEvaluatingAppId(null);
            setEvaluationNotes('');
        },
        onError: (error) => {
            console.error("Evaluation submission failed", error);
            alert("Failed to submit the evaluation. Please try again.");
        }
    });

    const handleDecision = (decision: 'Accept' | 'Reject' | 'Waitlist') => {
        if (!evaluatingAppId) return;
        evaluateMutation.mutate({
            id: evaluatingAppId,
            decision,
            notes: evaluationNotes
        });
    };

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    if (isError) {
        return (
            <div className="stub-page fade-in">
                <div className="stub-title">System Error</div>
                <div className="stub-subtitle">Failed to load admission cases from the server.</div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <PageHeader
                title="Admission Cases"
                subtitle="Review and evaluate incoming student applications."
            />

            <Card style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Filter by College:</span>
                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        style={{
                            padding: 'var(--space-2)',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    >
                        <option value="All">All Colleges</option>
                        <option value="College of Computer Studies">College of Computer Studies</option>
                        <option value="College of Engineering">College of Engineering</option>
                        <option value="College of Business">College of Business</option>
                    </select>
                </div>

                <Table>
                    <thead>
                        <tr>
                            <th>Application ID</th>
                            <th>Applicant</th>
                            <th>Program</th>
                            <th>GPA</th>
                            <th>Fee Status</th>
                            <th>Current State</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications?.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
                                    No pending applications found for this department.
                                </td>
                            </tr>
                        ) : (
                            applications?.map(app => {
                                const isFeePaid = app.applicationFeeStatus === 'Paid';

                                return (
                                    <tr key={app.id}>
                                        <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem' }}>{app.id}</td>
                                        <td style={{ fontWeight: 600 }}>{app.applicantName}</td>
                                        <td>{app.program}</td>
                                        <td style={{ color: app.gpa >= 3.0 ? 'var(--success-text)' : 'var(--warning-text)' }}>
                                            {app.gpa.toFixed(2)}
                                        </td>
                                        <td>
                                            <Badge colorScheme={isFeePaid ? 'success' : 'warning'}>
                                                {isFeePaid ? 'Paid' : 'Pending'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge colorScheme="info">
                                                {app.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button
                                                variant={isFeePaid ? "primary" : "secondary"}
                                                size="small"
                                                onClick={() => setEvaluatingAppId(app.id)}
                                                disabled={!isFeePaid || evaluateMutation.isPending}
                                                title={!isFeePaid ? "Cannot evaluate until processing fee is paid" : "Evaluate Candidate"}
                                            >
                                                Evaluate
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </Table>
            </Card>

            {/* Evaluation Modal */}
            <Modal isOpen={!!evaluatingAppId} onClose={() => { setEvaluatingAppId(null); setEvaluationNotes(''); }}>
                <h3 style={{ marginBottom: 'var(--space-4)', color: 'var(--text-primary)' }}>Evaluate Applicant</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)', fontSize: '0.9rem' }}>
                    Please provide your academic evaluation notes before making a final decision. This action cannot be easily reversed.
                </p>

                <div style={{ marginBottom: 'var(--space-6)' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                        Evaluation Remarks (Required for Waitlist/Reject)
                    </label>
                    <textarea
                        rows={4}
                        value={evaluationNotes}
                        onChange={(e) => setEvaluationNotes(e.target.value)}
                        placeholder="Enter academic remarks here..."
                        style={{
                            width: '100%',
                            padding: 'var(--space-3)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-base)',
                            color: 'var(--text-primary)',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                    <Button
                        variant="danger"
                        onClick={() => handleDecision('Reject')}
                        disabled={evaluateMutation.isPending || (!evaluationNotes && true)}
                    >
                        Reject
                    </Button>
                    <Button
                        variant="warning"
                        onClick={() => handleDecision('Waitlist')}
                        disabled={evaluateMutation.isPending || (!evaluationNotes && true)}
                    >
                        Waitlist
                    </Button>
                    <Button
                        variant="success"
                        onClick={() => handleDecision('Accept')}
                        disabled={evaluateMutation.isPending}
                    >
                        Accept Candidate
                    </Button>
                </div>
            </Modal>
        </div>
    );
};