import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useApplicantJourney } from '../ApplicantJourney.hooks';

export const ProgramExplorerPage: React.FC = () => {
  const { data, isLoading } = useApplicantJourney();

  if (isLoading) return <div style={{ color: 'var(--text-secondary)' }}>Loading program catalog...</div>;
  if (!data) return null;

  return (
    <div className="fade-in">
      <PageHeader title="Program Explorer" subtitle="Discover your future degree path." />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {data.programs.map(prog => (
          <Card key={prog.id} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>{prog.college}</div>
            <h3 style={{ margin: '0 0 var(--space-1) 0', color: 'var(--text-primary)' }}>{prog.degree} in {prog.major}</h3>
            
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', margin: 'var(--space-3) 0' }}>
              {prog.tags.map(tag => <Badge key={tag} colorScheme="info">{tag}</Badge>)}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'auto', marginBottom: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Duration:</span>
                <strong style={{ color: 'var(--text-secondary)' }}>{prog.duration}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Intake:</span>
                <strong style={{ color: 'var(--text-secondary)' }}>{prog.intake}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Est. Tuition:</span>
                <strong style={{ color: 'var(--text-secondary)' }}>{prog.tuitionEstimate}</strong>
              </div>
            </div>

            <Button variant="primary" style={{ width: '100%' }}>View Requirements</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
