export interface StudentClearanceDto {
  status: 'Cleared_For_Graduation' | 'Pending_Clearance' | 'Hold';
  academicMet: boolean;
  financialMet: boolean;
  libraryMet?: boolean;
  notes?: string;
}
