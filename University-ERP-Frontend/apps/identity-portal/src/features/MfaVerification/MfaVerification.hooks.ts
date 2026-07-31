import { useMutation } from '@tanstack/react-query';
import { verifyMfaCode } from './MfaVerification.api';

export const useMfaVerification = () => {
  return useMutation({
    mutationFn: verifyMfaCode
  });
};
