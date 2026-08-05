import axios from 'axios';
import { RoomAllocationViewModel } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/hostel';

export const hostelApi = {
  getAllocation: async (studentId: string): Promise<RoomAllocationViewModel> => {
    try {
      const response = await axios.get<RoomAllocationViewModel>(`${BASE_URL}/allocation/${studentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
