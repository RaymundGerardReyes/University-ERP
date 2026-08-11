import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { admissionsApi, PendingApplicationDto } from '@university-erp/api-clients';
import { PageHeader, Card, Badge, Button, DocumentPreviewModal } from '@university-erp/ui-kit';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

type CaseTab = 'overview' | 'requirements' | 'evaluation' | 'decision';

const STAGES = ['Submitted', 'Verification', 'Evaluation', 'Decision', 'Enrolled'];
const STAGE_INDEX: Record<string, number> = {
    'Submitted': 0, 'PendingIntake': 0, 'SecretaryQueue': 0,
    'DocumentVerification': 1, 'InterviewPending': 1,
    'InterviewScheduled': 2, 'UnderAcademicEvaluation': 2, 'UnderReview': 2, 'ChairpersonQueue': 2,
    'Recommended': 3, 'Endorsed_For_Enrollment': 3, 'CommitteeDecision': 3,
    'Accepted': 4, 'Enrolled': 4,
};

const TABS: { key: CaseTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'requirements', label: 'Requirements' },
    { key: 'evaluation', label: 'Evaluation' },
    { key: 'decision', label: 'Decision' },
];

export const AdmissionCasePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const activeTab = (searchParams.get('tab') as CaseTab) || 'overview';

    const [reviewNotes, setReviewNotes] = useState('');
    const [decisionMade, setDecisionMade] = useState<string | null>(null);
    const [previewDoc, setPreviewDoc] = useState<{ isOpen: boolean; name: string; filePath: string | null }>({ isOpen: false, name: '', filePath: null });

    // Fetch dynamic application data from the API
    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['pendingApplications'],
        queryFn: () => admissionsApi.getPendingApplications()
    });

    const applicant = applications.find((a) => a.id === id);

    const verifyMutation = useMutation({
        mutationFn: () => admissionsApi.verifyDocumentsAndForward(id!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
            alert('Documents verified. Case updated in database.');
        },
    });

    const decisionMutation = useMutation({
        mutationFn: (decision: 'Accept' | 'Reject' | 'Waitlist') =>
            admissionsApi.submitAcademicEvaluation(id!, decision, reviewNotes),
        onSuccess: (_, decision) => {
            setDecisionMade(decision);
            queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
        },
    });

    const handoffMutation = useMutation({
        mutationFn: () => admissionsApi.generateStudentIdentityAndEnroll(id!),
        onSuccess: () => {
            alert('Case transferred to Registrar. Official Student ID generated.');
            navigate('/applications');
        },
    });

    const setTab = (tab: CaseTab) => setSearchParams({ tab });
    
    // Dynamic document counts directly from backend DTO
    const totalDocs = applicant?.documents?.length || 0;
    const docsVerifiedCount = applicant?.documents?.filter(d => d.status === 'Verified' || d.status === 'Uploaded').length || 0;
    const allDocsVerified = totalDocs > 0 && docsVerifiedCount === totalDocs;

    const stageIdx = STAGE_INDEX[applicant?.status || 'Submitted'] ?? 0;

    if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

    if (!applicant) {
        return (
            <div className="fade-in stub-page">
                <h3>Application Case Not Found</h3>
                <p>The requested application ID `{id}` could not be located in the database queue.</p>
                <Button onClick={() => navigate('/applications')}>Back to Applications</Button>
            </div>
        );
    }

    return (
        <div className="fade-in">
            {/* Breadcrumb Navigation */}
            <div style={{ marginBottom: 'var(--space-4)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <Link to="/applications" style={{ color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 500 }}>
                    ← Applications
                </Link>
                <span style={{ margin: '0 0.5rem' }}>›</span>
                <span>{applicant.applicantName}</span>
            </div>

            {/* Case Header Card */}
            <Card style={{ marginBottom: 'var(--space-6)', padding: 0, overflow: 'hidden' }}>
                <div style={{ height: '4px', background: 'var(--brand-gradient)' }} />
                <div style={{ padding: 'var(--space-6)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--brand-gradient-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                                {applicant.applicantName.charAt(0)}
                            </div>
                            <div>
                                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>{applicant.applicantName}</h1>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{applicant.program} ({applicant.department})</div>
                                <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>ID: {applicant.id}</code>
                            </div>
                        </div>
                        <Badge colorScheme={applicant.status === 'Accepted' || applicant.status === 'Enrolled' ? 'success' : applicant.status === 'Rejected' ? 'danger' : 'info'}>
                            {applicant.status}
                        </Badge>
                    </div>

                    {/* Stage Progress Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                        {STAGES.map((stage, idx) => {
                            const done = idx < stageIdx;
                            const current = idx === stageIdx;
                            return (
                                <React.Fragment key={stage}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
                                        <div style={{
                                            width: '28px', height: '28px', borderRadius: '50%',
                                            background: done ? 'var(--success-text)' : current ? 'var(--brand-primary)' : 'var(--bg-hover)',
                                            border: current ? '3px solid var(--brand-primary)' : done ? '3px solid var(--success-text)' : '2px solid var(--border-color)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.75rem', color: (done || current) ? 'white' : 'var(--text-muted)',
                                            fontWeight: 700, transition: 'all 0.2s',
                                        }}>
                                            {done ? '✓' : idx + 1}
                                        </div>
                                        <span style={{ fontSize: '0.7rem', fontWeight: current ? 700 : 500, color: current ? 'var(--brand-primary)' : done ? 'var(--success-text)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                            {stage}
                                        </span>
                                    </div>
                                    {idx < STAGES.length - 1 && (
                                        <div style={{ height: '2px', flex: 2, background: done ? 'var(--success-text)' : 'var(--border-color)', marginBottom: '1.2rem', transition: 'background 0.3s' }} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </Card>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: 'var(--space-6)', borderBottom: '2px solid var(--border-color)', paddingBottom: 0 }}>
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setTab(tab.key)}
                        style={{
                            padding: '0.6rem 1.5rem', border: 'none', background: 'transparent', cursor: 'pointer',
                            fontWeight: activeTab === tab.key ? 700 : 500,
                            color: activeTab === tab.key ? 'var(--brand-primary)' : 'var(--text-secondary)',
                            borderBottom: activeTab === tab.key ? '2px solid var(--brand-primary)' : '2px solid transparent',
                            marginBottom: '-2px', fontSize: '0.9rem', transition: 'all 0.15s',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="grid-2" style={{ gap: 'var(--space-6)' }}>
                    <Card>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Applicant Information</h2>
                        {[
                            ['Full Name', applicant.applicantName],
                            ['Application ID', applicant.id],
                            ['Program Applied', applicant.program],
                            ['Department', applicant.department],
                            ['Date Submitted', applicant.submittedDate],
                            ['Current Status', applicant.status],
                            ['GPA Score', applicant.gpa.toFixed(2)],
                        ].map(([label, value]) => (
                            <div key={label} className="data-row">
                                <span className="data-label">{label}</span>
                                <span className="data-value" style={{ textAlign: 'right' }}>{value}</span>
                            </div>
                        ))}
                    </Card>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Card>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requirements Status</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                                <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                                    <svg viewBox="0 0 36 36" style={{ width: '64px', height: '64px', transform: 'rotate(-90deg)' }}>
                                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border-color)" strokeWidth="3" />
                                        <circle cx="18" cy="18" r="15.9" fill="none" stroke={allDocsVerified ? 'var(--success-text)' : 'var(--brand-primary)'} strokeWidth="3"
                                            strokeDasharray={`${totalDocs > 0 ? (docsVerifiedCount / totalDocs) * 100 : 0} 100`} strokeLinecap="round" />
                                    </svg>
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                                        {docsVerifiedCount}/{totalDocs}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{docsVerifiedCount} of {totalDocs} documents verified</div>
                                    <Badge colorScheme={allDocsVerified ? 'success' : 'warning'}>{allDocsVerified ? 'Complete' : 'Pending Verification'}</Badge>
                                </div>
                            </div>
                            <Button variant="secondary" size="small" onClick={() => setTab('requirements')}>View Submitted Documents →</Button>
                        </Card>

                        <Card style={{ background: 'var(--bg-elevated)' }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Financial & Fee Status</h2>
                            <div className="data-row">
                                <span className="data-label">Application Fee</span>
                                <Badge colorScheme={applicant.applicationFeeStatus === 'Paid' ? 'success' : 'warning'}>
                                    {applicant.applicationFeeStatus}
                                </Badge>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>Fee verification is dynamically synced with the Finance Module.</p>
                        </Card>
                    </div>
                </div>
            )}

            {/* TAB 2: REQUIREMENTS */}
            {activeTab === 'requirements' && (
                <div className="grid-2" style={{ gap: 'var(--space-6)' }}>
                    <Card>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-6)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submitted Requirements</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {applicant.documents && applicant.documents.length > 0 ? (
                                applicant.documents.map((doc) => (
                                    <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <span style={{ fontSize: '1.1rem' }}>{doc.status === 'Verified' || doc.status === 'Uploaded' ? '✅' : '📄'}</span>
                                            <span style={{ fontWeight: 500 }}>{doc.name}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <Badge colorScheme={doc.status === 'Uploaded' || doc.status === 'Verified' ? 'success' : 'warning'}>
                                                {doc.status}
                                            </Badge>
                                            {(doc.status === 'Uploaded' || doc.status === 'Verified') && (
                                                <Button variant="secondary" size="small" onClick={() => setPreviewDoc({ isOpen: true, name: doc.name, filePath: doc.filePath ?? null })}>
                                                    Preview
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: 'var(--text-muted)' }}>No documents submitted for this application yet.</p>
                            )}
                        </div>
                        <div style={{ marginTop: 'var(--space-6)' }}>
                            <Button
                                variant="primary"
                                style={{ width: '100%' }}
                                onClick={() => verifyMutation.mutate()}
                                disabled={verifyMutation.isPending || !allDocsVerified}
                            >
                                {verifyMutation.isPending ? 'Verifying...' : 'Verify Documents & Forward Case'}
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Document Preview</h2>
                        <div style={{ minHeight: '280px', background: 'var(--bg-base)', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem' }}>📄</div>
                            <div style={{ fontWeight: 500 }}>Select a document to preview content</div>
                        </div>
                    </Card>
                </div>
            )}

            {/* TAB 3: EVALUATION */}
            {activeTab === 'evaluation' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <div className="grid-3" style={{ gap: 'var(--space-4)' }}>
                        <Card style={{ borderTop: `3px solid var(--success-text)` }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>🎓</div>
                            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Academic Profile</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
                                GPA: {applicant.gpa.toFixed(2)}
                            </div>
                            <Badge colorScheme="success">Verified</Badge>
                        </Card>

                        <Card style={{ borderTop: `3px solid ${applicant.interviewDate ? 'var(--success-text)' : 'var(--warning-text)'}` }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>🗣️</div>
                            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Faculty Interview</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
                                {applicant.interviewDate ? `${applicant.interviewDate} @ ${applicant.interviewTime}` : 'Pending Schedule'}
                            </div>
                            <Badge colorScheme={applicant.interviewDate ? 'success' : 'warning'}>
                                {applicant.interviewDate ? 'Scheduled' : 'Pending'}
                            </Badge>
                        </Card>

                        <Card style={{ borderTop: `3px solid ${applicant.applicationFeeStatus === 'Paid' ? 'var(--success-text)' : 'var(--warning-text)'}` }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>💳</div>
                            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Application Fee</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
                                Status: {applicant.applicationFeeStatus}
                            </div>
                            <Badge colorScheme={applicant.applicationFeeStatus === 'Paid' ? 'success' : 'warning'}>
                                {applicant.applicationFeeStatus}
                            </Badge>
                        </Card>
                    </div>

                    <Card>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Academic Reviewer Notes</h2>
                        <textarea
                            rows={4}
                            value={reviewNotes}
                            onChange={e => setReviewNotes(e.target.value)}
                            placeholder="Enter evaluation notes and academic observations..."
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical' }}
                        />
                    </Card>
                </div>
            )}

            {/* TAB 4: DECISION */}
            {activeTab === 'decision' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <Card>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-6)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admission Decision Prerequisites</h2>
                        {[
                            { label: 'Required documents uploaded and verified', done: allDocsVerified },
                            { label: 'Application fee payment confirmed', done: applicant.applicationFeeStatus === 'Paid' },
                            { label: 'Faculty interview scheduled/completed', done: Boolean(applicant.interviewDate) },
                            { label: 'Academic evaluation completed', done: applicant.status === 'UnderAcademicEvaluation' || applicant.status === 'Recommended' || applicant.status === 'Accepted' },
                        ].map((item, i) => (
                            <div key={i} className="data-row">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <span style={{ fontSize: '1rem' }}>{item.done ? '✅' : '⚠️'}</span>
                                    <span style={{ fontWeight: 500, color: item.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{item.label}</span>
                                </div>
                                <Badge colorScheme={item.done ? 'success' : 'warning'}>{item.done ? 'Complete' : 'Pending'}</Badge>
                            </div>
                        ))}
                    </Card>

                    {decisionMade || applicant.status === 'Accepted' || applicant.status === 'Enrolled' ? (
                        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎉</div>
                            <h2 style={{ marginBottom: 'var(--space-3)' }}>Decision Recorded: <strong>{decisionMade || applicant.status}</strong></h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-6)' }}>Prerequisites satisfied. Case ready for Registrar enrollment activation.</p>
                            <Button onClick={() => handoffMutation.mutate()} disabled={handoffMutation.isPending}>
                                {handoffMutation.isPending ? 'Transferring...' : '→ Transfer to Registrar'}
                            </Button>
                        </Card>
                    ) : (
                        <Card>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Record Admission Decision</h2>
                            <textarea
                                rows={3}
                                value={reviewNotes}
                                onChange={e => setReviewNotes(e.target.value)}
                                placeholder="Add decision justification or remarks..."
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'none', marginBottom: 'var(--space-4)' }}
                            />
                            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                                <Button variant="secondary" style={{ flex: 1, borderColor: 'var(--danger-text)', color: 'var(--danger-text)' }}
                                    onClick={() => decisionMutation.mutate('Reject')} disabled={decisionMutation.isPending}>
                                    Reject
                                </Button>
                                <Button variant="secondary" style={{ flex: 1 }}
                                    onClick={() => decisionMutation.mutate('Waitlist')} disabled={decisionMutation.isPending}>
                                    Waitlist
                                </Button>
                                <Button style={{ flex: 2, background: 'var(--success-text)', color: 'white', border: 'none' }}
                                    onClick={() => decisionMutation.mutate('Accept')} disabled={decisionMutation.isPending}>
                                    {decisionMutation.isPending ? 'Submitting...' : '✓ Approve Admission'}
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            )}

            <DocumentPreviewModal
                isOpen={previewDoc.isOpen}
                documentName={previewDoc.name}
                documentUrl={previewDoc.filePath ? `/api/v1/admissions/documents/${encodeURIComponent(previewDoc.filePath)}` : undefined}
                onClose={() => setPreviewDoc({ isOpen: false, name: '', filePath: null })}
            />
        </div>
    );
};
