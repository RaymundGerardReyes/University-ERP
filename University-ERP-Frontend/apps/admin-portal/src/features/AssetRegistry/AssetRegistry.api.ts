import { assetManagementApi } from '@university-erp/api-clients';
import { RegisterAssetPayload } from '@university-erp/domain-viewmodels';

export const registerNewAsset = async (payload: RegisterAssetPayload) => {
    return assetManagementApi.registerAsset(payload);
};

// Read-model mock for the UI data-grid
export const fetchAssetInventory = async () => {
    return [
        { id: 'AST-9021', name: 'MacBook Pro M3', category: 'IT Equipment', value: 2400, status: 'Assigned' },
        { id: 'AST-9022', name: 'Spectrometer X1', category: 'Lab Equipment', value: 15500, status: 'Available' },
        { id: 'AST-9023', name: 'Cisco Core Switch', category: 'Network Infrastructure', value: 8200, status: 'Maintenance' },
    ];
};