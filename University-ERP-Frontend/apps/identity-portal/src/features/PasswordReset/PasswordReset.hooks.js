import { useMutation } from '@tanstack/react-query';
import { requestPasswordReset } from './PasswordReset.api';
export const usePasswordReset = () => {
    return useMutation({
        mutationFn: requestPasswordReset
    });
};
