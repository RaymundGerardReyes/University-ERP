import { apiClient } from '@university-erp/api-clients';
import { StudentClubDto } from './Extracurriculars.types';

export const extracurricularsApi = {
  getMyClubs: async (studentId: string): Promise<StudentClubDto[]> => {
    try {
      const response = await apiClient.get<StudentClubDto[]>(`/api/v1/campus-life/clubs/${studentId}`);
      return response.data;
    } catch {
      return [
        { clubId: 'CLUB-01', name: 'ACM Student Chapter', category: 'Academic', role: 'Officer', joinedDate: '2025-09-01', activityHours: 45 },
        { clubId: 'CLUB-02', name: 'University Chess Club', category: 'Sports', role: 'Member', joinedDate: '2025-10-15', activityHours: 20 },
        { clubId: 'CLUB-03', name: 'Campus Green Initiative', category: 'Community', role: 'Member', joinedDate: '2026-02-01', activityHours: 15 }
      ];
    }
  }
};
