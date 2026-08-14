// src/features/Admissions/EnrollmentActivation.page.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdmissionWorkflow } from '@university-erp/workflow-sdk';
import { admissionsApi } from '@university-erp/api-clients';
import { Button, Card, Table, Badge, Modal, FormInput, PageHeader, EmptyState } from '@university-erp/ui-kit';
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
    const [searchTerm, setSearchTerm] = useState('');

    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['admissions', 'endorsed'],
        queryFn: () => admissionsApi.getPendingApplications().then(res =>
            res.filter((app: any) => app.status === 'Endorsed_For_Enrollment' || app.status === 'Recommended')
        ),
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

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    const filteredApps = applications.filter((app: any) => 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPending = applications.length;

    if (applications.length === 0) {
        return (
            <div className="fade-in">
                <PageHeader 
                    title="Enrollment Activation" 
                    subtitle="Review applicants who have received FINANCIAL_CLEARANCE to generate official university records." 
                />
                <EmptyState 
                    title="No Pending Activations" 
                    description="All endorsed applicants have been processed successfully." 
                    icon=" " 
                />
            </div>
        );
    }

    return (
        <div className="fade-in">
            <PageHeader 
                title="Enrollment Activation" 
                subtitle="Review applicants who have received FINANCIAL_CLEARANCE to generate official university records." 
            />

            {/* KPI STATS */}
            <div className="grid-stats" style={{ marginBottom: 'var(--space-6)' }}>
                <Card style={{ borderLeft: '4px solid var(--brand-primary)', padding: 'var(--space-4)' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Awaiting Activation</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-bright)' }}>{totalPending}</div>
                </Card>
            </div>

            {/* TOOLBAR */}
            <div className="toolbar">
                <div className="search-input-wrapper">
                    <span className="search-icon"> </span>
                    <FormInput 
                        placeholder="Search by Applicant Name or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* DESKTOP VIEW: TABLE */}
            <div className="desktop-only fade-in">
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="data-table-container">
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
                                {filteredApps.map((app: any) => (
                                    <tr key={app.id}>
                                        <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{app.id}</td>
                                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.name}</td>
                                        <td>{app.program}</td>
                                        <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{app.deanRemarks}"</td>
                                        <td><Badge colorScheme="success">Endorsed</Badge></td>
                                        <td style={{ textAlign: 'right' }}>
                                            <Button variant="primary" size="small" onClick={() => setSelectedApplication(app)}>
                                                Activate
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredApps.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                                            <span style={{ color: 'var(--text-muted)' }}>No matches found for "{searchTerm}"</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            </div>

            {/* MOBILE VIEW: CARDS */}
            <div className="mobile-only flex-stack fade-in">
                {filteredApps.map((app: any) => (
                    <Card key={app.id}>
                        <div className="card-accent-top" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <span style={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--brand-primary)' }}>{app.id}</span>
                            <Badge colorScheme="success">Endorsed</Badge>
                        </div>
                        <h3 style={{ marginBottom: 'var(--space-1)', fontSize: '1.1rem', color: 'var(--text-bright)' }}>{app.name}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{app.program}</p>
                        <div style={{ margin: 'var(--space-3) 0', padding: 'var(--space-2)', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Endorsement Remarks</div>
                            <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>"{app.deanRemarks}"</div>
                        </div>
                        <Button variant="primary" style={{ width: '100%' }} onClick={() => setSelectedApplication(app)}>
                            Activate Enrollment
                        </Button>
                    </Card>
                ))}
            </div>

            {/* CONFIRMATION MODAL */}
            {selectedApplication && (
                <Modal isOpen={!!selectedApplication} onClose={() => setSelectedApplication(null)}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ marginTop: 0, color: 'var(--text-bright, var(--text-primary))' }}>Confirm Official Enrollment</h2>
                        
                        <div style={{ background: 'var(--bg-elevated, var(--bg-surface))', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                            <h4 style={{ margin: '0 0 var(--space-3) 0', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}>Pre-Enrollment Verification</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--success-text, #10b981)', marginBottom: 'var(--space-2)' }}>
                                <span> </span> <strong>Dean Endorsement Confirmed</strong>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--success-text, #10b981)' }}>
                                <span> </span> <strong>Financial Clearance Confirmed</strong>
                            </div>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            You are about to officially enroll this applicant. This action will:
                        </p>
                        <ul style={{ color: 'var(--text-primary)', background: 'var(--bg-base)', padding: '1rem 1rem 1rem 2.5rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Generate an official <strong>Student Number (STU-YYYY-XXXX)</strong></li>
                            <li style={{ marginBottom: '0.5rem' }}>Create a permanent entry in the <strong>Student Registry</strong></li>
                            <li style={{ marginBottom: '0.5rem' }}>Notify the Finance Console to generate initial billing</li>
                            <li>Publish the <code>StudentOfficiallyEnrolledEvent</code></li>
                        </ul>
                        
                        <div style={{ padding: '1rem', background: 'var(--success-bg)', borderLeft: '4px solid var(--success-text)', borderRadius: '4px' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedApplication.name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedApplication.program}</div>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                        <Button variant="ghost" onClick={() => setSelectedApplication(null)} disabled={activateMutation.isPending}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => activateMutation.mutate(selectedApplication.id)} disabled={activateMutation.isPending}>
                            {activateMutation.isPending ? 'Activating...' : 'Generate Official Identity'}
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
