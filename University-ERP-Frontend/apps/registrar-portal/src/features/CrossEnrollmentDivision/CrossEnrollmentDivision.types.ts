export interface IncomingCrossEnrolleeDto {
    crossEnrolleeId: string;
    studentName: string;
    homeInstitution: string;
    requestedSubjects: string[];
    status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
    submittedAt: string;
}

export interface ReviewCrossEnrolleeRequest {
    crossEnrolleeId: string;
    status: 'APPROVED' | 'REJECTED';
    remarks?: string;
}
