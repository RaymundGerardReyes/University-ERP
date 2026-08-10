import { useQuery } from '@tanstack/react-query';
import { curriculumProgressApi } from './CurriculumProgress.api';

export const useCurriculumProgress = (studentId: string) => {
    return useQuery({
        queryKey: ['student', studentId, 'curriculum-progress'],
        queryFn: () => curriculumProgressApi.getProgress(studentId),
        enabled: !!studentId
    });
};
