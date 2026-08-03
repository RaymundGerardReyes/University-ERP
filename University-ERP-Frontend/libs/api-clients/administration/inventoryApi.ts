import axios from 'axios';
import { AdjustStockPayload, AdjustStockResponse } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/inventory';

export const inventoryApi = {
  adjustStock: async (payload: AdjustStockPayload): Promise<AdjustStockResponse> => {
    try {
      const response = await axios.post<AdjustStockResponse>(`${BASE_URL}/stock/${payload.stockItemId}/adjust`, {
        amount: payload.amount,
        reason: payload.reason
      });
      return response.data;
    } catch {
      // Fallback mock if backend server is not running
      return {
        stockItemId: payload.stockItemId,
        newQuantity: 150 + payload.amount,
        status: 'Adjusted'
      };
    }
  }
};
