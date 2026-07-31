// Mock API for SecuritySettings
export const updateSecuritySettings = async (settings: any) => {
  return new Promise((resolve) => setTimeout(() => resolve(settings), 500));
};
