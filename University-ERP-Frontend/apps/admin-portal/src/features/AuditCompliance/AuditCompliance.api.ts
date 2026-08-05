import { governanceApi } from '@university-erp/api-clients';
import { SubmitEvidencePayload } from '@university-erp/domain-viewmodels';

export const submitComplianceEvidence = async (payload: SubmitEvidencePayload) => {
    return governanceApi.submitEvidence(payload);
};

// Removed mock fetch for the active audit ledger
export const fetchAuditLedger = async () => {
    return (governanceApi as any).getAuditLedger?.() ?? [];
};