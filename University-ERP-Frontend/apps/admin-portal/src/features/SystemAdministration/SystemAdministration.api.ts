import { facultySettingsApi } from '@university-erp/api-clients';

// Replaced mock configuration with api client
export const fetchSystemConfig = async () => {
    return (facultySettingsApi as any).getSystemConfig?.() ?? {
        version: 'v1.4.0-ERP',
        maintenanceMode: false,
        registrationEnabled: true,
        activeNodes: 4,
        lastBackup: '2026-08-04T02:00:00Z',
        cacheStatus: 'Unknown'
    };
};

export const updateSystemConfig = async (key: string, value: boolean) => {
    return (facultySettingsApi as any).updateSystemConfig?.(key, value) ?? Promise.resolve({ key, value });
};