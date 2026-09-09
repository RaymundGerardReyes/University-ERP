import { useQuery } from '@tanstack/react-query';
import { fetchStudentDashboard } from './Dashboard.api';

export const useStudentDashboard = () => {
  return useQuery({
    queryKey: ['student', 'dashboard'],
    queryFn: fetchStudentDashboard,
    staleTime: 60000
  });
};
