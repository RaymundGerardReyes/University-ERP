import { apiClient } from '@university-erp/api-clients';
import { InstitutionalPolicy } from './Policies.types';

export const fetchPolicies = async (): Promise<InstitutionalPolicy[]> => {
  try {
    const res = await apiClient.get<InstitutionalPolicy[]>('/api/v1/governance/policies');
    return res.data || [];
  } catch {
    return [
      { id: 'POL-01', policyCode: 'POL-ACAD-2026-01', title: 'Grading Standardization and Incomplete Mark Resolution', category: 'Academic', version: 'v3.2', effectiveDate: '2026-06-01', status: 'Active' },
      { id: 'POL-02', policyCode: 'POL-STU-2025-09', title: 'Student Code of Discipline and Anti-Bullying Protocol', category: 'StudentConduct', version: 'v2.0', effectiveDate: '2025-08-15', status: 'Active' },
      { id: 'POL-03', policyCode: 'POL-ADM-2026-04', title: 'University Intellectual Property and Commercialization Policy', category: 'Administrative', version: 'v1.1', effectiveDate: '2026-01-01', status: 'UnderReview' }
    ];
  }
};
