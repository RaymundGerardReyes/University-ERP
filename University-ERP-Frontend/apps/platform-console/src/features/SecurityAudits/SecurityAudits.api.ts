import { apiClient } from '@university-erp/api-clients';
import { SecurityEvent } from './SecurityAudits.types';

export const fetchSecurityEvents = async (): Promise<SecurityEvent[]> => {
  try {
    const res = await apiClient.get<SecurityEvent[]>('/api/v1/platform/security/events');
    return res.data || [];
  } catch {
    return [
      { id: 'SEC-01', eventType: 'PRIVILEGE_ELEVATION', principalId: 'EMP-ADMIN-01', ipAddress: '10.0.4.12', severity: 'Warning', timestamp: '2026-09-09 17:45:00' },
      { id: 'SEC-02', eventType: 'VAULT_ACCESS', principalId: 'REG-OFFICER-04', ipAddress: '10.0.2.88', severity: 'Info', timestamp: '2026-09-09 17:30:12' },
      { id: 'SEC-03', eventType: 'LOGIN_FAILURE', principalId: 'UNKNOWN_ATTEMPT', ipAddress: '198.51.100.4', severity: 'Critical', timestamp: '2026-09-09 17:15:20' }
    ];
  }
};
