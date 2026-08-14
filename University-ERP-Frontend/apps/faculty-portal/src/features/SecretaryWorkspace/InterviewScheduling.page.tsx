import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLogger } from '@university-erp/core-logger';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import { AdmissionWorkflow } from '@university-erp/workflow-sdk';
import React, { useState } from 'react';

const logger = createLogger('faculty-portal', 'InterviewScheduling');

export const InterviewSchedulingPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Workspace State
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [interviewResult, setInterviewResult] = useState<'Passed' | 'Failed' | 'Pending'>('Pending');
  const [remarks, setRemarks] = useState('');

  // Fetch the Secretary's Interview Queue
  const { data: queue = [], isLoading } = useQuery({
    queryKey: ['admissions', 'interviewQueue'],
    queryFn: async () => {
      // Stubbed data for UI Blueprint. This will map to admissionsApi.getApplicationsByStage('InterviewQueue')
      return [
        { id: 'APP-2026-905', applicantName: 'David Chen', program: 'BS Computer Science', interviewDate: '2026-08-14', interviewTime: '10:00 AM' },
        { id: 'APP-2026-906', applicantName: 'Sarah Jenkins', program: 'BS Information Technology', interviewDate: '2026-08-14', interviewTime: '01:30 PM' },
        { id: 'APP-2026-908', applicantName: 'Michael Torres', program: 'BS Information Systems', interviewDate: '2026-08-15', interviewTime: '09:00 AM' }
      ];
    }
  });

  // Workflow Mutation (Advances to Chairperson)
  const submitResultMutation = useMutation({
    mutationFn: (id: string) => AdmissionWorkflow.advance(id, 'InterviewCompletion', `Result: ${interviewResult}. Remarks: ${remarks}`),
    onSuccess: (_, id) => {
      logger.info(`Successfully logged interview result for ${id}`);
      queryClient.invalidateQueries({ queryKey: ['admissions', 'interviewQueue'] });
      setSelectedAppId(null);
      setRemarks('');
      setInterviewResult('Pending');
    },
    onError: (err) => {
      logger.error('Failed to submit interview result', err);
      alert('An error occurred while forwarding the application.');
    }
  });

  const selectedApp = queue.find((app: any) => app.id === selectedAppId);

  if (isLoading) return <div className="skeleton" style={{ height: '600px' }} />;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader
        title="Interview Scheduling & Results"
        subtitle="Manage faculty interview schedules and log final applicant evaluations."
      />

      {/* MASTER-DETAIL LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>

        {/* LEFT PANE: Interview Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Scheduled Interviews</h3>
          {queue.map((app: any) => (
            <Card
              key={app.id}
              onClick={() => {
                setSelectedAppId(app.id);
                setInterviewResult('Pending');
                setRemarks('');
              }}
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
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.interviewDate}</span>
                <Badge colorScheme="info" style={{ fontSize: '0.65rem' }}>{app.interviewTime}</Badge>
              </div>
            </Card>
          ))}
          {queue.length === 0 && (
            <div className="text-muted" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
              No interviews scheduled.
            </div>
          )}
        </div>

        {/* RIGHT PANE: Result Logging Workspace */}
        <Card style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
          {!selectedApp ? (
            <div className="stub-page">
              <div style={{ fontSize: '3rem', opacity: 0.5, marginBottom: 'var(--space-4)' }}>🎤</div>
              <div className="stub-title">Select an Interview</div>
              <div className="stub-subtitle">Choose an applicant from the queue to log their interview performance.</div>
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
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                      {selectedApp.id}
                    </div>
                  </div>
                  <Badge colorScheme="warning">Awaiting Results</Badge>
                </div>
              </div>

              {/* Data Entry Form */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
                  Log Evaluation Result
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                  <Button
                    variant={interviewResult === 'Passed' ? 'primary' : 'outline'}
                    onClick={() => setInterviewResult('Passed')}
                    style={{ borderColor: interviewResult === 'Passed' ? 'transparent' : 'var(--success-border)', color: interviewResult === 'Passed' ? 'white' : 'var(--success-text)' }}
                  >
                    ✓ Passed Interview
                  </Button>
                  <Button
                    variant={interviewResult === 'Failed' ? 'primary' : 'outline'}
                    onClick={() => setInterviewResult('Failed')}
                    style={{ borderColor: interviewResult === 'Failed' ? 'transparent' : 'var(--danger-border)', color: interviewResult === 'Failed' ? 'white' : 'var(--danger-text)' }}
                  >
                    ✕ Failed Interview
                  </Button>
                </div>

                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
                    Interviewer Remarks
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter detailed feedback from the faculty interviewer..."
                    style={{
                      width: '100%', minHeight: '120px', padding: '1rem', borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)', background: 'var(--bg-base)',
                      color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* Action Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                <Button
                  variant="primary"
                  onClick={() => submitResultMutation.mutate(selectedApp.id)}
                  disabled={submitResultMutation.isPending || interviewResult === 'Pending'}
                >
                  {submitResultMutation.isPending ? 'Processing...' : 'Log Result & Forward to Chair'}
                </Button>
              </div>

            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
