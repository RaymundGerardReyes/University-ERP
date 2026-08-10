export interface HandoffDto {
    handoffId: string;
    applicantId: string;
    status: 'PENDING_HANDOFF' | 'HANDED_OFF';
    handedOffBy: string;
    handedOffAt: string;
}

export interface ExecuteHandoffRequest {
    applicantId: string;
}
