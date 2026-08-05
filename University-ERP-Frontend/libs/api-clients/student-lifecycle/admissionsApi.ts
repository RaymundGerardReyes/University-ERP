import axios from 'axios';
import { ApplicationStatusViewModel } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/admissions';

export const admissionsApi = {
  getApplicationStatus: async (studentId: string): Promise<ApplicationStatusViewModel[]> => {
    try {
      const response = await axios.get<ApplicationStatusViewModel[]>(`${BASE_URL}/status/${studentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getApplicantJourney: async (studentId: string): Promise<any> => {
    try {
      const response = await axios.get(`${BASE_URL}/applications/journey/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch applicant journey', error);
      throw error;
    }
  },

  submitApplication: async (data: any): Promise<string> => {
    try {
      const response = await axios.post(`${BASE_URL}/applications`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to submit application', error);
      throw error;
    }
  },

  uploadDocument: async (applicationId: string, data: { documentName: string, filePath: string }): Promise<boolean> => {
    try {
      const response = await axios.post(`${BASE_URL}/applications/${applicationId}/documents`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to upload document', error);
      throw error;
    }
  },

  getProgramCatalog: async (): Promise<any[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/programs`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch programs', error);
      throw error;
    }
  },

  checkEligibility: async (data: any): Promise<any> => {
    try {
      const response = await axios.post(`${BASE_URL}/eligibility`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to check eligibility', error);
      throw error;
    }
  }
};
