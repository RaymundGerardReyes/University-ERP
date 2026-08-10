export interface AdmissionAssessmentDto {
    assessmentId: string;
    applicantId: string;
    programId: string;
    totalTuition: number;
    miscellaneousFees: number;
    requiredDownpayment: number;
    status: 'PENDING' | 'GENERATED' | 'PUBLISHED';
    createdAt: string;
}

export interface GenerateAssessmentRequest {
    applicantId: string;
    programId: string;
    discountCode?: string;
}
