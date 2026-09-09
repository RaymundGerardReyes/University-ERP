export interface AuditItem {
  id: string;
  auditCode: string;
  scope: 'Academic' | 'Financial' | 'IT Infrastructure' | 'Facilities';
  leadAuditor: string;
  status: 'Scheduled' | 'InProgress' | 'Completed' | 'FindingsReview';
  findingsCount: number;
  scheduledDate: string;
}
