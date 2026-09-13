import { apiClient } from '@university-erp/api-clients';
import { CashierTransactionDto, ProcessCashPaymentPayload } from './Cashier.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const paymentGatewayApi = {
  getQueue: async (): Promise<CashierTransactionDto[]> => {
    const response = await apiClient.get<CashierTransactionDto[]>('/finance/cashier/queue');
    return toSafeArray<CashierTransactionDto>(response.data);
  },

  processPayment: async (payload: ProcessCashPaymentPayload): Promise<void> => {
    await apiClient.post('/finance/cashier/process', payload);
  }
};

export const cashierTerminalApi = paymentGatewayApi;
