import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gradebookSyncApi } from './GradebookSync.api';

export function useGradebookRecords(courseCode?: string) {
  return useQuery({
    queryKey: ['gradebookRecords', courseCode],
    queryFn: () => gradebookSyncApi.getRecords(courseCode)
  });
}

export function useSyncToRegistrar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, courseCode }: { studentId: string; courseCode?: string }) =>
      gradebookSyncApi.syncToRegistrar(studentId, courseCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradebookRecords'] });
    }
  });
}

export function useBatchSyncToRegistrar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentIds: string[]) => gradebookSyncApi.batchSync(studentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gradebookRecords'] });
    }
  });
}
