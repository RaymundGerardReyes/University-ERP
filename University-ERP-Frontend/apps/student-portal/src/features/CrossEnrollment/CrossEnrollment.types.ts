export interface CrossEnrollmentDto {
    requestId: string;
    studentId: string;
    hostInstitution: string;
    subjects: string[];
    status: 'DRAFT' | 'SUBMITTED' | 'DEAN_APPROVED' | 'REGISTRAR_APPROVED' | 'REJECTED';
    submittedAt: string;
}

export interface SubmitCrossEnrollmentRequest {
    studentId: string;
    hostInstitution: string;
    subjects: string[];
}
