import { AssignRoutePayload, AssignRouteResponse } from '@university-erp/domain-viewmodels';

export interface FleetManagementPageProps { }

export interface VehicleRecord {
    id: string;
    route: string;
    driver: string;
    capacity: number;
    status: 'Idle' | 'In Transit' | 'Maintenance';
}

export type { AssignRoutePayload, AssignRouteResponse };
