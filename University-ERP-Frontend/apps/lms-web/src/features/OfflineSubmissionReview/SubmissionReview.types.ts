export interface OfflineSubmissionDto {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  assignmentId: string;
  assignmentTitle: string;
  essayContent?: string;
  scheduleToken: string;
  syncedAtUtc: string;
  status: 'Pending Review' | 'Graded' | 'Rejected';
  score?: number;
  maxScore: number;
  feedback?: string;
}

export interface GradeSubmissionPayload {
  submissionId: string;
  score: number;
  feedback: string;
}
