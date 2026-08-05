import { CreatePurchaseOrderPayload, CreatePurchaseOrderResponse } from '@university-erp/domain-viewmodels';

export interface PurchaseOrdersPageProps { }

export interface PurchaseOrderRecord {
    id: string;
    vendor: string;
    total: number;
    status: 'Approved' | 'Pending' | 'Created';
    date: string;
}

export type { CreatePurchaseOrderPayload, CreatePurchaseOrderResponse };
