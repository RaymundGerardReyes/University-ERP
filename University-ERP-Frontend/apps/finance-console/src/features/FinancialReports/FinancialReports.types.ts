export interface FinancialReportDto {
  reportId: string;
  reportName: string;
  period: string;
  generatedDate: string;
  totalRevenue: number;
  totalExpenditure: number;
  netMargin: number;
  status: 'Audited' | 'Draft' | 'Final';
}

export interface RevenueBreakdownDto {
  category: string;
  amount: number;
  percentage: number;
}
