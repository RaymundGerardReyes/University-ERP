import { SubmitEvidencePayload, SubmitEvidenceResponse } from '@university-erp/domain-viewmodels';

export interface AuditCompliancePageProps { }

export interface AuditRecord {
    id: string;
    standard: string;
    status: 'Submitted' | 'Verified' | 'Pending Review';
    submitter: string;
    date: string;
}

export type { SubmitEvidencePayload, SubmitEvidenceResponse };
