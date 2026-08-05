import axios from 'axios';
import { AssignRoutePayload, AssignRouteResponse } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/transport';

export const transportApi = {
  assignRoute: async (payload: AssignRoutePayload): Promise<AssignRouteResponse> => {
    try {
      const response = await axios.post<AssignRouteResponse>(`${BASE_URL}/routes/${payload.routeId}/assign`, {
        driverId: payload.driverId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getFleetStatus: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/status`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
