import { useQuery } from '@tanstack/react-query';
import { fetchJobPostings } from './CareerDashboard.api';

export const useCareerJobs = () => {
  return useQuery({
    queryKey: ['careerJobs'],
    queryFn: fetchJobPostings
  });
};
