import axios from 'axios';
import { HealthAppointmentViewModel } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/health';

export const healthCenterApi = {
  getAppointments: async (studentId: string): Promise<HealthAppointmentViewModel[]> => {
    try {
      const response = await axios.get<HealthAppointmentViewModel[]>(`${BASE_URL}/appointments/${studentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
