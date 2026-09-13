import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { registrarCurriculumApi } from '@university-erp/api-clients';

// ─── Programs & Curriculum Plans ──────────────────────────────────────────────

export const useAllPrograms = () => {
    return useQuery({
        queryKey: ['curriculum', 'programs'],
        queryFn: () => registrarCurriculumApi.getAllPrograms(),
    });
};

export const useProgramCurriculum = (programCode: string | null) => {
    return useQuery({
        queryKey: ['curriculum', 'programs', programCode],
        queryFn: () => registrarCurriculumApi.getCurriculumByProgram(programCode!),
        enabled: !!programCode,
    });
};

// ─── Subject Catalog ──────────────────────────────────────────────────────────

export const useSubjectCatalog = () => {
    return useQuery({
        queryKey: ['curriculum', 'catalog'],
        queryFn: () => registrarCurriculumApi.getSubjectCatalog(),
    });
};

export const useCourses = () => {
    return useQuery({
        queryKey: ['curriculum', 'catalog'],
        queryFn: () => registrarCurriculumApi.getSubjectCatalog(),
    });
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useUpdatePrerequisite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ courseId, ruleId, isEnforced }: { courseId: string; ruleId: string; isEnforced: boolean }) =>
            registrarCurriculumApi.togglePrerequisite(courseId, ruleId, isEnforced),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['curriculum'] });
        },
    });
};

export const useUpdateMasterData = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ courseId, payload }: { courseId: string; payload: { title: string; units: number; status: string; description: string } }) =>
            registrarCurriculumApi.updateMasterData(courseId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['curriculum'] });
        },
    });
};