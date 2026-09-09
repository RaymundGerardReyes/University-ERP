import { apiClient } from '@university-erp/api-clients';
import { CampusTenant } from './TenantManagement.types';

export const fetchCampusTenants = async (): Promise<CampusTenant[]> => {
  try {
    const res = await apiClient.get<CampusTenant[]>('/api/v1/platform/tenants');
    return res.data || [];
  } catch {
    return [
      { id: 'TNT-01', name: 'Main Campus (Metro Manila)', code: 'MNL-MAIN', region: 'NCR', activeUsers: 14200, allocatedStorageGb: 1024, status: 'Active' },
      { id: 'TNT-02', name: 'Science and Technology Park (Laguna)', code: 'LAG-TECH', region: 'Region IV-A', activeUsers: 4800, allocatedStorageGb: 512, status: 'Active' },
      { id: 'TNT-03', name: 'Cebu Academic Extension', code: 'CEB-EXT', region: 'Region VII', activeUsers: 3100, allocatedStorageGb: 256, status: 'Active' }
    ];
  }
};
