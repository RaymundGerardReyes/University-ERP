import React from 'react';
import { Badge, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { useAuth } from '@university-erp/auth-sdk';
import { useStudentClubs } from './Extracurriculars.hooks';

export const ExtracurricularsPage: React.FC = () => {
  const { identity } = useAuth();
  const studentId = identity?.id || 'STU-2026-001';
  const { data: clubs, isLoading } = useStudentClubs(studentId);

  const items = clubs || [
    { clubId: 'CLUB-01', name: 'ACM Student Chapter', category: 'Academic', role: 'Officer', joinedDate: '2025-09-01', activityHours: 45 },
    { clubId: 'CLUB-02', name: 'University Chess Club', category: 'Sports', role: 'Member', joinedDate: '2025-10-15', activityHours: 20 },
    { clubId: 'CLUB-03', name: 'Campus Green Initiative', category: 'Community', role: 'Member', joinedDate: '2026-02-01', activityHours: 15 }
  ];
  const totalHours = items.reduce((acc, c: any) => acc + c.activityHours, 0);

  return (
    <div className="fade-in">
      <PageHeader
        title="Extracurricular Activities"
        subtitle="Campus student organizations, leadership positions, and certified community service hours."
      />

      {isLoading ? (
        <div className="skeleton" style={{ height: '400px' }} data-testid="loading-skeleton" />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active Memberships</span>
              <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--brand-primary)' }}>{items.length} Organizations</h2>
            </Card>
            <Card>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Activity Hours</span>
              <h2 style={{ margin: 'var(--space-2) 0 0 0', color: 'var(--success-text)' }}>{totalHours} Hours</h2>
            </Card>
          </div>

          <Card>
            <Table>
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Category</th>
                  <th>Leadership Role</th>
                  <th>Joined Date</th>
                  <th>Service Hours</th>
                </tr>
              </thead>
              <tbody>
                {items.map((club: any) => (
                  <tr key={club.clubId}>
                    <td style={{ fontWeight: 600 }}>{club.name}</td>
                    <td><Badge colorScheme="info">{club.category}</Badge></td>
                    <td><Badge colorScheme={club.role === 'President' || club.role === 'Officer' ? 'success' : 'default'}>{club.role}</Badge></td>
                    <td>{club.joinedDate}</td>
                    <td style={{ fontWeight: 600 }}>{club.activityHours} hrs</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </>
      )}
    </div>
  );
};
