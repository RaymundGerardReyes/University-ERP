import React, { useState } from 'react';
import { useAuth } from '@university-erp/auth-sdk';
import { Badge, Button, Card, PageHeader, EmptyState } from '@university-erp/ui-kit';
import { useOfferDetails, useRespondOffer } from './Offers.hooks';

export const OffersPage: React.FC = () => {
  const { user, identity } = useAuth();
  const studentId = user?.id || identity?.id;

  const { data: journey, isLoading, isError } = useOfferDetails(studentId);
  const respondMutation = useRespondOffer(studentId);
  const [decision, setDecision] = useState<'Accepted' | 'Declined' | null>(null);

  if (isLoading) return <div className="skeleton" style={{ height: '400px' }} />;

  if (!studentId) {
    return (
      <div className="fade-in">
        <PageHeader
          title="Admission Offers & Decision"
          subtitle="Review official admission offers and merit scholarship notifications."
        />
        <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
          <EmptyState
            title="Authentication Required"
            description="Please log in to view your admission offers and decisions."
          />
        </Card>
      </div>
    );
  }

  if (isError || !journey || !journey.applicantId) {
    return (
      <div className="stub-page fade-in">
        <div className="stub-title">No Active Application</div>
        <div className="stub-subtitle">We could not find an active application record for your account.</div>
      </div>
    );
  }

  const isOfferReady = journey.currentStage >= 3;
  const primaryProgram = journey.programs?.[0];

  const handleDecision = (choice: 'Accepted' | 'Declined') => {
    setDecision(choice);
    respondMutation.mutate({
      applicationId: journey.applicantId,
      decision: choice,
    });
  };

  return (
    <div className="fade-in">
      <PageHeader
        title="Admission Offers & Decision"
        subtitle="Review official admission offers and merit scholarship notifications."
      />

      <div className="content-container fade-in-delay-1" style={{ maxWidth: '800px' }}>
        <Card>
          <div className="card-accent-top" style={{ background: 'var(--brand-gradient)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--text-bright)', margin: 0 }}>
                {primaryProgram ? `${primaryProgram.degree} in ${primaryProgram.major}` : 'Undergraduate Degree Program'}
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {primaryProgram ? `${primaryProgram.college} • ${primaryProgram.duration} • Intake: ${primaryProgram.intake}` : 'Application Case: ' + journey.applicantId}
              </span>
            </div>
            <Badge colorScheme={decision === 'Accepted' || isOfferReady ? 'success' : decision === 'Declined' ? 'danger' : 'info'}>
              {decision ? `Offer ${decision}` : isOfferReady ? 'Official Offer Released' : `Stage ${journey.currentStage}: Under Review`}
            </Badge>
          </div>

          <div style={{ padding: 'var(--space-4)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 'var(--space-6)' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: 'var(--space-2)' }}>
              🎓 Admission Assessment & Status
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {isOfferReady
                ? `Congratulations, ${journey.applicantName}! Your academic qualifications and documents have been verified. You are invited to accept your seat.`
                : `Your application is currently at Stage ${journey.currentStage} of 4. Decisions will be published here upon completion of faculty review.`}
            </p>
          </div>

          {isOfferReady && !decision && (
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => handleDecision('Declined')}>
                Decline Offer
              </Button>
              <Button variant="primary" onClick={() => handleDecision('Accepted')}>
                Accept Offer & Reserve Seat
              </Button>
            </div>
          )}

          {decision && (
            <div style={{ padding: 'var(--space-4)', background: 'var(--bg-base)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <span style={{ fontWeight: 600, color: decision === 'Accepted' ? 'var(--success-text)' : 'var(--danger-text)' }}>
                Response Recorded: Offer {decision}
              </span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
