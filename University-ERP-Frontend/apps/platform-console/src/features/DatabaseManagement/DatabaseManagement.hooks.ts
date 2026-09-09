import { useQuery } from '@tanstack/react-query';
import { fetchDatabaseClusters } from './DatabaseManagement.api';

export const useDatabaseClusters = () => {
  return useQuery({
    queryKey: ['platform', 'database', 'clusters'],
    queryFn: fetchDatabaseClusters,
    staleTime: 30000
  });
};
