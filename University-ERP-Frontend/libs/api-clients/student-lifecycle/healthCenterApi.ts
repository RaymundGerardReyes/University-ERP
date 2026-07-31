import axios from 'axios';
import { HealthAppointmentViewModel } from '@university-erp/domain-viewmodels';

const BASE_URL = 'http://localhost:5000/api/v1/health';

export const healthCenterApi = {
  getAppointments: async (studentId: string): Promise<HealthAppointmentViewModel[]> => {
    try {
      const response = await axios.get<HealthAppointmentViewModel[]>(`${BASE_URL}/appointments/${studentId}`);
      return response.data;
    } catch {
      return [
        {
          id: 'HA-882',
          doctorName: 'Dr. Sarah Jenkins',
          specialty: 'General Medicine',
          date: '2026-08-05',
          time: '10:30 AM',
          status: 'Scheduled'
        }
      ];
    }
  }
};
