import { useQuery } from '@tanstack/react-query';
import { careerApi } from '@university-erp/api-clients';

export const useJobPostings = () => {
  return useQuery({
    queryKey: ['jobPostings'],
    queryFn: () => careerApi.getJobPostings(),
  });
};