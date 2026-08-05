import { inventoryApi } from '@university-erp/api-clients';
import { AdjustStockPayload } from '@university-erp/domain-viewmodels';

export const adjustStockLevels = async (payload: AdjustStockPayload) => {
    return inventoryApi.adjustStock(payload);
};