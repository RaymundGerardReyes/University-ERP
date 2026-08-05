import axios from 'axios';
import { OnboardEmployeePayload, OnboardEmployeeResponse } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/hr';

export const hrApi = {
  onboardEmployee: async (payload: OnboardEmployeePayload): Promise<OnboardEmployeeResponse> => {
    try {
      const response = await axios.post<OnboardEmployeeResponse>(`${BASE_URL}/employees/onboard`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
