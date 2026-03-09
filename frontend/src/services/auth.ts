import api from './api';
import { queryClient } from '../lib/queryClient';

export const authService = {
    login: async (credentials: any) => {
        const response = await api.post('/auth/login', credentials);


        // ✅ Store token directly without conditional check
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        return response.data;
    },

    register: async (userData: any) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    sendOtp: async (mobile: string) => {
        const response = await api.post('/auth/send-otp', { mobile });
        return response.data;
    },

    verifyOtp: async (mobile: string, otp: string) => {
        const response = await api.post('/auth/verify-otp', { mobile, otp });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            if (response.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        // ✅ FIX: Clear storage first, then let caller handle navigation
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        queryClient.clear();
        // NOTE: Navigation is now handled by the calling component (Topbar/ProtectedRoute)
        // This prevents double navigation and redirect loops
    },

    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return null;
            return JSON.parse(userStr);
        } catch (error) {
            console.error("Invalid user in localStorage", error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            return null;
        }
    },
};
