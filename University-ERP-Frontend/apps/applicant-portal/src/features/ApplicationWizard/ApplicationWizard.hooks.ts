import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchProgramCatalog, submitNewApplication } from './ApplicationWizard.api';

export const useProgramCatalog = () => {
    return useQuery({
        queryKey: ['programCatalog'],
        queryFn: fetchProgramCatalog,
    });
};

export const useSubmitApplication = () => {
    return useMutation({
        mutationFn: (data: any) => submitNewApplication(data),
    });
};