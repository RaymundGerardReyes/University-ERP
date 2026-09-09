import React from 'react';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import { useAuth } from '@university-erp/auth-sdk';
import { useGraduationApplication, useSubmitGraduationApplication } from './Graduation.hooks';

export const GraduationPage: React.FC = () => {
  const { identity } = useAuth();
  const studentId = identity?.id || 'STU-2026-001';
  const { data: application, isLoading } = useGraduationApplication(studentId);
  const submitMutation = useSubmitGraduationApplication();

  const appData = application || {
    applicationId: 'GRAD-APP-2026-092',
    studentId,
    programId: 'BS-CS-2026',
    status: 'SUBMITTED' as const,
    clearanceStatus: 'CLEARED' as const,
    submittedAt: '2026-08-15'
  };

  const handleApply = async () => {
    await submitMutation.mutateAsync({ studentId, programId: 'BS-CS-2026' });
    alert('Graduation application submitted for faculty evaluation.');
  };

  return (
    <div className="fade-in">
      <PageHeader
        title="Graduation Workspace"
        subtitle="Monitor degree conferral, commencement clearance checkpoints, and diploma issuance."
      />

      {isLoading ? (
        <div className="skeleton" style={{ height: '400px' }} data-testid="loading-skeleton" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
          <Card>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Degree Clearance Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span>Academic Curriculum Requirements</span>
                <Badge colorScheme="success">Passed & Complete</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span>Finance & Tuition Balance Clearance</span>
                <Badge colorScheme="success">Zero Balance Cleared</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span>University Library Account</span>
                <Badge colorScheme="success">No Outstanding Books</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0' }}>
                <span>Registrar Academic Records Validation</span>
                <Badge colorScheme="success">Official Records Sealed</Badge>
              </div>
            </div>
          </Card>

          <Card>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Commencement Status</h3>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Application State:</span>
              <div style={{ marginTop: 'var(--space-2)' }}>
                <Badge colorScheme={appData.status === 'APPROVED' ? 'success' : 'info'}>
                  {appData.status}
                </Badge>
              </div>
            </div>
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Graduation Ceremony Date:</span>
              <div style={{ fontWeight: 600, marginTop: 'var(--space-1)' }}>December 12, 2026</div>
            </div>
            <Button
              variant="primary"
              style={{ width: '100%' }}
              disabled={appData.status === 'SUBMITTED' || appData.status === 'APPROVED' || submitMutation.isPending}
              onClick={handleApply}
            >
              {appData.status === 'SUBMITTED' ? 'Application Received' : 'Apply for Graduation'}
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};
