export interface RequirementDto {
    requirementId: string;
    applicantId: string;
    documentType: string;
    status: 'MISSING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
    submittedAt?: string;
    fileUrl?: string;
    remarks?: string;
}

export interface VerifyRequirementRequest {
    requirementId: string;
    status: 'VERIFIED' | 'REJECTED';
    remarks?: string;
}
