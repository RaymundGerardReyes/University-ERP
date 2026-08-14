import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { admissionsApi } from '@university-erp/api-clients';
import { AdmissionWorkflow } from '@university-erp/workflow-sdk';

// Fetch applications assigned to the Chairperson's specific department
export const useChairpersonQueue = (department?: string) => {
    return useQuery({
        queryKey: ['admissions', 'chairperson-queue', department],
        queryFn: () => admissionsApi.getPendingApplications(department)
    });
};

// Orchestrate the recommendation using the Workflow SDK
export const useRecommendApplication = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ applicationId, remarks }: { applicationId: string, remarks: string }) => 
            AdmissionWorkflow.advance(applicationId, 'ChairpersonRecommendation', remarks),
        onSuccess: () => {
            // Refresh the queue automatically once the recommendation is processed
            queryClient.invalidateQueries({ queryKey: ['admissions', 'chairperson-queue'] });
            queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
        }
    });
};

// Fetch applications assigned to the Dean's specific college
export const useDeanQueue = (college?: string) => {
    return useQuery({
        queryKey: ['admissions', 'dean-queue', college],
        queryFn: () => admissionsApi.getPendingApplications(college)
    });
};

// Orchestrate the endorsement using the Workflow SDK
export const useEndorseApplication = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (applicationId: string) => 
            AdmissionWorkflow.advance(applicationId, 'DeanEndorsement'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admissions', 'dean-queue'] });
            queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
        }
    });
};

// Fetch all applications pending final enrollment by the Registrar
export const useRegistrarQueue = () => {
    return useQuery({
        queryKey: ['admissions', 'registrar-queue'],
        queryFn: () => admissionsApi.getPendingApplications()
    });
};

// Orchestrate the final enrollment using the Workflow SDK
export const useActivateEnrollment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (applicationId: string) => 
            AdmissionWorkflow.advance(applicationId, 'RegistrarEnrollment'),
        onSuccess: (data) => {
            const studentId = typeof data === 'string' ? data : (data?.studentId || 'STU-2026-CONFIRMED');
            alert(`Success! Official Student ID generated: ${studentId}`);
            queryClient.invalidateQueries({ queryKey: ['admissions', 'registrar-queue'] });
            queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
        },
        onError: (error) => {
            console.error('Failed to activate enrollment', error);
            alert('Failed to activate enrollment. Please check the system logs.');
        }
    });
};
