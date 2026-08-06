import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';

export const OffersPage: React.FC = () => {
  const [decision, setDecision] = useState<'Accepted' | 'Declined' | null>(null);

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
                Bachelor of Science in Computer Science
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Academic Year 2026-2027 • Fall Intake</span>
            </div>
            <Badge colorScheme={decision === 'Accepted' ? 'success' : decision === 'Declined' ? 'danger' : 'info'}>
              {decision ? `Offer ${decision}` : 'Official Offer Released'}
            </Badge>
          </div>

          <div style={{ padding: 'var(--space-4)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: 'var(--space-6)' }}>
            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: 0, marginBottom: 'var(--space-2)' }}>
              🎓 Merit Scholarship Awarded
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Congratulations! You have been granted a 50% Tuition Waiver based on outstanding academic achievement.
            </p>
          </div>

          {!decision ? (
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setDecision('Declined')}>Decline Offer</Button>
              <Button variant="primary" onClick={() => setDecision('Accepted')}>Accept Offer & Reserve Seat</Button>
            </div>
          ) : (
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
