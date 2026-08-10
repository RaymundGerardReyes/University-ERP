export interface EnrollmentPaymentDto {
    paymentId: string;
    assessmentId: string;
    amount: number;
    method: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'E_WALLET';
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    transactionReference?: string;
    createdAt: string;
}

export interface InitiatePaymentRequest {
    assessmentId: string;
    amount: number;
    method: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'E_WALLET';
}
