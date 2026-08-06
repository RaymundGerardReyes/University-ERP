import { registrarApi } from '@university-erp/api-clients';
import { AcademicRecordWorkflow } from '@university-erp/workflow-sdk';

export const fetchOfficialGrades = async () => {
    return registrarApi.getOfficialGrades();
};

export const lockSectionGrades = async (sectionId: string) => {
    return AcademicRecordWorkflow.process(sectionId, 'SubmitGrades');
};
