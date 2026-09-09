import { apiClient } from '@university-erp/api-clients';
import { GlobalSetting } from './GlobalSettings.types';

export const fetchGlobalSettings = async (): Promise<GlobalSetting[]> => {
  try {
    const res = await apiClient.get<GlobalSetting[]>('/api/v1/platform/settings');
    return res.data || [];
  } catch {
    return [
      { id: 'SET-01', key: 'auth.mfa.enforce_all_staff', category: 'Security', value: 'true', description: 'Mandate hardware/TOTP multi-factor auth for all employees', lastModified: '2026-08-01' },
      { id: 'SET-02', key: 'academic.default_term_code', category: 'Academic', value: '2026-1S', description: 'Default system-wide term code for API queries', lastModified: '2026-08-15' },
      { id: 'SET-03', key: 'system.timezone', category: 'Localization', value: 'Asia/Manila', description: 'Canonical server and UI operational timezone', lastModified: '2026-01-01' }
    ];
  }
};
