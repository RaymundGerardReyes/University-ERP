import { apiClient } from '@university-erp/api-clients';
import { RiskItem } from './RiskManagement.types';

export const fetchRiskRegister = async (): Promise<RiskItem[]> => {
  try {
    const res = await apiClient.get<RiskItem[]>('/api/v1/governance/risks');
    return res.data || [];
  } catch {
    return [
      { id: 'RSK-01', riskTitle: 'Unscheduled Power Outage in Main Data Center', category: 'Operational', severity: 'High', mitigationStrategy: 'Redundant Dual-UPS and Automatic Diesel Generator Relay', ownerDepartment: 'Facilities Management' },
      { id: 'RSK-02', riskTitle: 'Ransomware Targeting Student Personal Data Vault', category: 'Cybersecurity', severity: 'Critical', mitigationStrategy: 'Immutable Offsite Backups & Multi-Factor Zero Trust Authentication', ownerDepartment: 'Platform Security' },
      { id: 'RSK-03', riskTitle: 'Tuition Receivable Default Rate Exceeding 8%', category: 'Financial', severity: 'Medium', mitigationStrategy: 'Automated SMS Installment Reminders and Scholarship Matching', ownerDepartment: 'Finance & Accounting' }
    ];
  }
};
