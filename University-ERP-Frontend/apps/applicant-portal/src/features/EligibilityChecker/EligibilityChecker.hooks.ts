import { useMutation } from '@tanstack/react-query';
import { checkProgramEligibility } from './EligibilityChecker.api';
import { EligibilityPayload } from './EligibilityChecker.types';

export const useCheckEligibility = () => {
    return useMutation({
        mutationFn: (payload: EligibilityPayload) => checkProgramEligibility(payload),
    });
};