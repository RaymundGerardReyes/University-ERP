import { useQuery } from '@tanstack/react-query';
import { fetchAcademicPrograms, fetchCurriculumByProgram } from './ProgramExplorer.api';

export const useProgramCatalog = () => {
    return useQuery({
        queryKey: ['academicPrograms'],
        queryFn: fetchAcademicPrograms,
    });
};

/** Fetch rich curriculum tree (Year → Semester → Subjects) for a given program code.
 *  Only fetches when programCode is non-empty (lazy: user opens the curriculum modal). */
export const useProgramCurriculum = (programCode: string | null) => {
    return useQuery({
        queryKey: ['curriculum', 'programs', programCode],
        queryFn: () => fetchCurriculumByProgram(programCode!),
        enabled: !!programCode,
    });
};