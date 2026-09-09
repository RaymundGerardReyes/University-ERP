import React from 'react';
import { PageHeader, Card, Table, Badge, Button } from '@university-erp/ui-kit';
import { useCommittees } from './Committees.hooks';

export const CommitteesPage: React.FC = () => {
  const { data: committees, isLoading } = useCommittees();

  return (
    <div className="fade-in">
      <PageHeader 
        title="Governance Committees" 
        subtitle="Manage academic senate, council boards, and standing administrative committees." 
        action={<Button variant="primary">Establish Committee</Button>}
      />

      <Card className="fade-in-delay-1" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Active Standing Committees</h2>
        {isLoading ? (
          <div className="skeleton" style={{ height: '30vh' }} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Committee Name</th>
                <th>Chairperson</th>
                <th>Members</th>
                <th>Frequency</th>
                <th>Next Session</th>
                <th>Standing</th>
              </tr>
            </thead>
            <tbody>
              {(committees || []).map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.chairperson}</td>
                  <td>{c.membersCount} delegates</td>
                  <td><Badge colorScheme="default">{c.meetingFrequency}</Badge></td>
                  <td style={{ color: 'var(--text-muted)' }}>{c.nextMeetingDate}</td>
                  <td><Badge colorScheme="success">{c.standing}</Badge></td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default CommitteesPage;
