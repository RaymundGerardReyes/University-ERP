import { useMutation } from '@tanstack/react-query';
import { updateSecuritySettings } from './SecuritySettings.api';
export const useSecuritySettings = () => {
    return useMutation({
        mutationFn: updateSecuritySettings
    });
};
