export interface AdmissionCaseDto {
    caseId: string;
    applicantName: string;
    programId: string;
    stage: 'APPLICATION' | 'EVALUATION' | 'DECISION';
    status: string;
    assignedOfficer?: string;
    submittedAt: string;
}

export interface AssignCaseRequest {
    caseId: string;
    officerId: string;
}
