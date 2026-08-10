export interface GraduationApplicationDto {
    applicationId: string;
    studentId: string;
    programId: string;
    status: 'DRAFT' | 'SUBMITTED' | 'EVALUATING' | 'APPROVED' | 'REJECTED';
    clearanceStatus: 'PENDING' | 'CLEARED';
    submittedAt?: string;
}

export interface SubmitGraduationApplicationRequest {
    studentId: string;
    programId: string;
}
