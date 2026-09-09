import { useQuery } from '@tanstack/react-query';
import { fetchCommittees } from './Committees.api';

export const useCommittees = () => {
  return useQuery({
    queryKey: ['governance', 'committees'],
    queryFn: fetchCommittees,
    staleTime: 60000
  });
};
