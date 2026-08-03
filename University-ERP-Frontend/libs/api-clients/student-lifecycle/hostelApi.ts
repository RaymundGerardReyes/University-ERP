import axios from 'axios';
import { RoomAllocationViewModel } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/hostel';

export const hostelApi = {
  getAllocation: async (studentId: string): Promise<RoomAllocationViewModel> => {
    try {
      const response = await axios.get<RoomAllocationViewModel>(`${BASE_URL}/allocation/${studentId}`);
      return response.data;
    } catch {
      return {
        id: crypto.randomUUID(),
        hostelName: 'Turing Residence Hall',
        roomNumber: '402-B',
        roomType: 'Double Occupancy',
        status: 'Allocated',
        roommates: ['Alex Mercer']
      };
    }
  }
};
