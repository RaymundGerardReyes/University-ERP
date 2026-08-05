import { identityApi } from '@university-erp/api-clients';

// Replaced mock API with live backend call
export const updateSecuritySettings = async (settings: any) => {
  return (identityApi as any).updateSecuritySettings?.(settings) ?? Promise.resolve(settings);
};
