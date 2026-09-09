import { apiClient } from '@university-erp/api-clients';
import { ApiKey } from './APIKeys.types';

export const fetchApiKeys = async (): Promise<ApiKey[]> => {
  try {
    const res = await apiClient.get<ApiKey[]>('/api/v1/platform/api-keys');
    return res.data || [];
  } catch {
    return [
      { id: 'KEY-01', name: 'Moodle LMS Webhook Service', prefix: 'ue_live_mood_', scopes: ['academic:read', 'lms:sync'], createdAt: '2026-01-10', lastUsedAt: '2026-09-08', status: 'Active' },
      { id: 'KEY-02', name: 'Payment Gateway Clearing Daemon', prefix: 'ue_live_pay_', scopes: ['finance:charge', 'finance:ledger'], createdAt: '2026-02-14', lastUsedAt: '2026-09-09', status: 'Active' },
      { id: 'KEY-03', name: 'Biometric Gate Access Scanner', prefix: 'ue_live_bio_', scopes: ['visitor:log', 'campus:verify'], createdAt: '2026-03-01', lastUsedAt: null, status: 'Revoked' }
    ];
  }
};
