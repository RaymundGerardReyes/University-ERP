export interface GradebookRecordDto {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  finalScore: number;
  letterGrade: string;
  registrarStatus: 'Synced' | 'Not Synced' | 'Pending Approval';
  lastSyncedAt?: string;
}

export interface SyncGradePayload {
  studentId: string;
  courseCode: string;
}
