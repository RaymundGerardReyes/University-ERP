import { assessmentApi } from '@university-erp/api-clients';

export const fetchClassGradebook = async (sectionId: string) => {
    return assessmentApi.getGradebook(sectionId);
};

export const submitSectionGrades = async (sectionId: string, payload: any) => {
    return assessmentApi.submitGrades(sectionId, payload);
};