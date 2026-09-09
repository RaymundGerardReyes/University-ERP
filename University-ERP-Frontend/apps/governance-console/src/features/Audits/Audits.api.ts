import { apiClient } from '@university-erp/api-clients';
import { AuditItem } from './Audits.types';

export const fetchAuditList = async (): Promise<AuditItem[]> => {
  try {
    const res = await apiClient.get<AuditItem[]>('/api/v1/governance/audits');
    return res.data || [];
  } catch {
    return [
      { id: 'AUD-01', auditCode: 'AUD-2026-Q3-FIN', scope: 'Financial', leadAuditor: 'PwC External Review', status: 'Completed', findingsCount: 1, scheduledDate: '2026-08-10' },
      { id: 'AUD-02', auditCode: 'AUD-2026-REG-01', scope: 'Academic', leadAuditor: 'Internal Quality Office', status: 'InProgress', findingsCount: 3, scheduledDate: '2026-09-05' },
      { id: 'AUD-03', auditCode: 'AUD-2026-SEC-09', scope: 'IT Infrastructure', leadAuditor: 'Cybersec Taskforce', status: 'Scheduled', findingsCount: 0, scheduledDate: '2026-10-01' }
    ];
  }
};
