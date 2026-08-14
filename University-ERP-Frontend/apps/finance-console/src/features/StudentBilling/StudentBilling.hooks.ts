import { useQuery } from '@tanstack/react-query';
import { studentBillingApi } from './StudentBilling.api';

export const useStudentBillings = () => {
    return useQuery({
        queryKey: ['finance', 'student-billings'],
        queryFn: () => studentBillingApi.getAllBillings()
    });
};
