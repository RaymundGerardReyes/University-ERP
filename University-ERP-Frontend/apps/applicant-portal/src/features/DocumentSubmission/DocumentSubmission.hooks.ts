import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@university-erp/auth-sdk';
import { documentSubmissionApi } from './DocumentSubmission.api';
import { UploadDocumentPayload } from './DocumentSubmission.types';

export const useApplicantDocuments = (explicitStudentId?: string) => {
  const { user, identity } = useAuth();
  const studentId = explicitStudentId || user?.id || identity?.id || 'usr-default';

  return useQuery({
    queryKey: ['applicantJourney', studentId],
    queryFn: () => documentSubmissionApi.getApplicantJourney(studentId),
    enabled: Boolean(studentId),
  });
};

export const useUploadDocument = (studentId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UploadDocumentPayload) => documentSubmissionApi.uploadDocument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicantJourney'] });
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
      queryClient.invalidateQueries({ queryKey: ['admissionStatus'] });
      queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
      queryClient.invalidateQueries({ queryKey: ['academic'] });
    },
  });
};

// Backwards compatibility alias
export const useDocumentUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appId, data }: { appId: string; data: { documentName: string; filePath: string } }) =>
      documentSubmissionApi.uploadDocument({ applicationId: appId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicantJourney'] });
    },
  });
};