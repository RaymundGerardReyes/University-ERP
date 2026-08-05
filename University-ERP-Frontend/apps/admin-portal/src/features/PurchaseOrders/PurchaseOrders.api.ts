import { procurementApi } from '@university-erp/api-clients';
import { CreatePurchaseOrderPayload } from '@university-erp/domain-viewmodels';

export const submitPurchaseOrder = async (payload: CreatePurchaseOrderPayload) => {
    return procurementApi.createPurchaseOrder(payload);
};

// Replace mock read-model with live procurementApi call
export const fetchRecentOrders = async () => {
    // Currently relying on backend integration to implement getPurchaseOrders.
    // If it doesn't exist, this will gracefully error into TanStack Query boundary.
    return (procurementApi as any).getPurchaseOrders?.() ?? [];
};