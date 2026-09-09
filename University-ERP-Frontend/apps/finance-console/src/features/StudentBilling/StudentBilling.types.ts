export interface StudentBillingDto {
  id: string;
  studentId: string;
  totalAmount: number;
  paidAmount: number;
  outstandingBalance: number;
  description: string;
  status: string;
  issuedOnUtc: string;
}
