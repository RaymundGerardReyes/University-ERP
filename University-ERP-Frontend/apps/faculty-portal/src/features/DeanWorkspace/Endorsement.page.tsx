import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLogger } from '@university-erp/core-logger';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import { AdmissionWorkflow } from '@university-erp/workflow-sdk';
import React, { useState } from 'react';

const logger = createLogger('faculty-portal', 'DeanEndorsement');

export const EndorsementPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Workspace State
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // Fetch the Dean's Recommendation Queue
  const { data: queue = [], isLoading } = useQuery({
    queryKey: ['admissions', 'deanRecommendationQueue'],
    queryFn: async () => {
      // Stubbed data for UI Blueprint. Maps to admissionsApi.getApplicationsByStage('RegistrarQueue')
      return [
        {
          id: 'APP-2026-042',
          applicantName: 'Elena Rodriguez',
          program: 'BS Computer Science',
          chairScore: '94/100',
          chairRemarks: 'Highly recommended. Strong analytical background and excellent interview performance.',
          status: 'Recommended'
        },
        {
          id: 'APP-2026-088',
          applicantName: 'Marcus Johnson',
          program: 'BS Information Systems',
          chairScore: '88/100',
          chairRemarks: 'Good fit for the program. Prerequisites fully satisfied.',
          status: 'Recommended'
        }
      ];
    }
  });

  // Workflow Mutation (Advances to the University Registrar)
  const endorseMutation = useMutation({
    mutationFn: (id: string) => AdmissionWorkflow.advance(id, 'DeanEndorsement'),
    onSuccess: (_, id) => {
      logger.info(`Dean officially endorsed application ${id} to the Registrar`);
      queryClient.invalidateQueries({ queryKey: ['admissions', 'deanRecommendationQueue'] });
      setSelectedAppId(null);
    },
    onError: (err) => {
      logger.error('Failed to endorse application', err);
      alert('An error occurred during the endorsement process.');
    }
  });

  const selectedApp = queue.find((app: any) => app.id === selectedAppId);

  if (isLoading) return <div className="skeleton" style={{ height: '600px' }} />;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader
        title="College Endorsement"
        subtitle="Review Chairperson recommendations and grant final college approval."
      />

      {/* MASTER-DETAIL LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>

        {/* LEFT PANE: Recommendation Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Awaiting Endorsement</h3>
          {queue.map((app: any) => (
            <Card
              key={app.id}
              onClick={() => setSelectedAppId(app.id)}
              style={{
                cursor: 'pointer',
                borderColor: selectedAppId === app.id ? 'var(--brand-primary)' : 'var(--border-color)',
                background: selectedAppId === app.id ? 'var(--bg-active)' : 'var(--bg-surface)',
                transition: 'all 0.2s ease',
                padding: 'var(--space-4)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{app.applicantName}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                {app.program}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{app.id}</span>
                <Badge colorScheme="success" style={{ fontSize: '0.65rem' }}>{app.status}</Badge>
              </div>
            </Card>
          ))}
          {queue.length === 0 && (
            <div className="text-muted" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
              No pending endorsements.
            </div>
          )}
        </div>

        {/* RIGHT PANE: Endorsement Dossier */}
        <Card style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
          {!selectedApp ? (
            <div className="stub-page">
              <div style={{ fontSize: '3rem', opacity: 0.5, marginBottom: 'var(--space-4)' }}>🎓</div>
              <div className="stub-title">Select a Candidate</div>
              <div className="stub-subtitle">Choose an applicant from the queue to finalize their college endorsement.</div>
            </div>
          ) : (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

              {/* Header */}
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-bright)' }}>
                      {selectedApp.applicantName}
                    </h2>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Applying for: <strong style={{ color: 'var(--text-primary)' }}>{selectedApp.program}</strong>
                    </div>
                  </div>
                  <Badge colorScheme="info">Ready for Registrar</Badge>
                </div>
              </div>

              {/* Review Summary */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
                  Chairperson's Evaluation
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                  <Card style={{ padding: 'var(--space-4)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>Academic Score</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--brand-primary)' }}>{selectedApp.chairScore}</div>
                  </Card>
                  <Card style={{ padding: 'var(--space-4)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>Document Check</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--success-text)' }}>✓ Verified by Secretary</div>
                  </Card>
                </div>

                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                    Official Remarks
                  </label>
                  <div style={{
                    width: '100%', minHeight: '80px', padding: '1rem', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)', background: 'var(--bg-base)',
                    color: 'var(--text-primary)', fontStyle: 'italic'
                  }}
                  >
                    "{selectedApp.chairRemarks}"
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                <Button
                  variant="success"
                  onClick={() => endorseMutation.mutate(selectedApp.id)}
                  disabled={endorseMutation.isPending}
                >
                  {endorseMutation.isPending ? 'Endorsing...' : 'Officially Endorse to Registrar'}
                </Button>
              </div>

            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
