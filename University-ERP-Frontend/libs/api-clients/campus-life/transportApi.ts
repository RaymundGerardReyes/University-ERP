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
    } catch {
      // Fallback mock if backend server is not running
      return {
        assignmentId: `ASG-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Assigned'
      };
    }
  }
};
