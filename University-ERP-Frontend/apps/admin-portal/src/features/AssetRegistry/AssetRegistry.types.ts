import { RegisterAssetPayload, RegisterAssetResponse } from '@university-erp/domain-viewmodels';

export interface AssetRegistryPageProps { }

export interface AssetRecord {
    id: string;
    name: string;
    category: string;
    value: number;
    status: 'Assigned' | 'Available' | 'Maintenance';
}

export type { RegisterAssetPayload, RegisterAssetResponse };
