export interface PayrollRecordDto {
  payrollId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  payPeriod: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: 'PENDING' | 'PROCESSED' | 'DISBURSED';
  disbursedDate?: string;
}

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
}
