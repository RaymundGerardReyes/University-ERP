import React from 'react';
import { PageHeader, Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { useAccreditationStandards } from './Accreditation.hooks';

export const AccreditationPage: React.FC = () => {
  const { data: standards, isLoading } = useAccreditationStandards();

  return (
    <div className="fade-in">
      <PageHeader 
        title="Accreditation Management" 
        subtitle="Manage institutional accreditations, CHED regulatory criteria, and ISO compliance standards." 
        action={<Button variant="primary">Submit Evidence Package</Button>}
      />

      <div className="grid-stats fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
        <Card className="stat-card">
          <div className="card-accent-top" style={{ background: 'var(--brand-primary)' }} />
          <span className="stat-label">Active Standards</span>
          <span className="stat-value">{standards?.length || 4}</span>
          <span className="stat-trend">Institutional Scope</span>
        </Card>
        <Card className="stat-card">
          <div className="card-accent-top" style={{ background: 'var(--success-text)' }} />
          <span className="stat-label">Compliance Index</span>
          <span className="stat-value" style={{ color: 'var(--success-text)' }}>91.2%</span>
          <span className="stat-trend">Exceeds CHED Threshold</span>
        </Card>
        <Card className="stat-card">
          <div className="card-accent-top" style={{ background: 'var(--warning-text)' }} />
          <span className="stat-label">Pending Reviews</span>
          <span className="stat-value" style={{ color: 'var(--warning-text)' }}>2</span>
          <span className="stat-trend">Evidence Verification</span>
        </Card>
      </div>

      <Card className="fade-in-delay-2" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Institutional Standards Register</h2>
        {isLoading ? (
          <div className="skeleton" style={{ height: '30vh' }} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Standard Title</th>
                <th>Domain Area</th>
                <th>Compliance Status</th>
                <th>Rating Score</th>
                <th>Last Assessed</th>
              </tr>
            </thead>
            <tbody>
              {(standards || []).map((s) => (
                <tr key={s.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{s.code}</td>
                  <td>{s.title}</td>
                  <td><Badge colorScheme="default">{s.category}</Badge></td>
                  <td>
                    <Badge colorScheme={s.status === 'Compliant' ? 'success' : s.status === 'InReview' ? 'warning' : 'danger'}>
                      {s.status}
                    </Badge>
                  </td>
                  <td>{s.score}%</td>
                  <td style={{ color: 'var(--text-muted)' }}>{s.lastAssessed}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default AccreditationPage;
