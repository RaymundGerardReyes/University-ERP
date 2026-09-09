import React from 'react';
import { PageHeader, Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { useRiskRegister } from './RiskManagement.hooks';

export const RiskManagementPage: React.FC = () => {
  const { data: risks, isLoading } = useRiskRegister();

  return (
    <div className="fade-in">
      <PageHeader 
        title="Enterprise Risk Management" 
        subtitle="Identify, assess, and mitigate institutional vulnerabilities and operational hazards." 
        action={<Button variant="primary">Log Emerging Risk</Button>}
      />

      <Card className="fade-in-delay-1" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Enterprise Risk Matrix & Mitigation Plans</h2>
        {isLoading ? (
          <div className="skeleton" style={{ height: '30vh' }} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Identified Risk</th>
                <th>Classification</th>
                <th>Severity</th>
                <th>Mitigation Controls</th>
                <th>Responsible Office</th>
              </tr>
            </thead>
            <tbody>
              {(risks || []).map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.riskTitle}</td>
                  <td><Badge colorScheme="default">{r.category}</Badge></td>
                  <td>
                    <Badge colorScheme={r.severity === 'Critical' ? 'danger' : r.severity === 'High' ? 'warning' : 'info'}>
                      {r.severity}
                    </Badge>
                  </td>
                  <td style={{ fontSize: '0.9rem' }}>{r.mitigationStrategy}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{r.ownerDepartment}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default RiskManagementPage;
