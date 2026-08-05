import { canteenApi } from '@university-erp/api-clients';

// Replaced mock read-model with api client call
export const fetchCanteenMetrics = async () => {
    return (canteenApi as any).getCanteenMetrics?.() ?? { 
        activePlans: 0, 
        mealsServedToday: 0, 
        revenueToday: 0, 
        recentOrders: [] 
    };
};