import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AssignRoutePayload } from '@university-erp/domain-viewmodels';
import { assignVehicleRoute, fetchFleetStatus } from './FleetManagement.api';

export const useFleetStatus = () => {
    return useQuery({
        queryKey: ['fleetStatus'],
        queryFn: fetchFleetStatus,
    });
};

export const useAssignRoute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: AssignRoutePayload) => assignVehicleRoute(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fleetStatus'] });
        }
    });
};