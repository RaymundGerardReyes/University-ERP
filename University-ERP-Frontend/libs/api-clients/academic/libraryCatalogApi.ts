import axios from 'axios';
import { CheckoutItemPayload, CheckoutItemResponse } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/library/catalog';

export const libraryCatalogApi = {
  checkoutItem: async (itemId: string, payload: CheckoutItemPayload): Promise<CheckoutItemResponse> => {
    try {
      const response = await axios.post<CheckoutItemResponse>(`${BASE_URL}/${itemId}/checkout`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
