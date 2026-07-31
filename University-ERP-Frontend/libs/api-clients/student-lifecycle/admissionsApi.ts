import { ApplicationStatusViewModel } from '@university-erp/domain-viewmodels';

// Mocking until backend is ready
export const admissionsApi = {
  getApplicationStatus: async (studentId: string): Promise<ApplicationStatusViewModel[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([
      {
        id: 'APP-2023-991',
        programName: 'B.Sc. Computer Science',
        status: 'Enrolled',
        submittedDate: '2023-04-12T10:00:00Z',
        missingDocuments: []
      }
    ]), 500));
  }
};
