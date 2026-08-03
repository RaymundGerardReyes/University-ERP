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

export interface IssueInvoicePayload {
  studentId: string;
  amount: number;
  description: string;
}

export interface IssueInvoiceResponse {
  invoiceId: string;
  status: string;
}
