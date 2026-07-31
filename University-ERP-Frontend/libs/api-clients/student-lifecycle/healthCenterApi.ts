import { HealthAppointmentViewModel } from '@university-erp/domain-viewmodels';

export const healthCenterApi = {
  getAppointments: async (studentId: string): Promise<HealthAppointmentViewModel[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([
      {
        id: 'MED-9921',
        doctorName: 'Dr. Sarah Jenkins',
        specialty: 'General Practice',
        date: '2023-11-15',
        time: '14:30',
        status: 'Scheduled'
      }
    ]), 400));
  }
};
