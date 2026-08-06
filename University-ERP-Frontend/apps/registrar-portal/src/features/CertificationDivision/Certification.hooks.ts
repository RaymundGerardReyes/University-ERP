import { useQuery } from '@tanstack/react-query';
import { fetchTranscriptRequests } from './Certification.api';

export const useTranscriptRequests = () => {
    return useQuery({
        queryKey: ['registrar', 'transcriptRequests'],
        queryFn: fetchTranscriptRequests
    });
};
