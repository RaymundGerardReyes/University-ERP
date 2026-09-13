export interface GeneratePayslipPayload {
  employeeId: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  payPeriod: string;
}

export interface GeneratePayslipResponse {
  payslipId: string;
  status: string;
  employeeId?: string;
  netPay?: number;
  generatedAt?: string;
}

export interface PayrollProcessingItem {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  payPeriod: string;
  status: 'COMPUTED' | 'DISBURSED' | 'PENDING';
}
