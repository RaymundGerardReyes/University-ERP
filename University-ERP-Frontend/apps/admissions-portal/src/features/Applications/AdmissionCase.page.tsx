import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

type CaseTab = 'overview' | 'requirements' | 'evaluation' | 'decision';

const STAGES = ['Submitted', 'Verification', 'Evaluation', 'Decision', 'Enrolled'];
const STAGE_INDEX: Record<string, number> = {
    'PendingIntake': 0, 'SecretaryQueue': 0,
    'DocumentVerification': 1, 'ChairpersonQueue': 1,
    'ExamScheduled': 2, 'UnderReview': 2, 'DeanEndorsement': 2,
    'CommitteeDecision': 3,
    'Accepted': 4, 'Enrolled': 4,
};

const TABS: { key: CaseTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'requirements', label: 'Requirements' },
    { key: 'evaluation', label: 'Evaluation' },
    { key: 'decision', label: 'Decision' },
];

const MOCK_DOCS = [
    { name: 'Birth Certificate (PSA)', verified: true },
    { name: 'Form 137 / Transcript', verified: true },
    { name: 'Good Moral Certificate', verified: false },
    { name: 'Application Form', verified: true },
    { name: 'Medical Certificate', verified: false },
];

export const AdmissionCasePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const activeTab = (searchParams.get('tab') as CaseTab) || 'overview';

    const [reviewNotes, setReviewNotes] = useState('');
    const [decisionMade, setDecisionMade] = useState<string | null>(null);

    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['allApplications'],
        queryFn: () => admissionsApi.getPendingApplications(),
    });

    const applicant = (applications as any[]).find((a: any) => a.id === id) || (applications as any[])[0];

    const verifyMutation = useMutation({
        mutationFn: () => admissionsApi.verifyDocumentsAndForward(id!),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['allApplications'] }); alert('Documents verified. Application advanced.'); },
    });

    const decisionMutation = useMutation({
        mutationFn: (decision: 'Accept' | 'Reject' | 'Waitlist') =>
            admissionsApi.submitAcademicEvaluation(id!, decision, reviewNotes),
        onSuccess: (_, decision) => {
            setDecisionMade(decision);
            queryClient.invalidateQueries({ queryKey: ['allApplications'] });
        },
    });

    const handoffMutation = useMutation({
        mutationFn: () => admissionsApi.generateStudentIdentityAndEnroll(id!),
        onSuccess: () => { alert('Case transferred to Registrar. Student ID will be generated.'); navigate('/applications'); },
    });

    const setTab = (tab: CaseTab) => setSearchParams({ tab });
    const stageIdx = STAGE_INDEX[applicant?.stage] ?? 0;
    const docsVerified = MOCK_DOCS.filter(d => d.verified).length;
    const allDocsVerified = docsVerified === MOCK_DOCS.length;

    return (
        <div className="fade-in">
            {/* Back breadcrumb */}
            <div style={{ marginBottom: 'var(--space-4)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <Link to="/applications" style={{ color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 500 }}>
                    ← Applications
                </Link>
                <span style={{ margin: '0 0.5rem' }}>›</span>
                <span>{isLoading ? '...' : (applicant?.name || id)}</span>
            </div>

            {/* Case Header Card */}
            <Card style={{ marginBottom: 'var(--space-6)', padding: 0, overflow: 'hidden' }}>
                <div style={{ height: '4px', background: 'var(--brand-gradient)' }} />
                <div style={{ padding: 'var(--space-6)' }}>
                    {isLoading ? (
                        <div style={{ color: 'var(--text-muted)' }}>Loading case...</div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
                                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--brand-gradient-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                                        {applicant?.name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>{applicant?.name || 'Unknown Applicant'}</h1>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{applicant?.program || 'N/A'}</div>
                                        <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>{applicant?.id || id}</code>
                                    </div>
                                </div>
                                <Badge colorScheme={applicant?.stage === 'Accepted' ? 'success' : applicant?.stage === 'Rejected' ? 'danger' : 'info'}>
                                    {applicant?.stage || 'Pending'}
                                </Badge>
                            </div>

                            {/* Stage Timeline */}
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
                        </>
                    )}
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

            {/* TAB: Overview */}
            {activeTab === 'overview' && (
                <div className="grid-2" style={{ gap: 'var(--space-6)' }}>
                    <Card>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Applicant Information</h2>
                        {[
                            ['Full Name', applicant?.name || '—'],
                            ['Application ID', applicant?.id || id],
                            ['Program Applied', applicant?.program || applicant?.department || '—'],
                            ['Date Submitted', new Date(applicant?.submittedAt || Date.now()).toLocaleDateString()],
                            ['Current Stage', applicant?.stage || 'Pending Intake'],
                            ['Assigned Officer', 'Admissions Staff'],
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
                                            strokeDasharray={`${(docsVerified / MOCK_DOCS.length) * 100} 100`} strokeLinecap="round" />
                                    </svg>
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>{docsVerified}/{MOCK_DOCS.length}</div>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{docsVerified} of {MOCK_DOCS.length} verified</div>
                                    <Badge colorScheme={allDocsVerified ? 'success' : 'warning'}>{allDocsVerified ? 'Complete' : 'Incomplete'}</Badge>
                                </div>
                            </div>
                            <Button variant="secondary" size="small" onClick={() => setTab('requirements')}>View Requirements →</Button>
                        </Card>

                        <Card style={{ background: 'var(--bg-elevated)' }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Financial Status</h2>
                            <div className="data-row">
                                <span className="data-label">Application Fee</span>
                                <Badge colorScheme="warning">Awaiting Payment</Badge>
                            </div>
                            <div className="data-row">
                                <span className="data-label">Exam Fee</span>
                                <Badge colorScheme="success">Paid</Badge>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>Payment processing is managed by the Finance Console.</p>
                        </Card>
                    </div>
                </div>
            )}

            {/* TAB: Requirements */}
            {activeTab === 'requirements' && (
                <div className="grid-2" style={{ gap: 'var(--space-6)' }}>
                    <Card>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-6)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Required Documents</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {MOCK_DOCS.map((doc, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: `1px solid ${doc.verified ? 'var(--success-text)' : 'var(--border-color)'}` }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <span style={{ fontSize: '1.1rem' }}>{doc.verified ? '✅' : '📄'}</span>
                                        <span style={{ fontWeight: 500, color: doc.verified ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{doc.name}</span>
                                    </div>
                                    <Badge colorScheme={doc.verified ? 'success' : 'warning'}>{doc.verified ? 'Verified' : 'Pending'}</Badge>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-3)' }}>
                            <Button variant="secondary" style={{ flex: 1 }} onClick={() => alert('Resubmission request sent to applicant.')}>Request Resubmission</Button>
                            <Button style={{ flex: 1 }} onClick={() => verifyMutation.mutate()} disabled={verifyMutation.isPending}>
                                {verifyMutation.isPending ? 'Processing...' : 'Verify & Advance'}
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Document Viewer</h2>
                        <div style={{ minHeight: '280px', background: 'var(--bg-base)', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem' }}>📄</div>
                            <div style={{ fontWeight: 500 }}>Official_Transcript.pdf</div>
                            <Button variant="secondary" size="small">Open Document</Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* TAB: Evaluation */}
            {activeTab === 'evaluation' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <div className="grid-3" style={{ gap: 'var(--space-4)' }}>
                        {[
                            { label: 'Academic Profile', status: 'Complete', detail: 'GPA 3.92 · Top 5%', icon: '🎓' },
                            { label: 'Entrance Exam', status: 'Complete', detail: 'Score: 87% · Passed', icon: '📝' },
                            { label: 'Interview', status: 'Pending', detail: 'Not yet scheduled', icon: '🗣️' },
                        ].map(item => (
                            <Card key={item.label} style={{ borderTop: `3px solid ${item.status === 'Complete' ? 'var(--success-text)' : 'var(--warning-text)'}` }}>
                                <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>{item.icon}</div>
                                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{item.label}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>{item.detail}</div>
                                <Badge colorScheme={item.status === 'Complete' ? 'success' : 'warning'}>{item.status}</Badge>
                            </Card>
                        ))}
                    </div>

                    <Card>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-4)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Academic Review & Scoring</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                            {[
                                { label: 'Academic Rigor', value: 8 },
                                { label: 'Extracurricular Impact', value: 6 },
                                { label: 'Personal Essay Quality', value: 7 },
                            ].map(item => (
                                <div key={item.label}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                        <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.label}</label>
                                        <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>{item.value} / 10</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'var(--bg-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${item.value * 10}%`, height: '100%', background: 'var(--brand-primary)', borderRadius: '4px', transition: 'width 0.3s' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <label style={{ fontWeight: 600, fontSize: '0.875rem', display: 'block', marginBottom: '0.5rem' }}>Reviewer Notes</label>
                        <textarea
                            rows={4}
                            value={reviewNotes}
                            onChange={e => setReviewNotes(e.target.value)}
                            placeholder="Enter assessment notes..."
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical' }}
                        />
                    </Card>
                </div>
            )}

            {/* TAB: Decision */}
            {activeTab === 'decision' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <Card>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-6)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admission Decision Checklist</h2>
                        {[
                            { label: 'Requirements verified', done: allDocsVerified },
                            { label: 'Entrance examination completed', done: true },
                            { label: 'Interview conducted', done: false },
                            { label: 'Academic review submitted', done: true },
                            { label: 'Application fee confirmed', done: false },
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

                    {decisionMade ? (
                        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>{decisionMade === 'Accept' ? '🎉' : decisionMade === 'Reject' ? '❌' : '⏳'}</div>
                            <h2 style={{ marginBottom: 'var(--space-3)' }}>Decision Recorded: <strong>{decisionMade}</strong></h2>
                            {decisionMade === 'Accept' && (
                                <>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-6)' }}>All prerequisites satisfied. You may now transfer this case to the Registrar.</p>
                                    <Button onClick={() => handoffMutation.mutate()} disabled={handoffMutation.isPending}>
                                        {handoffMutation.isPending ? 'Transferring...' : '→ Transfer to Registrar'}
                                    </Button>
                                </>
                            )}
                        </Card>
                    ) : (
                        <Card>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Final Decision</h2>
                            <textarea
                                rows={3}
                                value={reviewNotes}
                                onChange={e => setReviewNotes(e.target.value)}
                                placeholder="Add decision remarks (optional)..."
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
                                    {decisionMutation.isPending ? 'Submitting...' : '✓ Approve'}
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};
