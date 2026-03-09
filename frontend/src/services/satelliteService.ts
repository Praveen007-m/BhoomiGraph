import api from './api';

export const satelliteService = {
    storeNDVI: async (data: any) => {
        const response = await api.post('/satellite', data);
        return response.data;
    },

    getNDVI: async (farmId: string) => {
        const response = await api.get(`/satellite/${farmId}`);
        return response.data;
    }
};
