import api from './api';

export const droneService = {
    createProject: async (data: any) => {
        const response = await api.post('/drones', data);
        return response.data;
    },

    getProjects: async () => {
        const response = await api.get('/drones');
        return response.data;
    }
};
