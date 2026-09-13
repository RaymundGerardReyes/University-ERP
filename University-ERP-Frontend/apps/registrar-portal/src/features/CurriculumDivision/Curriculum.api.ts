import { registrarCurriculumApi } from '@university-erp/api-clients';

export const curriculumApi = {
    getAllPrograms: () => registrarCurriculumApi.getAllPrograms(),
    getCurriculumByProgram: (programCode: string) => registrarCurriculumApi.getCurriculumByProgram(programCode),
    getSubjectCatalog: () => registrarCurriculumApi.getSubjectCatalog(),
    updateMasterData: (courseId: string, payload: { title: string; units: number; status: string; description: string }) =>
        registrarCurriculumApi.updateMasterData(courseId, payload),
    togglePrerequisite: (courseId: string, ruleId: string, isEnforced: boolean) =>
        registrarCurriculumApi.togglePrerequisite(courseId, ruleId, isEnforced),
};