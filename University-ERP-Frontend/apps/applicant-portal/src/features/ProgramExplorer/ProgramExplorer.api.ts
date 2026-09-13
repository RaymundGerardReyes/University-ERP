import { admissionsApi, registrarCurriculumApi, ProgramCurriculumDto } from '@university-erp/api-clients';

export const fetchAcademicPrograms = async () => {
    return admissionsApi.getProgramCatalog();
};

/** Fetch full structured curriculum (Year → Semester → Subjects) for a specific program code */
export const fetchCurriculumByProgram = async (programCode: string): Promise<ProgramCurriculumDto> => {
    return registrarCurriculumApi.getCurriculumByProgram(programCode);
};