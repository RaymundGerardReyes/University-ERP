export interface RiskItem {
  id: string;
  riskTitle: string;
  category: 'Operational' | 'Financial' | 'Reputational' | 'Cybersecurity';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  mitigationStrategy: string;
  ownerDepartment: string;
}
