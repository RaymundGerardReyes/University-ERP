import { useQuery } from '@tanstack/react-query';
import { admissionsApi, PendingApplicationDto } from '@university-erp/api-clients';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type FilterTab = 'all' | 'attention' | 'in-progress' | 'ready';

const STAGE_COLORS: Record<string, 'warning' | 'info' | 'success' | 'danger'> = {
  PendingIntake: 'warning',
  'Pending Intake': 'warning',
  SecretaryQueue: 'warning',
  DocumentVerification: 'info',
  ChairpersonQueue: 'info',
  ExamScheduled: 'info',
  DeanEndorsement: 'info',
  UnderReview: 'info',
  'Under Review': 'info',
  CommitteeDecision: 'warning',
  Accepted: 'success',
  Rejected: 'danger',
};

const STAGE_LABELS: Record<string, string> = {
  PendingIntake: 'Pending Intake',
  'Pending Intake': 'Pending Intake',
  SecretaryQueue: 'Awaiting Secretary',
  DocumentVerification: 'Verification',
  ChairpersonQueue: 'Chair Review',
  ExamScheduled: 'Exam Scheduled',
  UnderReview: 'Under Review',
  'Under Review': 'Under Review',
  CommitteeDecision: 'Ready for Decision',
  Accepted: 'Accepted',
  Rejected: 'Rejected',
};

export const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');

  const { data: applications = [], isLoading, error } = useQuery<PendingApplicationDto[]>({
    queryKey: ['allApplications'],
    queryFn: () => admissionsApi.getPendingApplications(),
    refetchInterval: 30000,
  });

  const filtered = useMemo(() => {
    let list = applications as any[];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a: any) =>
          (a.applicantName || a.name)?.toLowerCase().includes(q) ||
          a.id?.toLowerCase().includes(q) ||
          a.program?.toLowerCase().includes(q)
      );
    }

    if (activeTab === 'attention') {
      list = list.filter((a: any) => {
        const stage = a.stage || a.status;
        return stage === 'PendingIntake' || stage === 'Pending Intake' || stage === 'SecretaryQueue' || a.missingDocs;
      });
    } else if (activeTab === 'in-progress') {
      list = list.filter((a: any) => {
        const stage = a.stage || a.status;
        return ['DocumentVerification', 'ChairpersonQueue', 'ExamScheduled', 'UnderReview', 'Under Review', 'DeanEndorsement'].includes(stage);
      });
    } else if (activeTab === 'ready') {
      list = list.filter((a: any) => {
        const stage = a.stage || a.status;
        return stage === 'CommitteeDecision' || stage === 'Accepted';
      });
    }

    return list;
  }, [applications, activeTab, search]);

  const counts = useMemo(
    () => ({
      all: (applications as any[]).length,
      attention: (applications as any[]).filter((a: any) => {
        const stage = a.stage || a.status;
        return stage === 'PendingIntake' || stage === 'Pending Intake' || stage === 'SecretaryQueue' || a.missingDocs;
      }).length,
      inProgress: (applications as any[]).filter((a: any) => {
        const stage = a.stage || a.status;
        return ['DocumentVerification', 'ChairpersonQueue', 'ExamScheduled', 'UnderReview', 'Under Review', 'DeanEndorsement'].includes(stage);
      }).length,
      ready: (applications as any[]).filter((a: any) => {
        const stage = a.stage || a.status;
        return stage === 'CommitteeDecision' || stage === 'Accepted';
      }).length,
    }),
    [applications]
  );

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All Applications', count: counts.all },
    { key: 'attention', label: 'Needs Attention', count: counts.attention },
    { key: 'in-progress', label: 'In Progress', count: counts.inProgress },
    { key: 'ready', label: 'Ready for Decision', count: counts.ready },
  ];

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
        <PageHeader
          title="Applications"
          subtitle="Review, process, and track all applicant cases through the admissions pipeline."
        />
        <Button onClick={() => navigate('/applications/new')}>+ New Application</Button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: 'var(--space-6)', borderBottom: '2px solid var(--border-color)', paddingBottom: 0 }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.6rem 1.25rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: activeTab === tab.key ? 700 : 500,
              color: activeTab === tab.key ? 'var(--brand-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.key ? '2px solid var(--brand-primary)' : '2px solid transparent',
              marginBottom: '-2px',
              fontSize: '0.9rem',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {tab.label}
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.1rem 0.5rem',
                borderRadius: '999px',
                background: activeTab === tab.key ? 'var(--brand-primary)' : 'var(--bg-elevated)',
                color: activeTab === tab.key ? 'white' : 'var(--text-muted)',
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <Card style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)' }}>
        <input
          type="text"
          placeholder="Search by applicant name, ID, or program..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '0.95rem',
            color: 'var(--text-primary)',
          }}
        />
      </Card>

      {/* Applications Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-elevated)' }}>
              <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Applicant
              </th>
              <th style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Program
              </th>
              <th style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Submitted
              </th>
              <th style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Stage
              </th>
              <th style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading applications...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--danger-text)' }}>
                  Could not load applications from the backend.
                </td>
              </tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📭</div>
                  No applications match this filter.
                </td>
              </tr>
            )}
            {filtered.map((app: any, idx: number) => {
              const displayName = app.applicantName || app.name || 'Applicant';
              const stageKey = app.stage || app.status || 'PendingIntake';
              const submittedDate = app.submittedDate || app.submittedAt;

              return (
                <tr
                  key={app.id || idx}
                  style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'background 0.1s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => navigate(`/applications/${app.id}`)}
                >
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'var(--brand-gradient-soft)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: 'var(--brand-primary)',
                          flexShrink: 0,
                        }}
                      >
                        {displayName.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.1rem' }}>
                          {displayName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {app.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {app.program || app.department || 'Undergraduate'}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {submittedDate ? new Date(submittedDate).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Badge colorScheme={STAGE_COLORS[stageKey] || 'info'}>
                      {STAGE_LABELS[stageKey] || stageKey}
                    </Badge>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/applications/${app.id}`);
                      }}
                    >
                      Open Case →
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
