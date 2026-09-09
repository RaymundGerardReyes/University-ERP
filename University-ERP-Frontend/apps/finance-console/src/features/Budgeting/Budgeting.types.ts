export type BudgetStatus = 'ON_TRACK' | 'NEAR_LIMIT' | 'OVER_BUDGET';

export interface DepartmentBudgetDto {
  budgetId: string;
  departmentCode: string;
  departmentName: string;
  fiscalYear: string;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  status: BudgetStatus;
}

export interface CreateBudgetPayload {
  departmentCode: string;
  departmentName: string;
  fiscalYear: string;
  allocatedAmount: number;
}

export interface BudgetSummaryDto {
  fiscalYear: string;
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
}
