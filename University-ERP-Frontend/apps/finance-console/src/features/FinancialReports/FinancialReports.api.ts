import { apiClient } from '@university-erp/api-clients';
import { FinancialReportDto, RevenueBreakdownDto } from './FinancialReports.types';

export const financialReportsApi = {
  getAllReports: async (): Promise<FinancialReportDto[]> => {
    const response = await apiClient.get<FinancialReportDto[]>('/api/v1/finance/reports');
    return response.data;
  },

  getRevenueBreakdown: async (period?: string): Promise<RevenueBreakdownDto[]> => {
    const response = await apiClient.get<RevenueBreakdownDto[]>('/api/v1/finance/reports/breakdown', {
      params: period ? { period } : undefined
    });
    return response.data;
  }
};
