import { apiClient } from '@university-erp/api-clients';
import { FinancialReportDto, RevenueBreakdownDto } from './FinancialReports.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const financialReportsApi = {
  getAllReports: async (): Promise<FinancialReportDto[]> => {
    const response = await apiClient.get<FinancialReportDto[]>('/finance/reports');
    return toSafeArray<FinancialReportDto>(response.data);
  },

  getRevenueBreakdown: async (period?: string): Promise<RevenueBreakdownDto[]> => {
    const response = await apiClient.get<RevenueBreakdownDto[]>('/finance/reports/breakdown', {
      params: period ? { period } : undefined
    });
    return toSafeArray<RevenueBreakdownDto>(response.data);
  },

  getBankStatements: async (): Promise<any> => {
    const response = await apiClient.get<any>('/finance/reports/statements');
    return response.data;
  }
};
