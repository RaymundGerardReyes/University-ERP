import axios from 'axios';
import { CounselingSessionViewModel } from '@university-erp/domain-viewmodels';

const BASE_URL = 'http://localhost:5000/api/v1/guidance';

export const guidanceApi = {
  getSessions: async (studentId: string): Promise<CounselingSessionViewModel[]> => {
    try {
      const response = await axios.get<CounselingSessionViewModel[]>(`${BASE_URL}/sessions/${studentId}`);
      return response.data;
    } catch {
      return [
        {
          id: 'GC-101',
          counselorName: 'Dr. Emily Vance',
          sessionType: 'Academic & Career',
          date: '2026-08-10',
          time: '11:00 AM',
          meetingLink: 'https://meet.university.edu/gc-101'
        }
      ];
    }
  }
};
