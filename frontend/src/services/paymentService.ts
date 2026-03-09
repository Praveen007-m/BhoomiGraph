import api from './api';

export const paymentService = {
    getHistory: async () => {
        const response = await api.get('/payments/history');
        return response.data;
    },

    createOrder: async (amount: number) => {
        const response = await api.post('/payments/create-order', { amount });
        return response.data;
    },

    verifyPayment: async (paymentData: any) => {
        const response = await api.post('/payments/verify', paymentData);
        return response.data;
    },

    getAllPayments: async () => {
        const response = await api.get('/payments');
        return response.data;
    }
};
