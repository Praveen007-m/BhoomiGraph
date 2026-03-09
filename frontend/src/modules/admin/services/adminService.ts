import api from '@/services/api';

export const adminService = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data.data;
    },

    getRevenue: async () => {
        const response = await api.get('/admin/revenue');
        return response.data.data ?? [];
    },

    getUsers: async (filters: any = {}) => {
        const response = await api.get('/admin/users', { params: filters });
        return response.data.data ?? [];
    },

    getFarms: async (filters: any = {}) => {
        const response = await api.get('/admin/farms', { params: filters });
        return response.data.data ?? [];
    },

    getBookings: async (filters: any = {}) => {
        const response = await api.get('/admin/bookings', { params: filters });
        return response.data.data ?? [];
    },

    getSensors: async () => {
        const response = await api.get('/iot');
        return response.data.data ?? [];
    },

    getPilots: async () => {
        const response = await api.get('/admin/pilots');
        return response.data.data ?? [];
    },

    getCrops: async () => {
        const response = await api.get('/admin/crops');
        return response.data.data ?? [];
    },

    getContent: async () => {
        const response = await api.get('/admin/content');
        return response.data.data ?? [];
    },

    updateUserRole: async (userId: string, role: string) => {
        const response = await api.put(`/admin/users/${userId}/role`, { role });
        return response.data.data;
    },

    verifyFarm: async (farmId: string, status: string) => {
        const response = await api.put(`/admin/farms/${farmId}/status`, { status });
        return response.data.data;
    },
};
