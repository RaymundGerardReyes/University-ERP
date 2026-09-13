export interface FinanceOverviewKpis {
  totalRevenueCollected: number;
  outstandingReceivables: number;
  pendingClearanceApprovals: number;
  activeScholarshipGrants: number;
  recentTransactionsCount: number;
  todayCashierCollection: number;
}

export interface CashierLedgerEntry {
  id: string;
  orNumber: string;
  payerName: string;
  studentNumber: string;
  paymentType: 'TUITION' | 'LAB_FEE' | 'CLEARANCE' | 'GRADUATION' | 'TRANSCRIPT';
  paymentMethod: 'CASH' | 'ONLINE_GCASH' | 'ONLINE_MAYA' | 'BANK_TRANSFER' | 'CARD';
  amount: number;
  terminalId: string;
  cashierName: string;
  timestamp: string;
}
