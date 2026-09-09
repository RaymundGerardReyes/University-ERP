export interface AccreditationStandard {
  id: string;
  code: string;
  title: string;
  category: 'Curriculum' | 'Faculty' | 'Facilities' | 'Research' | 'Governance';
  status: 'Compliant' | 'InReview' | 'NonCompliant' | 'PendingEvidence';
  score: number;
  lastAssessed: string;
}

export interface EvidenceDocument {
  id: string;
  standardId: string;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
  verificationStatus: 'Verified' | 'UnderAudit' | 'Rejected';
}
