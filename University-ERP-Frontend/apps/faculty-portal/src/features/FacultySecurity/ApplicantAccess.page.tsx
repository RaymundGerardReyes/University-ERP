import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { createLogger } from '@university-erp/core-logger';

const logger = createLogger('faculty-portal', 'ApplicantAccess');

// Simulated DTO for Security Access Audits
interface AccessRecordDto {
  id: string;
  facultyName: string;
  role: string;
  department: string;
  clearanceLevel: 'Standard' | 'Elevated' | 'Restricted';
  activeCasesAccessed: number;
}

export const ApplicantAccessPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'Elevated' | 'Restricted'>('ALL');

  // Fetch the active access records
  const { data: accessRecords = [], isLoading } = useQuery<AccessRecordDto[]>({
    queryKey: ['security', 'applicantAccess'],
    queryFn: async () => {
      // Future API hookup: return await securityApi.getActiveAccessRecords();
      return [];
    },
    initialData: [
      { id: 'FAC-801', facultyName: 'Dr. Sarah Jenkins', role: 'Chairperson', department: 'Computer Science', clearanceLevel: 'Elevated', activeCasesAccessed: 12 },
      { id: 'FAC-802', facultyName: 'Dr. Marcus Torres', role: 'Faculty', department: 'Information Systems', clearanceLevel: 'Standard', activeCasesAccessed: 0 },
      { id: 'FAC-805', facultyName: 'Prof. Lin Wang', role: 'Dean', department: 'College of Engineering', clearanceLevel: 'Restricted', activeCasesAccessed: 45 },
      { id: 'FAC-810', facultyName: 'Alice Smith', role: 'Secretary', department: 'Admissions', clearanceLevel: 'Elevated', activeCasesAccessed: 128 }
    ]
  });

  // Mutation to instantly revoke a faculty member's access
  const revokeAccessMutation = useMutation({
    mutationFn: async (facultyId: string) => {
      // Future API hookup: await securityApi.revokeAccess(facultyId);
      return new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: (_, facultyId) => {
      logger.warn(`Security Officer explicitly revoked access for faculty ID: ${facultyId}`);
      queryClient.invalidateQueries({ queryKey: ['security', 'applicantAccess'] });
    },
    onError: (err) => {
      logger.error('Failed to revoke access', err);
      alert('A critical error occurred while attempting to revoke access. Check system logs.');
    }
  });

  const handleRevoke = (facultyId: string, facultyName: string) => {
    if (window.confirm(`SECURITY ALERT: Are you sure you want to revoke all applicant data access for ${facultyName}? This action is immediate and will be logged.`)) {
      revokeAccessMutation.mutate(facultyId);
    }
  };

  // Apply frontend filters
  const filteredRecords = accessRecords.filter(record => {
    const matchesSearch = record.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = roleFilter === 'ALL' || record.clearanceLevel === roleFilter;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader 
        title="Applicant Access Control" 
        subtitle="Audit and manage faculty access to protected admission records and sensitive data." 
      />

      <Card style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {/* Filter & Search Bar */}
        <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-elevated)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <input 
              type="text" 
              placeholder="Search faculty or department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)', width: '300px' }}
            />
            <Button variant={roleFilter === 'ALL' ? 'primary' : 'outline'} onClick={() => setRoleFilter('ALL')}>All Clearances</Button>
            <Button variant={roleFilter === 'Elevated' ? 'primary' : 'outline'} onClick={() => setRoleFilter('Elevated')}>Elevated</Button>
            <Button variant={roleFilter === 'Restricted' ? 'primary' : 'outline'} onClick={() => setRoleFilter('Restricted')}>Restricted</Button>
          </div>
          <Badge colorScheme="danger" style={{ fontSize: '0.8rem' }}>
            Active Audit Mode
          </Badge>
        </div>

        {/* High-Density Audit Table */}
        <Table>
          <thead>
            <tr>
              <th>Faculty Name</th>
              <th>Department / Role</th>
              <th>Clearance Level</th>
              <th>Active Cases</th>
              <th style={{ textAlign: 'right' }}>Security Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? filteredRecords.map((record) => (
              <tr key={record.id}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{record.facultyName}</div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{record.id}</div>
                </td>
                <td>
                  <div style={{ color: 'var(--text-primary)' }}>{record.department}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{record.role}</div>
                </td>
                <td>
                  <Badge 
                    colorScheme={
                      record.clearanceLevel === 'Restricted' ? 'danger' : 
                      record.clearanceLevel === 'Elevated' ? 'warning' : 'info'
                    }
                  >
                    {record.clearanceLevel}
                  </Badge>
                </td>
                <td style={{ fontWeight: record.activeCasesAccessed > 50 ? 800 : 500, color: record.activeCasesAccessed > 50 ? 'var(--warning-text)' : 'var(--text-primary)' }}>
                  {record.activeCasesAccessed}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Button 
                    variant="danger" 
                    size="small" 
                    onClick={() => handleRevoke(record.id, record.facultyName)}
                    disabled={revokeAccessMutation.isPending}
                  >
                    Revoke Access
                  </Button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
                  No faculty access records match your current filters.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};
