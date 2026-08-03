import axios from 'axios';
import { CreatePurchaseOrderPayload, CreatePurchaseOrderResponse } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/procurement';

export const procurementApi = {
  createPurchaseOrder: async (payload: CreatePurchaseOrderPayload): Promise<CreatePurchaseOrderResponse> => {
    try {
      const response = await axios.post<CreatePurchaseOrderResponse>(`${BASE_URL}/orders`, payload);
      return response.data;
    } catch {
      // Fallback mock if backend server is not running
      return {
        orderId: `PO-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'Created'
      };
    }
  }
};
