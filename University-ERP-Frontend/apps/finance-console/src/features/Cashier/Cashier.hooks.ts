import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentGatewayApi } from './Cashier.api';
import { ProcessCashPaymentPayload } from './Cashier.types';

export const CASHIER_TRANSACTIONS_KEY = ['finance', 'cashier-transactions'];

export function useCashierTransactions() {
  return useQuery({
    queryKey: CASHIER_TRANSACTIONS_KEY,
    queryFn: () => paymentGatewayApi.getQueue()
  });
}

export function useProcessCashPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: ProcessCashPaymentPayload) => paymentGatewayApi.processPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CASHIER_TRANSACTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: ['finance', 'dashboard', 'kpis'] }); 
    }
  });
}

export const useCashierTerminal = useCashierTransactions;
