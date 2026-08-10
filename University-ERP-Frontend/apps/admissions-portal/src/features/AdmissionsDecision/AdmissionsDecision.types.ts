export interface AdmissionsDecisionDto {
    decisionId: string;
    applicantId: string;
    status: 'ADMISSION_APPROVED' | 'REJECTED' | 'WAITLISTED';
    approvedBy: string;
    approvedAt: string;
    remarks?: string;
}

export interface MakeDecisionRequest {
    applicantId: string;
    status: 'ADMISSION_APPROVED' | 'REJECTED' | 'WAITLISTED';
    remarks?: string;
}
