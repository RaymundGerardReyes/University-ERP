import { useMutation } from '@tanstack/react-query';
import { submitRegistration } from './UserRegistration.api';
export const useUserRegistration = () => {
    return useMutation({
        mutationFn: submitRegistration
    });
};
