import { useQuery } from '@tanstack/react-query';
import { fetchStudentProfile } from './StudentProfile.api';

export const useStudentProfile = (studentId?: string) => {
  return useQuery({
    queryKey: ['studentProfile', studentId],
    queryFn: () => fetchStudentProfile(studentId!),
    enabled: !!studentId
  });
};
