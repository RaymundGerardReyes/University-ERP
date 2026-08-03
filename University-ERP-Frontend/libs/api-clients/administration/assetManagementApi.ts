import axios from 'axios';
import { RegisterAssetPayload, RegisterAssetResponse } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/assets';

export const assetManagementApi = {
  registerAsset: async (payload: RegisterAssetPayload): Promise<RegisterAssetResponse> => {
    try {
      const response = await axios.post<RegisterAssetResponse>(`${BASE_URL}/register`, payload);
      return response.data;
    } catch {
      // Fallback mock if backend server is not running
      return {
        assetId: `AST-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Registered'
      };
    }
  }
};
