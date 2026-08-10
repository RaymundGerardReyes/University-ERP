import { useQuery } from '@tanstack/react-query';
import { financialsApi } from './Financials.api';

export const useCurrentTermInvoice = (studentId: string, termId: string) => {
    return useQuery({
        queryKey: ['student', studentId, 'invoice', termId],
        queryFn: () => financialsApi.getCurrentTermInvoice(studentId, termId),
        enabled: !!studentId && !!termId
    });
};