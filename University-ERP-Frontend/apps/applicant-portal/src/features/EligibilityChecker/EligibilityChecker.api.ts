import { admissionsApi } from '@university-erp/api-clients';
import { EligibilityPayload } from './EligibilityChecker.types';

export const checkProgramEligibility = async (payload: EligibilityPayload) => {
    return admissionsApi.checkEligibility(payload);
};