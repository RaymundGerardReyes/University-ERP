import { CounselingSessionViewModel } from '@university-erp/domain-viewmodels';

export const guidanceApi = {
  getSessions: async (studentId: string): Promise<CounselingSessionViewModel[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([
      {
        id: 'C-8812',
        counselorName: 'Prof. Alan Turing',
        sessionType: 'Academic',
        date: '2023-10-05',
        time: '10:00',
        meetingLink: 'https://meet.university.edu/c-8812',
        status: 'Completed'
      }
    ]), 500));
  }
};
