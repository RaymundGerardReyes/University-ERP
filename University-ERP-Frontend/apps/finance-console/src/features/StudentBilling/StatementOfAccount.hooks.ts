import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { statementApi } from './StatementOfAccount.api';
import { StudentAccountSummary, StatementOfAccountDetail } from './StatementOfAccount.types';

import { toSafeArray } from '../../utils/arrayUtils';

export const useStatementOfAccount = (selectedStudentId?: string) => {
  const queryClient = useQueryClient();

  const summariesQuery = useQuery<StudentAccountSummary[], Error>({
    queryKey: ['statements', 'summaries'],
    queryFn: () => statementApi.getAccountSummaries(),
  });

  const detailQuery = useQuery<StatementOfAccountDetail, Error>({
    queryKey: ['statements', 'detail', selectedStudentId],
    queryFn: () => statementApi.getStatementDetail(selectedStudentId!),
    enabled: !!selectedStudentId,
  });

  const adjustMutation = useMutation({
    mutationFn: ({ studentId, amount, reason, type }: { studentId: string; amount: number; reason: string; type: 'DEBIT' | 'CREDIT' }) =>
      statementApi.postAdjustment(studentId, { amount, reason, type }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statements'] });
      queryClient.invalidateQueries({ queryKey: ['billing'] });
    },
  });

  return {
    summaries: toSafeArray<StudentAccountSummary>(summariesQuery.data),
    activeStatement: detailQuery.data ?? null,
    isLoading: summariesQuery.isLoading || detailQuery.isLoading,
    isDetailLoading: detailQuery.isLoading,
    postAdjustment: adjustMutation.mutateAsync,
    isAdjusting: adjustMutation.isPending,
  };
};

