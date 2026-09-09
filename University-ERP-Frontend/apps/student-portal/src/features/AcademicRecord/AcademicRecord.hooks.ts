import { useMutation, useQuery } from '@tanstack/react-query';
import { academicRecordApi } from './AcademicRecord.api';

export const ACADEMIC_RECORD_KEY = ['student', 'academic-record'];

export function useAcademicRecord(studentId: string) {
  return useQuery({
    queryKey: [...ACADEMIC_RECORD_KEY, studentId],
    queryFn: () => academicRecordApi.getStudentAcademicRecord(studentId),
    enabled: !!studentId
  });
}

export function useRequestTranscript() {
  return useMutation({
    mutationFn: (payload: { studentId: string; purpose: string }) => academicRecordApi.requestTranscript(payload)
  });
}
