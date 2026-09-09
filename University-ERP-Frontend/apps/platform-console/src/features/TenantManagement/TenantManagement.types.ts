export interface CampusTenant {
  id: string;
  name: string;
  code: string;
  region: string;
  activeUsers: number;
  allocatedStorageGb: number;
  status: 'Active' | 'Provisioning' | 'Suspended';
}
