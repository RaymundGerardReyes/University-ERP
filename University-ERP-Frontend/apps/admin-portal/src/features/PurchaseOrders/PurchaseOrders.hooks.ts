import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreatePurchaseOrderPayload } from '@university-erp/domain-viewmodels';
import { fetchRecentOrders, submitPurchaseOrder } from './PurchaseOrders.api';

export const useRecentOrders = () => {
    return useQuery({
        queryKey: ['recentPurchaseOrders'],
        queryFn: fetchRecentOrders,
    });
};

export const useCreatePurchaseOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreatePurchaseOrderPayload) => submitPurchaseOrder(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recentPurchaseOrders'] });
        }
    });
};