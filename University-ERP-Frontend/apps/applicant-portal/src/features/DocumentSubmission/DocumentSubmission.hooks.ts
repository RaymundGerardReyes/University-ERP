import { useMutation } from '@tanstack/react-query';
import { uploadApplicantDocument } from './DocumentSubmission.api';

export const useDocumentUpload = () => {
    return useMutation({
        mutationFn: ({ appId, data }: { appId: string, data: { documentName: string, filePath: string } }) =>
            uploadApplicantDocument(appId, data),
    });
};