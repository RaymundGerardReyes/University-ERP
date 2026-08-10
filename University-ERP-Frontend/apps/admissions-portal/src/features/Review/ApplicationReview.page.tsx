import { useMutation, useQuery } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';

export const ApplicationReviewPage: React.FC = () => {
    const { data: applications, isLoading } = useQuery({
        queryKey: ['pendingApplications'],
        queryFn: () => admissionsApi.getPendingApplications()
    });

    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
    const [notes, setNotes] = useState('');

    const evaluateMutation = useMutation({
        mutationFn: () => {
            const idToSubmit = selectedAppId || applications?.[0]?.id;
            return admissionsApi.submitAcademicEvaluation(idToSubmit!, 'Accept', notes);
        },
        onSuccess: () => alert('Evaluation submitted successfully!')
    });

    const selectedApp = applications?.find((a: any) => a.id === selectedAppId) || applications?.[0];
    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
                <PageHeader
                    title="Application Review"
                    subtitle="Evaluating academic merits and holistic applicant profile."
                />
                <Button>Assign Reviewer</Button>
            </div>

            <div className="grid-2">
                {/* Left Pane: Applicant Profile */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <Card>
                        {isLoading ? <div>Loading...</div> : (
                            <>
                                <select
                                    onChange={e => setSelectedAppId(e.target.value)}
                                    value={selectedAppId || selectedApp?.id || ''}
                                    style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                                >
                                    {applications?.map((app: any) => (
                                        <option key={app.id} value={app.id}>{app.name} ({app.id})</option>
                                    ))}
                                </select>
                                <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
                                <div className="profile-hero" style={{ marginBottom: 0 }}>
                                    <div className="profile-avatar">{selectedApp?.name?.charAt(0) || '?'}</div>
                                    <div>
                                        <div className="profile-name">{selectedApp?.name || 'Select Applicant'}</div>
                                        <div className="profile-email">{selectedApp?.program || 'N/A'}</div>
                                        <div className="profile-id">{selectedApp?.id || ''}</div>
                                    </div>
                                </div>
                            </>
                        )}
                    </Card>

                    <Card>
                        <h2 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-4)' }}>Academic Background</h2>
                        <div className="data-row">
                            <span className="data-label">High School</span>
                            <span className="data-value">Lincoln Memorial High</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">GPA (Unweighted)</span>
                            <span className="data-value" style={{ fontWeight: 800, color: 'var(--brand-primary)' }}>3.92</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">SAT Score</span>
                            <span className="data-value">1480</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">Class Rank</span>
                            <span className="data-value">12 / 450</span>
                        </div>
                    </Card>

                    <Card>
                        <h2 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-4)' }}>Submitted Documents</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            <div style={{ padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 500 }}>Official Transcript.pdf</span>
                                <Badge colorScheme="success">Verified</Badge>
                            </div>
                            <div style={{ padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 500 }}>Personal_Statement.docx</span>
                                <Badge colorScheme="info">Ready for Review</Badge>
                            </div>
                            <div style={{ padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 500 }}>Letter_of_Rec_1.pdf</span>
                                <Badge colorScheme="success">Verified</Badge>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Pane: Review Rubric */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div className="card-accent-top" style={{ background: 'var(--brand-secondary)' }} />
                        <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-6)', color: 'var(--brand-secondary)' }}>Scoring Rubric</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Academic Rigor (0-10)</label>
                                    <span style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>8 / 10</span>
                                </div>
                                <input type="range" min="0" max="10" defaultValue="8" style={{ width: '100%' }} />
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Extracurricular Impact (0-10)</label>
                                    <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>- / 10</span>
                                </div>
                                <input type="range" min="0" max="10" defaultValue="0" style={{ width: '100%' }} />
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Personal Essay Quality (0-10)</label>
                                    <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>- / 10</span>
                                </div>
                                <input type="range" min="0" max="10" defaultValue="0" style={{ width: '100%' }} />
                            </div>

                            <div style={{ marginTop: 'var(--space-4)' }}>
                                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Reviewer Notes</label>
                                <textarea
                                    rows={5}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Enter your assessment notes here..."
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--space-4)' }}>
                            <Button style={{ flex: 1 }}>Save Draft</Button>
                            <Button style={{ flex: 1, background: 'var(--success-text)' }} onClick={() => evaluateMutation.mutate()} disabled={!selectedApp || evaluateMutation.isPending}>
                                {evaluateMutation.isPending ? 'Submitting...' : 'Submit Final Review'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
