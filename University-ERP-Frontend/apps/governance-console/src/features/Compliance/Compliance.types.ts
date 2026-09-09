export interface ComplianceRequirement {
  id: string;
  title: string;
  governingBody: 'CHED' | 'ISO' | 'DataPrivacy' | 'LaborStandards';
  deadline: string;
  status: 'Compliant' | 'PendingReview' | 'CriticalActionRequired';
  assignedOffice: string;
}
