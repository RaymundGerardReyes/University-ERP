export interface FinancialClearanceDto {
    clearanceId: string;
    applicantId: string;
    assessmentId: string;
    clearedBy: string;
    clearedAt: string;
    status: 'CLEARED' | 'REVOKED';
}

export interface IssueClearanceRequest {
    applicantId: string;
    assessmentId: string;
    remarks?: string;
}
