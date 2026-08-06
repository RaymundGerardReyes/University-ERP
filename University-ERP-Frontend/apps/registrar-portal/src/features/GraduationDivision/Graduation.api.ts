import { registrarApi } from '@university-erp/api-clients';
import { GraduationWorkflow } from '@university-erp/workflow-sdk';

export const fetchGraduationCandidates = async () => {
    return registrarApi.getGraduationCandidates();
};

export const evaluateCandidate = async (studentId: string) => {
    return GraduationWorkflow.advance(studentId, 'CandidateEvaluation');
};
