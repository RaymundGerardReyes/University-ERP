import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentsApi } from './Assignments.api';
import { CreateAssignmentPayload } from './Assignments.types';

export function useAssignments(courseId?: string) {
  return useQuery({
    queryKey: ['lmsAssignments', courseId],
    queryFn: () => assignmentsApi.getAssignments(courseId)
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAssignmentPayload) => assignmentsApi.createAssignment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lmsAssignments'] });
    }
  });
}
