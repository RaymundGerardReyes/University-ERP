import { apiClient } from '../apiClient';

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface PrerequisiteRuleDto {
  id: string;
  requiredCourseCode: string;
  minimumGrade: string;
  isEnforced: boolean;
}

export interface CourseDefinitionDto {
  id: string;
  code: string;
  title: string;
  units: number;
  department: string;
  status: string;
  description: string;
  prerequisites?: PrerequisiteRuleDto[];
}

export interface AcademicProgramDto {
  programId: string;
  code: string;
  name: string;
  college: string;
  totalUnits: number;
  yearsToComplete: number;
  isActive: boolean;
}

export interface CurriculumSubjectDto {
  subjectId: string;
  code: string;
  title: string;
  units: number;
  department: string;
  subjectType: string;   // "Core" | "GE" | "PE" | "NSTP" | "Professional" | "Elective"
  isElective: boolean;
  prerequisiteCodes: string[];
}

export interface CurriculumSemesterDto {
  semester: string;      // "First" | "Second" | "Summer"
  totalUnits: number;
  subjects: CurriculumSubjectDto[];
}

export interface CurriculumYearDto {
  yearLevel: number;
  semesters: CurriculumSemesterDto[];
}

export interface ProgramCurriculumDto {
  curriculumId: string;
  programId: string;
  programCode: string;
  programName: string;
  academicYear: string;
  version: string;
  status: string;
  totalUnits: number;
  years: CurriculumYearDto[];
}

// ─── API Client ───────────────────────────────────────────────────────────────

export const registrarCurriculumApi = {
  /** GET /api/v1/academic/registrar/curriculum/catalog — flat subject catalog */
  getSubjectCatalog: async (): Promise<CourseDefinitionDto[]> => {
    const response = await apiClient.get<CourseDefinitionDto[]>('/academic/registrar/curriculum/catalog');
    return response.data;
  },

  /** GET /api/v1/academic/registrar/curriculum/catalog — alias for backward compatibility */
  getCurriculum: async (): Promise<CourseDefinitionDto[]> => {
    const response = await apiClient.get<CourseDefinitionDto[]>('/academic/registrar/curriculum/catalog');
    return response.data;
  },

  /** GET /api/v1/academic/registrar/curriculum/programs — all academic programs */
  getAllPrograms: async (): Promise<AcademicProgramDto[]> => {
    const response = await apiClient.get<AcademicProgramDto[]>('/academic/registrar/curriculum/programs');
    return response.data;
  },

  /** GET /api/v1/academic/registrar/curriculum/programs/{code} — full year/semester curriculum tree */
  getCurriculumByProgram: async (programCode: string): Promise<ProgramCurriculumDto> => {
    const response = await apiClient.get<ProgramCurriculumDto>(
      `/academic/registrar/curriculum/programs/${encodeURIComponent(programCode)}`
    );
    return response.data;
  },

  /** POST /api/v1/academic/registrar/curriculum/catalog/{courseId} — update subject master data */
  updateMasterData: async (
    courseId: string,
    payload: { title: string; units: number; status: string; description: string }
  ): Promise<boolean> => {
    const response = await apiClient.post(`/academic/registrar/curriculum/catalog/${courseId}`, payload);
    return response.data;
  },

  /** POST /api/v1/academic/registrar/curriculum/prerequisites/{courseId}/{ruleId}/enforcement */
  togglePrerequisite: async (courseId: string, ruleId: string, isEnforced: boolean): Promise<boolean> => {
    const response = await apiClient.post(
      `/academic/registrar/curriculum/prerequisites/${courseId}/${ruleId}/enforcement`,
      isEnforced
    );
    return response.data;
  },
};