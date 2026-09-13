import { apiClient } from '@university-erp/api-clients';
import { BudgetSummaryDto, CreateBudgetPayload, DepartmentBudgetDto } from './Budgeting.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const budgetingApi = {
  getAllBudgets: async (fiscalYear: string = 'FY2026-2027'): Promise<DepartmentBudgetDto[]> => {
    const response = await apiClient.get<DepartmentBudgetDto[]>('/finance/budgets', {
      params: { fiscalYear },
    });
    return toSafeArray<DepartmentBudgetDto>(response.data);
  },

  getBudgetSummary: async (fiscalYear: string = 'FY2026-2027'): Promise<BudgetSummaryDto> => {
    const response = await apiClient.get<BudgetSummaryDto>('/finance/budgets/summary', {
      params: { fiscalYear },
    });
    return response.data;
  },

  createBudget: async (payload: CreateBudgetPayload): Promise<DepartmentBudgetDto> => {
    const response = await apiClient.post<DepartmentBudgetDto>('/finance/budgets', payload);
    return response.data;
  },
};
