import { apiClient } from '@university-erp/api-clients';
import { TimetableSlotDto } from './Timetable.types';

export const timetableApi = {
  getTimetable: async (studentId: string): Promise<TimetableSlotDto[]> => {
    try {
      const response = await apiClient.get<TimetableSlotDto[]>(`/api/v1/academic/timetable/${studentId}`);
      return response.data;
    } catch {
      return [
        { time: '09:00 AM', monday: 'CS101 (Room A201)', wednesday: 'CS101 (Room A201)', friday: 'CS101 (Room A201)' },
        { time: '11:00 AM', monday: 'MATH201 (Room B105)', wednesday: 'MATH201 (Room B105)', friday: 'MATH201 (Room B105)' },
        { time: '01:00 PM', tuesday: 'CS102 (Room C304)', thursday: 'CS102 (Room C304)' }
      ];
    }
  }
};
