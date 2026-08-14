import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { createLogger } from '@university-erp/core-logger';

const logger = createLogger('faculty-portal', 'RecommendationAudit');

// Simulated DTO for Immutable Audit Logs
interface AuditLogDto {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  targetId: string;
  actionTaken: 'Document Verified' | 'Interview Logged' | 'Academic Recommended' | 'College Endorsed' | 'Access Revoked';
  details: string;
}

export const RecommendationAuditPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  // Fetch the immutable audit ledger
  const { data: auditLogs = [], isLoading } = useQuery<AuditLogDto[]>({
    queryKey: ['security', 'auditLogs'],
    queryFn: async () => {
      // Future API hookup: return await securityApi.getAuditLogs();
      return [];
    },
    initialData: [
      { id: 'LOG-0991', timestamp: '2026-08-14T14:30:00Z', actorName: 'Prof. Lin Wang', actorRole: 'Dean', targetId: 'APP-2026-042', actionTaken: 'College Endorsed', details: 'Final capacity approval granted.' },
      { id: 'LOG-0990', timestamp: '2026-08-14T11:15:00Z', actorName: 'Dr. Sarah Jenkins', actorRole: 'Chairperson', targetId: 'APP-2026-042', actionTaken: 'Academic Recommended', details: 'Score: 94/100. Highly recommended.' },
      { id: 'LOG-0989', timestamp: '2026-08-13T09:00:00Z', actorName: 'Alice Smith', actorRole: 'Secretary', targetId: 'APP-2026-042', actionTaken: 'Interview Logged', details: 'Interview completed by Dr. Torres.' },
      { id: 'LOG-0988', timestamp: '2026-08-12T16:45:00Z', actorName: 'Alice Smith', actorRole: 'Secretary', targetId: 'APP-2026-042', actionTaken: 'Document Verified', details: 'Transcripts and ID verified against originals.' },
      { id: 'LOG-0987', timestamp: '2026-08-12T10:05:00Z', actorName: 'System Security', actorRole: 'System', targetId: 'FAC-802', actionTaken: 'Access Revoked', details: 'Automated revocation due to inactive session.' }
    ]
  });

  // Apply frontend filters for the Security Officer
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.targetId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = actionFilter === 'ALL' || log.actionTaken === actionFilter;
    return matchesSearch && matchesFilter;
  });

  // Helper function to format ISO timestamps into readable local dates
  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric', 
      hour: 'numeric', minute: '2-digit', second: '2-digit' 
    }).format(date);
  };

  if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader 
        title="Evaluation Audit Logs" 
        subtitle="Immutable security ledger tracking all faculty interactions and admission lifecycle events." 
      />

      <Card style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {/* Filter & Search Bar */}
        <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-elevated)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flex: 1 }}>
            <input 
              type="text" 
              placeholder="Search by Actor Name or Target ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)', minWidth: '300px' }}
            />
            <select 
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <option value="ALL">All Actions</option>
              <option value="Document Verified">Document Verified</option>
              <option value="Interview Logged">Interview Logged</option>
              <option value="Academic Recommended">Academic Recommended</option>
              <option value="College Endorsed">College Endorsed</option>
              <option value="Access Revoked">Access Revoked</option>
            </select>
          </div>
          <Badge colorScheme="default" style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
            {filteredLogs.length} Records Found
          </Badge>
        </div>

        {/* High-Density Immutable Ledger Table */}
        <Table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action Taken</th>
              <th>Target Record</th>
              <th>Audit Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? filteredLogs.map((log) => (
              <tr key={log.id}>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  {formatTimestamp(log.timestamp)}
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.actorName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.actorRole}</div>
                </td>
                <td>
                  <Badge 
                    colorScheme={
                      log.actionTaken === 'Access Revoked' ? 'danger' : 
                      log.actionTaken === 'College Endorsed' ? 'success' : 
                      log.actionTaken === 'Academic Recommended' ? 'info' : 'warning'
                    }
                  >
                    {log.actionTaken}
                  </Badge>
                </td>
                <td style={{ fontFamily: 'monospace', color: 'var(--brand-primary)', fontWeight: 600 }}>
                  {log.targetId}
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                  {log.details}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
                  No audit logs match your current search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};
