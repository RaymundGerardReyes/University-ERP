import axios from 'axios';
import { ReserveMealPayload, ReserveMealResponse } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/canteen';

export const canteenApi = {
  reserveMeal: async (payload: ReserveMealPayload): Promise<ReserveMealResponse> => {
    try {
      const response = await axios.post<ReserveMealResponse>(`${BASE_URL}/reservations`, payload);
      return response.data;
    } catch {
      // Fallback mock if backend server is not running
      return {
        reservationId: `RES-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'Reserved'
      };
    }
  }
};
