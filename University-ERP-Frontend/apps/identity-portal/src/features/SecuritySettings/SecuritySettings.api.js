// Mock API for SecuritySettings
export const updateSecuritySettings = async (settings) => {
    return new Promise((resolve) => setTimeout(() => resolve(settings), 500));
};
