import axios from 'axios';
import { CreatePurchaseOrderPayload, CreatePurchaseOrderResponse } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/procurement';

export const procurementApi = {
  createPurchaseOrder: async (payload: CreatePurchaseOrderPayload): Promise<CreatePurchaseOrderResponse> => {
    try {
      const response = await axios.post<CreatePurchaseOrderResponse>(`${BASE_URL}/orders`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
