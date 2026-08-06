import { useQuery } from '@tanstack/react-query';
import { fetchSubjectCatalog } from './Curriculum.api';

export const useSubjectCatalog = () => {
    return useQuery({
        queryKey: ['registrar', 'subjectCatalog'],
        queryFn: fetchSubjectCatalog
    });
};
