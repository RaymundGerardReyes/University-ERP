import { RoomAllocationViewModel } from '@university-erp/domain-viewmodels';

export const hostelApi = {
  getAllocation: async (studentId: string): Promise<RoomAllocationViewModel | null> => {
    return new Promise((resolve) => setTimeout(() => resolve({
      id: 'ALLOC-7721',
      hostelName: 'Turing Hall (North Block)',
      roomNumber: 'N-402',
      roomType: 'Double Occupancy',
      roommates: ['John Smith (STD-2023-112)'],
      status: 'Allocated'
    }), 600));
  }
};
