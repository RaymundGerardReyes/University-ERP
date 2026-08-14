import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assessmentApi } from '@university-erp/api-clients';

export const useGradebook = (sectionId: string) => {
    return useQuery({
        queryKey: ['faculty', 'gradebook', sectionId],
        queryFn: () => assessmentApi.getGradebook(sectionId),
        enabled: !!sectionId
    });
};

export const useSubmitGrades = (sectionId: string) => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (payload: any) => assessmentApi.submitGrades(sectionId, payload),
        onSuccess: () => {
            // Automatically refresh the gradebook data upon successful submission
            queryClient.invalidateQueries({ queryKey: ['faculty', 'gradebook', sectionId] });
            alert("Grades successfully securely submitted to the Registrar.");
        },
        onError: (error) => {
            console.error("Failed to submit grades:", error);
            alert("Failed to submit grades. Please check your connection.");
        }
    });
};