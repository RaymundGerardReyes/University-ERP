export interface GrievanceCaseViewModel {
  grievanceId: string;
  complainantId: string;
  category: string;
  description: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  assignedTo?: string;
  submittedAt: string;
  resolvedAt?: string;
}
