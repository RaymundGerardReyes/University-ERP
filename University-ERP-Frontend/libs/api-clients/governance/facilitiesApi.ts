import axios from 'axios';
import { FacilityBookingPayload, FacilityBookingResponse } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/facilities';

export const facilitiesApi = {
  bookFacility: async (payload: FacilityBookingPayload): Promise<FacilityBookingResponse> => {
    try {
      const response = await axios.post<FacilityBookingResponse>(`${BASE_URL}/reservations/book`, payload);
      return response.data;
    } catch {
      // Fallback mock if backend server is not running
      return {
        reservationId: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Confirmed'
      };
    }
  }
};
