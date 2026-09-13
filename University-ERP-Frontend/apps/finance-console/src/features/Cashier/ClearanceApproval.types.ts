export interface ClearanceCandidate {
  id: string;
  studentNumber: string;
  studentName: string;
  program: string;
  graduationTerm: string;
  outstandingBalance: number;
  unreturnedAssetsCount: number;
  libraryFines: number;
  financeStatus: 'CLEARED' | 'PENDING' | 'REJECTED';
  clearanceSignOffDate?: string;
  signOffOfficer?: string;
  rejectionReason?: string;
}

export interface ClearanceBatchAuditResult {
  totalProcessed: number;
  clearedCount: number;
  holdCount: number;
}

