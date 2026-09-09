import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { budgetingApi } from './Budgeting.api';
import { CreateBudgetPayload } from './Budgeting.types';

export const BUDGET_QUERY_KEY = ['finance', 'budgets'];
export const BUDGET_SUMMARY_KEY = ['finance', 'budgets', 'summary'];

export function useDepartmentBudgets(fiscalYear: string = 'FY2026-2027') {
  return useQuery({
    queryKey: [...BUDGET_QUERY_KEY, fiscalYear],
    queryFn: () => budgetingApi.getAllBudgets(fiscalYear)
  });
}

export function useBudgetSummary(fiscalYear: string = 'FY2026-2027') {
  return useQuery({
    queryKey: [...BUDGET_SUMMARY_KEY, fiscalYear],
    queryFn: () => budgetingApi.getBudgetSummary(fiscalYear)
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBudgetPayload) => budgetingApi.createBudget(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BUDGET_SUMMARY_KEY });
    }
  });
}
