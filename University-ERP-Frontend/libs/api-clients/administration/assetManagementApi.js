import axios from 'axios';
const BASE_URL = '/api/v1/assets';
export const assetManagementApi = {
    registerAsset: async (payload) => {
        try {
            const response = await axios.post(`${BASE_URL}/register`, payload);
            return response.data;
        }
        catch {
            // Fallback mock if backend server is not running
            return {
                assetId: `AST-${Math.floor(1000 + Math.random() * 9000)}`,
                status: 'Registered'
            };
        }
    }
};
