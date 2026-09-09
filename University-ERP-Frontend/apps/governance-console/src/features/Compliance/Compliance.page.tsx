import React from 'react';
import { PageHeader, Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { useComplianceRecords } from './Compliance.hooks';

export const CompliancePage: React.FC = () => {
  const { data: compliance, isLoading } = useComplianceRecords();

  return (
    <div className="fade-in">
      <PageHeader 
        title="Regulatory Compliance" 
        subtitle="Track university-wide statutory regulations, government mandates, and accreditation obligations." 
        action={<Button variant="primary">Generate Compliance Report</Button>}
      />

      <Card className="fade-in-delay-1" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Mandatory Statutory Checklist</h2>
        {isLoading ? (
          <div className="skeleton" style={{ height: '30vh' }} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Requirement Title</th>
                <th>Governing Authority</th>
                <th>Assigned Office</th>
                <th>Filing Deadline</th>
                <th>Compliance Status</th>
              </tr>
            </thead>
            <tbody>
              {(compliance || []).map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.title}</td>
                  <td><Badge colorScheme="default">{c.governingBody}</Badge></td>
                  <td>{c.assignedOffice}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{c.deadline}</td>
                  <td>
                    <Badge colorScheme={c.status === 'Compliant' ? 'success' : c.status === 'PendingReview' ? 'warning' : 'danger'}>
                      {c.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default CompliancePage;
