import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RegisterAssetPayload } from '@university-erp/domain-viewmodels';
import { fetchAssetInventory, registerNewAsset } from './AssetRegistry.api';

export const useAssetInventory = () => {
    return useQuery({
        queryKey: ['assetInventory'],
        queryFn: fetchAssetInventory,
    });
};

export const useRegisterAsset = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: RegisterAssetPayload) => registerNewAsset(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assetInventory'] });
        }
    });
};