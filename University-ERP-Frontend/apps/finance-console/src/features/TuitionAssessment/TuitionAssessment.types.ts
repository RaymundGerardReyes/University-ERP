export interface AssessmentStudentDto {
  studentId: string;
  studentName: string;
  program: string;
  enrolledUnits: number;
  ratePerUnit: number;
  miscellaneousFees: number;
  scholarshipDeduction: number;
  assessedTotal: number;
  status: 'Pending' | 'Assessed' | 'Invoiced';
}

export interface PerformAssessmentPayload {
  studentId: string;
  termId: string;
}
