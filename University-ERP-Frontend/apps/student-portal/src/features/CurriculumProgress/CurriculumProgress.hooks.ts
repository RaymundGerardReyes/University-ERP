import { useQuery } from '@tanstack/react-query';
import { curriculumProgressApi } from './CurriculumProgress.api';
import { registrarCurriculumApi } from '@university-erp/api-clients';

/** Fetches student's curriculum progress metrics (credits, GPA, graduation eligibility) */
export const useCurriculumProgress = (studentId: string) => {
    return useQuery({
        queryKey: ['student', studentId, 'curriculum-progress'],
        queryFn: () => curriculumProgressApi.getProgress(studentId),
        enabled: !!studentId,
    });
};

/** Fetches the full structured curriculum for a program.
 *  Pass the student's enrolled program code (e.g., "BSCS"). */
export const useStudentProgramCurriculum = (programCode: string | null) => {
    return useQuery({
        queryKey: ['curriculum', 'programs', programCode],
        queryFn: () => registrarCurriculumApi.getCurriculumByProgram(programCode!),
        enabled: !!programCode,
        staleTime: 5 * 60 * 1000,  // curriculum structure rarely changes
    });
};
