export interface DownpaymentDto {
    paymentId: string;
    applicantId: string;
    assessmentId: string;
    amountPaid: number;
    paymentMethod: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    referenceNumber: string;
    verifiedAt?: string;
}

export interface VerifyDownpaymentRequest {
    paymentId: string;
    remarks?: string;
}
