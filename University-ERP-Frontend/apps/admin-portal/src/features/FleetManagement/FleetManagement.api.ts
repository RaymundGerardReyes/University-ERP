import { transportApi } from '@university-erp/api-clients';
import { AssignRoutePayload } from '@university-erp/domain-viewmodels';

export const assignVehicleRoute = async (payload: AssignRoutePayload) => {
    return transportApi.assignRoute(payload);
};

// Mock read-model replaced with live backend call
export const fetchFleetStatus = async () => {
    return transportApi.getFleetStatus();
};