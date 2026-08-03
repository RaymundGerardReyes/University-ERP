import { useMutation } from '@tanstack/react-query';
import { submitLogin } from './UserLogin.api';
export const useUserLogin = () => {
    return useMutation({
        mutationFn: submitLogin
    });
};
