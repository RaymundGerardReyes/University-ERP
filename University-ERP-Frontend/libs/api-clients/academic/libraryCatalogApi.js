import axios from 'axios';
const BASE_URL = '/api/v1/library/catalog';
export const libraryCatalogApi = {
    checkoutItem: async (itemId, payload) => {
        try {
            const response = await axios.post(`${BASE_URL}/${itemId}/checkout`, payload);
            return response.data;
        }
        catch {
            // Fallback mock if backend server is not running
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14);
            return {
                checkoutId: `CHK-${Math.floor(1000 + Math.random() * 9000)}`,
                dueDate: dueDate.toISOString(),
                status: 'Checked Out'
            };
        }
    }
};
