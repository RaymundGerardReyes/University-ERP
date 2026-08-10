export interface TransferCredentialDto {
    transferId: string;
    studentName: string;
    previousInstitution: string;
    programId: string;
    status: 'EVALUATING' | 'CREDITED' | 'REJECTED';
    creditedSubjects: string[];
    submittedAt: string;
}

export interface CreditTransferRequest {
    transferId: string;
    creditedSubjects: string[];
}
