import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdmissionWorkflow } from '@university-erp/workflow-sdk';
import { admissionsApi } from '@university-erp/api-clients';
import { Button, Card, Table, Badge, Modal, FormInput } from '@university-erp/ui-kit';
import { createLogger } from '@university-erp/core-logger';

const logger = createLogger('registrar-portal', 'EnrollmentActivation');

interface EnrollmentActivationResponse {
    success?: boolean;
    newStudentId?: string;
    newStatus?: string;
}

export const EnrollmentActivationPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedApplication, setSelectedApplication] = useState<any | null>(null);

    // Fetch applications that have been Endorsed by the Dean
    const { data: applications, isLoading } = useQuery({
        queryKey: ['admissions', 'endorsed'],
        queryFn: () => admissionsApi.getPendingApplications().then(res => 
            // In a real API, we would filter status=Endorsed_For_Enrollment on the backend
            res.filter((app: any) => app.status === 'Endorsed_For_Enrollment' || app.status === 'Recommended') 
        ),
        // Mock fallback for UI development
        initialData: [
            { id: 'APP-2026-001', name: 'John Doe', program: 'BS Computer Science', stage: 'Endorsed', status: 'Endorsed_For_Enrollment', deanRemarks: 'Excellent candidate.' },
            { id: 'APP-2026-002', name: 'Jane Smith', program: 'BS Information Technology', stage: 'Endorsed', status: 'Endorsed_For_Enrollment', deanRemarks: 'Approved for Fall semester.' },
        ] as any
    });

    const activateMutation = useMutation({
        mutationFn: (id: string) => AdmissionWorkflow.advance(id, 'RegistrarEnrollment'),
        onSuccess: (data: EnrollmentActivationResponse, id: string) => {
            logger.info(`Successfully enrolled applicant ${id}. Generated ID: ${data?.newStudentId}`);
            queryClient.invalidateQueries({ queryKey: ['admissions', 'endorsed'] });
            setSelectedApplication(null);
            alert(`Enrollment Successful!\nGenerated Official Student ID: ${data?.newStudentId || 'STU-2026-9999'}`);
        },
        onError: (err) => {
            logger.error('Failed to activate enrollment', err);
            alert('Failed to activate enrollment. See console for details.');
        }
    });

    const handleActivate = (app: any) => {
        setSelectedApplication(app);
    };

    const confirmActivation = () => {
        if (selectedApplication) {
            activateMutation.mutate(selectedApplication.id);
        }
    };

    return (
        <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0', background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Enrollment Activation
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        Review Dean-endorsed applicants and generate official university records.
                    </p>
                </div>
            </div>

            <Card style={{ padding: '0', overflow: 'hidden', background: 'var(--surface-overlay)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-light)' }}>
                {isLoading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading endorsed applicants...</div>
                ) : applications.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>No Pending Activations</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>All endorsed applicants have been processed.</p>
                    </div>
                ) : (
                    <Table>
                        <thead>
                            <tr>
                                <th>Application ID</th>
                                <th>Applicant Name</th>
                                <th>Program</th>
                                <th>Dean Endorsement</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app: any) => (
                                <tr key={app.id}>
                                    <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{app.id}</td>
                                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{app.name}</td>
                                    <td>{app.program}</td>
                                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{app.deanRemarks}"</td>
                                    <td>
                                        <Badge variant="success">Endorsed</Badge>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <Button 
                                            variant="primary" 
                                            size="small" 
                                            onClick={() => handleActivate(app)}
                                            style={{ background: 'linear-gradient(135deg, hsl(200, 80%, 45%), hsl(240, 80%, 50%))', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                                        >
                                            Activate Enrollment
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>

            {selectedApplication && (
                <Modal 
                    isOpen={!!selectedApplication} 
                    onClose={() => setSelectedApplication(null)}
                >
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Confirm Official Enrollment</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            You are about to officially enroll this applicant. This action will:
                        </p>
                        <ul style={{ color: 'var(--text-primary)', background: 'var(--surface-default)', padding: '1rem 1rem 1rem 2.5rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Generate an official <strong>Student Number (STU-YYYY-XXXX)</strong></li>
                            <li style={{ marginBottom: '0.5rem' }}>Create a permanent entry in the <strong>Student Registry</strong></li>
                            <li style={{ marginBottom: '0.5rem' }}>Notify the Finance Console to generate initial billing</li>
                            <li>Publish the <code style={{ background: 'var(--bg-base)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>StudentOfficiallyEnrolledEvent</code></li>
                        </ul>
                        
                        <div style={{ padding: '1rem', background: 'rgba(0, 200, 100, 0.1)', borderLeft: '4px solid hsl(150, 70%, 40%)', borderRadius: '4px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{selectedApplication.name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedApplication.program}</div>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <Button variant="ghost" onClick={() => setSelectedApplication(null)} disabled={activateMutation.isPending}>
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={confirmActivation} 
                            disabled={activateMutation.isPending}
                            style={{ background: 'linear-gradient(135deg, hsl(150, 80%, 40%), hsl(170, 80%, 35%))', border: 'none', boxShadow: '0 4px 15px rgba(0, 200, 100, 0.3)' }}
                        >
                            {activateMutation.isPending ? 'Activating...' : 'Generate Official Identity'}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
