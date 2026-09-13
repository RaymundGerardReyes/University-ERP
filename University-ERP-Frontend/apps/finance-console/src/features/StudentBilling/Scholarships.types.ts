export type GrantVerificationStatus = 'VERIFIED' | 'PENDING_REGISTRAR' | 'REJECTED';
export type GrantApplicationStatus = 'APPLIED' | 'UNAPPLIED';

export interface GrantApplication {
  id: string;
  studentId: string;
  studentNumber: string;
  studentName: string;
  program: string;
  yearLevel: number;
  schemeId: string;
  schemeName: string;
  sponsor: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  appliedDiscountAmount?: number;
  gpa: number;
  enrolledUnits: number;
  tuitionFeeTotal: number;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  submittedDate: string;
}

export interface ScholarshipScheme {
  id: string;
  name: string;
  type: 'INSTITUTIONAL' | 'GOVERNMENT' | 'PRIVATE_ENDOWMENT';
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  minGpaRequired: number;
  sponsor: string;
}

export interface ScholarshipGrantItem {
  id: string;
  studentId: string;
  studentName: string;
  program: string;
  grantName: string;
  grantType: 'ACADEMIC_EXCELLENCE' | 'ATHLETIC' | 'FINANCIAL_AID' | 'FACULTY_DEPENDENT';
  discountAmount: number;
  discountPercentage?: number;
  verificationStatus: GrantVerificationStatus;
  applicationStatus: GrantApplicationStatus;
  verifiedBy?: string;
  appliedDate?: string;
}

export interface ApplyGrantPayload {
  grantId: string;
  studentId: string;
  amount: number;
  semester: string;
}

export interface ScholarshipSummaryDto {
  totalDisbursedAid: number;
  activeRecipients: number;
  pendingVerifications: number;
}

