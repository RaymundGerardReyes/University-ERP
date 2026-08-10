import { useMutation, useQuery } from '@tanstack/react-query';
import { registrarApi } from '@university-erp/api-clients';
import { SubjectCatalogItem } from './Curriculum.types';

export const useSubjectCatalog = () => {
    return useQuery<SubjectCatalogItem[]>({
        queryKey: ['subjectCatalog'],
        queryFn: async () => {
            const data = await registrarApi.getSubjectCatalog();
            return data.map((item: any) => ({
                code: item.code,
                title: item.title,
                units: item.units,
                prerequisites: item.prerequisites,
                status: item.status
            }));
        }
    });
};

// Newly added hooks for Phase C
export const useCourses = () => {
    return useQuery<any[]>({
        queryKey: ['courses'],
        queryFn: async () => []
    });
};

export const useUpdatePrerequisite = () => {
    return useMutation({
        mutationFn: async (data: any) => ({ success: true })
    });
};