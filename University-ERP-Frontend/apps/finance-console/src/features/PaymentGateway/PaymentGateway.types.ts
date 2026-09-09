export interface GatewayTransaction {
  id: string;
  studentId: string;
  referenceNo: string;
  amount: number;
  method: 'CreditCard' | 'OnlineBanking' | 'EWallet' | 'CashierOTC';
  status: 'Settled' | 'Processing' | 'Failed';
  settledAt: string;
}
