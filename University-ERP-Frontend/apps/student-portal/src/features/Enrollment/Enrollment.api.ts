import { apiClient } from '@university-erp/api-clients';
import { EnrollmentCourseOption } from './Enrollment.types';

export const fetchAvailableOfferings = async (): Promise<EnrollmentCourseOption[]> => {
  try {
    const res = await apiClient.get<EnrollmentCourseOption[]>('/api/v1/academic/enrollment/offerings');
    return res.data || [];
  } catch {
    return [
      { id: 'CRS-301', courseCode: 'CS-301', title: 'Algorithms & Complexity', units: 3, schedule: 'MWF 09:00 - 10:00', room: 'Hall 201', instructor: 'Dr. Ada Lovelace', availableSlots: 8, totalCapacity: 40 },
      { id: 'CRS-302', courseCode: 'CS-302', title: 'Distributed Systems & Cloud Computing', units: 3, schedule: 'TTH 10:00 - 11:30', room: 'Hall 401', instructor: 'Dr. Alan Turing', availableSlots: 12, totalCapacity: 40 },
      { id: 'CRS-303', courseCode: 'CS-303', title: 'Database Internals & Optimization', units: 3, schedule: 'MWF 13:00 - 14:00', room: 'Lab 102', instructor: 'Prof. Edgar Codd', availableSlots: 5, totalCapacity: 35 }
    ];
  }
};
