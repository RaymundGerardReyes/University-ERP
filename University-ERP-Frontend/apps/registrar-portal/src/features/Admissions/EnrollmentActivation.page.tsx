import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdmissionWorkflow } from '@university-erp/workflow-sdk';
import { Button, Card, Table, Badge, Modal, FormInput, PageHeader, EmptyState } from '@university-erp/ui-kit';
import { createLogger } from '@university-erp/core-logger';
import axios from 'axios';
import React, { useState } from 'react';
import { useAdmissionsQueue } from '../AdmissionsDivision/Admissions.hooks';
import { AdmissionsQueueItem } from '../AdmissionsDivision/Admissions.types';

const logger = createLogger('registrar-portal', 'EnrollmentActivation');

export const EnrollmentActivationPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedApplication, setSelectedApplication] = useState<AdmissionsQueueItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionError, setActionError] = useState<string | null>(null);

    const { data: applications = [], isLoading, isError } = useAdmissionsQueue();

    const activateMutation = useMutation({
        mutationFn: async (id: string) => {
            return await AdmissionWorkflow.advance(id, 'RegistrarEnrollment');
        },
        onSuccess: (_, id) => {
            logger.info(`Successfully processed enrollment activation for admission ID: ${id}`);
            queryClient.invalidateQueries({ queryKey: ['registrar', 'admissionsQueue'] });
            setSelectedApplication(null);
        },
        onError: (error: unknown) => {
            let msg = "Failed to activate enrollment. Verify backend connectivity.";
            if (axios.isAxiosError(error)) msg = error.response?.data?.message || error.message;
            else if (error instanceof Error) msg = error.message;
            logger.error('Failed to activate enrollment', error);
            setActionError(msg);
        }
    });

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;
    if (isError) return <EmptyState title="Queue Unavailable" description="Failed to load the enrollment activation queue from the server." icon="🚫" />;

    const filteredApps = applications.filter((app: AdmissionsQueueItem) => 
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (applications.length === 0) {
        return (
            <div className="fade-in">
                <PageHeader title="Enrollment Activation" subtitle="Review applicants who have received Financial Clearance to finalize official enrollment." />
                <EmptyState title="No Pending Activations" description="All financially cleared applicants have been enrolled successfully." icon="✅" />
            </div>
        );
    }

    return (
        <div className="fade-in">
            <PageHeader title="Enrollment Activation" subtitle="Review applicants who have received Financial Clearance to finalize official enrollment." />
            
            <div className="toolbar">
                <div className="search-input-wrapper">
                    <FormInput placeholder="Search by Applicant Name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            <div className="desktop-only fade-in">
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="data-table-container">
                        <Table>
                            <thead>
                                <tr>
                                    <th>Admission ID</th>
                                    <th>Applicant Name</th>
                                    <th>Program</th>
                                    <th>Queue Status</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApps.map((app: AdmissionsQueueItem) => (
                                    <tr key={app.id}>
                                        <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{app.id}</td>
                                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.applicantName}</td>
                                        <td>{app.program}</td>
                                        <td><Badge colorScheme="success">{app.status.replace('_', ' ')}</Badge></td>
                                        <td style={{ textAlign: 'right' }}>
                                            <Button variant="primary" size="small" onClick={() => { setActionError(null); setSelectedApplication(app); }}>
                                                Activate Enrollment
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            </div>

            {selectedApplication && (
                <Modal isOpen={!!selectedApplication} onClose={() => !activateMutation.isPending && setSelectedApplication(null)}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ marginTop: 0, color: 'var(--text-bright)' }}>Confirm Official Enrollment</h2>
                        
                        {actionError && (
                            <div style={{ padding: 'var(--space-3)', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)' }}>
                                {actionError}
                            </div>
                        )}

                        <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                            <h4 style={{ margin: '0 0 var(--space-3) 0', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}>Pre-Enrollment Verification</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--success-text)' }}>
                                <span>✅</span> <strong>Financial Clearance Confirmed</strong>
                            </div>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            You are about to officially activate enrollment for this applicant. This will officially transition the admission state to Enrolled.
                        </p>
                        
                        <div style={{ padding: '1rem', background: 'var(--success-bg)', borderLeft: '4px solid var(--success-text)', borderRadius: '4px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedApplication.applicantName}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedApplication.program}</div>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <Button variant="ghost" onClick={() => setSelectedApplication(null)} disabled={activateMutation.isPending}>Cancel</Button>
                        <Button variant="primary" onClick={() => activateMutation.mutate(selectedApplication.id)} disabled={activateMutation.isPending}>
                            {activateMutation.isPending ? 'Activating...' : 'Activate Enrollment'}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
