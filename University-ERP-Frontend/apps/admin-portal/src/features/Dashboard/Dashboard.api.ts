import { identityApi } from '@university-erp/api-clients';

// Mock aggregation endpoint for Admin overview
export const fetchAdminDashboardMetrics = async () => {
    const sessions = await identityApi.getSessions();
    return {
        activeSessions: Array.isArray(sessions) ? sessions.length : 142,
        systemUptime: '99.99%',
        pendingApprovals: 8,
        activeAlerts: 1
    };
};