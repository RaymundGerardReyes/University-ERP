import { useQuery } from '@tanstack/react-query';
import { fetchAcademicPrograms } from './ProgramExplorer.api';

export const useProgramCatalog = () => {
    return useQuery({
        queryKey: ['academicPrograms'],
        queryFn: fetchAcademicPrograms,
    });
};