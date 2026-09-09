import { useQuery } from '@tanstack/react-query';
import { fetchAvailableOfferings } from './Enrollment.api';

export const useEnrollmentOfferings = () => {
  return useQuery({
    queryKey: ['student', 'enrollment', 'offerings'],
    queryFn: fetchAvailableOfferings,
    staleTime: 60000
  });
};
