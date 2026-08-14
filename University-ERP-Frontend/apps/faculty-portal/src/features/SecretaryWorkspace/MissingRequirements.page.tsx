import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import { createLogger } from '@university-erp/core-logger';

const logger = createLogger('faculty-portal', 'MissingRequirements');

// Simulated DTO for Missing Requirements Queue
interface MissingRequirementDto {
  id: string;
  applicantName: string;
  program: string;
  missingDocuments: string[];
  lastRemindedDate: string | null;
  status: 'Incomplete' | 'Followed Up';
}

export const MissingRequirementsPage: React.FC = () => {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // Fetch the queue of applicants with missing documents
  const { data: queue = [], isLoading } = useQuery<MissingRequirementDto[]>({
    queryKey: ['admissions', 'missingRequirementsQueue'],
    queryFn: async () => {
      // Future API hookup: return await admissionsApi.getMissingRequirementsQueue();
      return [];
    },
    initialData: [
      { 
        id: 'APP-2026-112', 
        applicantName: 'Jordan Lee', 
        program: 'BS Computer Science', 
        missingDocuments: ['Official High School Transcript', 'Certificate of Good Moral Character'], 
        lastRemindedDate: null, 
        status: 'Incomplete' 
      },
      { 
        id: 'APP-2026-145', 
        applicantName: 'Casey Smith', 
        program: 'BS Information Systems', 
        missingDocuments: ['Birth Certificate (PSA)'], 
        lastRemindedDate: '2026-08-10', 
        status: 'Followed Up' 
      }
    ]
  });

  // Mutation to send a reminder email to the applicant
  const sendReminderMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      // Future API hookup: await communicationApi.sendDocumentReminder(applicationId);
      return new Promise(resolve => setTimeout(resolve, 800));
    },
    onSuccess: (_, applicationId) => {
      logger.info(`Successfully sent missing document reminder to applicant ${applicationId}`);
      alert('Reminder email successfully dispatched to the applicant.');
    },
    onError: (err) => {
      logger.error('Failed to send reminder email', err);
      alert('An error occurred while sending the reminder.');
    }
  });

  const selectedApp = queue.find((app) => app.id === selectedAppId);

  if (isLoading) return <div className="skeleton" style={{ height: '600px' }} />;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader 
        title="Missing Requirements" 
        subtitle="Track incomplete applications and dispatch automated follow-up reminders." 
      />

      {/* MASTER-DETAIL LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
        
        {/* LEFT PANE: Applicant Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Incomplete Applications</h3>
          {queue.map((app) => (
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
                {app.status === 'Followed Up' && <Badge colorScheme="info">Contacted</Badge>}
                {app.status === 'Incomplete' && <Badge colorScheme="warning">Pending</Badge>}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                {app.program}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--danger-text)', marginTop: 'var(--space-2)' }}>
                {app.missingDocuments.length} missing document(s)
              </div>
            </Card>
          ))}
          {queue.length === 0 && (
            <div className="text-muted" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
              All current applications are complete.
            </div>
          )}
        </div>

        {/* RIGHT PANE: Follow-Up Workspace */}
        <Card style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
          {!selectedApp ? (
            <div className="stub-page">
              <div style={{ fontSize: '3rem', opacity: 0.5, marginBottom: 'var(--space-4)' }}>🗂️</div>
              <div className="stub-title">Select an Application</div>
              <div className="stub-subtitle">Choose an applicant from the queue to view their missing items and send a reminder.</div>
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
                      Application ID: <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{selectedApp.id}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Missing Documents Checklist */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>
                  Pending Documents
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                  {selectedApp.missingDocuments.map((doc, index) => (
                    <div key={index} style={{ padding: 'var(--space-3)', background: 'var(--bg-elevated)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <span style={{ color: 'var(--danger-text)', fontSize: '1.2rem' }}>⚠</span>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{doc}</span>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <strong>Last Follow-up:</strong> {selectedApp.lastRemindedDate ? new Date(selectedApp.lastRemindedDate).toLocaleDateString() : 'Never'}
                </div>
              </div>

              {/* Action Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                <Button 
                  variant="primary" 
                  onClick={() => sendReminderMutation.mutate(selectedApp.id)}
                  disabled={sendReminderMutation.isPending}
                >
                  {sendReminderMutation.isPending ? 'Sending...' : '✉ Send Automated Reminder'}
                </Button>
              </div>

            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
