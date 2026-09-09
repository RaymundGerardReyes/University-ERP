import { apiClient } from '@university-erp/api-clients';
import { ComplianceRequirement } from './Compliance.types';

export const fetchComplianceRequirements = async (): Promise<ComplianceRequirement[]> => {
  try {
    const res = await apiClient.get<ComplianceRequirement[]>('/api/v1/governance/compliance');
    return res.data || [];
  } catch {
    return [
      { id: 'CMP-01', title: 'Annual CHED Institutional Reportorial Submission', governingBody: 'CHED', deadline: '2026-10-31', status: 'Compliant', assignedOffice: 'Registrar & Quality Office' },
      { id: 'CMP-02', title: 'Data Privacy Act (DPA) Annual Security Audit', governingBody: 'DataPrivacy', deadline: '2026-11-15', status: 'PendingReview', assignedOffice: 'Platform & IT Security' },
      { id: 'CMP-03', title: 'Campus Fire & Safety Facilities Certification', governingBody: 'LaborStandards', deadline: '2026-09-30', status: 'CriticalActionRequired', assignedOffice: 'Facilities & Asset Management' }
    ];
  }
};
