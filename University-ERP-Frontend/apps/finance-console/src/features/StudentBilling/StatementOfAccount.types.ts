export interface StudentAccountSummary {
  studentId: string;
  studentNumber: string;
  studentName: string;
  program: string;
  yearLevel: number;
  currentBalance: number;
  totalAssessed: number;
  totalPaid: number;
  totalDiscount: number;
  clearanceStatus: 'CLEARED' | 'HOLD' | 'DELINQUENT';
  lastPaymentDate?: string;
}

export interface StatementLedgerItem {
  id: string;
  date: string;
  term: string;
  description: string;
  referenceNo: string;
  type: 'ASSESSMENT' | 'PAYMENT' | 'DISCOUNT' | 'ADJUSTMENT' | 'PENALTY';
  debit: number;   // Amount charged
  credit: number;  // Amount paid / credited
  runningBalance: number;
}

export interface StatementOfAccountDetail {
  student: StudentAccountSummary;
  ledger: StatementLedgerItem[];
  paymentSchedules: {
    term: string;
    dueDate: string;
    amount: number;
    status: 'PAID' | 'DUE' | 'OVERDUE';
  }[];
}

