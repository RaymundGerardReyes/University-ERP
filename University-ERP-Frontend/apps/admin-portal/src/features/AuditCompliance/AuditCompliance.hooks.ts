import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SubmitEvidencePayload } from '@university-erp/domain-viewmodels';
import { fetchAuditLedger, submitComplianceEvidence } from './AuditCompliance.api';

export const useAuditLedger = () => {
    return useQuery({
        queryKey: ['auditLedger'],
        queryFn: fetchAuditLedger,
    });
};

export const useSubmitEvidence = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: SubmitEvidencePayload) => submitComplianceEvidence(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auditLedger'] });
        }
    });
};