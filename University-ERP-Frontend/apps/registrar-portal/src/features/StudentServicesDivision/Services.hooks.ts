import { useQuery } from '@tanstack/react-query';
import { fetchStudentInquiries } from './Services.api';

export const useStudentInquiries = () => {
    return useQuery({
        queryKey: ['registrar', 'studentInquiries'],
        queryFn: fetchStudentInquiries
    });
};
