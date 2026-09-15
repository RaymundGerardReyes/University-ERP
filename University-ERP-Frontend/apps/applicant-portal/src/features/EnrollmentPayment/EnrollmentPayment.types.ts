export interface EnrollmentPaymentDto {
    paymentId: string;
    assessmentId: string;
    applicantId?: string;
    amount: number;
    method?: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'E_WALLET' | 'ONLINE_GATEWAY' | string;
    paymentMethod?: string;
    status:
        | 'PENDING'
        | 'PROCESSING'
        | 'COMPLETED'
        | 'FAILED'
        | 'PAYMENT_PENDING'
        | 'PAYMENT_VERIFIED'
        | 'SETTLED'
        | 'VERIFIED';
    transactionReference?: string;
    referenceNumber?: string;
    createdAt?: string;
    paidAt?: string;
}

export interface InitiatePaymentRequest {
    assessmentId: string;
    applicantId?: string;
    amount: number;
    method?: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'E_WALLET' | 'ONLINE_GATEWAY' | string;
    paymentMethod?: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'E_WALLET' | 'ONLINE_GATEWAY' | string;
    /** URL the payment gateway will redirect the browser to after checkout */
    returnUrl?: string;
}
