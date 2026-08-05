import { useMutation } from '@tanstack/react-query';
import { AdjustStockPayload } from '@university-erp/domain-viewmodels';
import { adjustStockLevels } from './StockManagement.api';

export const useAdjustStock = () => {
    return useMutation({
        mutationFn: (payload: AdjustStockPayload) => adjustStockLevels(payload),
    });
};