import axios, { AxiosHeaders } from 'axios';
import { toast } from "sonner";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

/* ===========================
   REQUEST INTERCEPTOR
=========================== */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            if (!config.headers) {
                config.headers = new AxiosHeaders();
            }

            config.headers.set('Authorization', `Bearer ${token}`);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

import { queryClient } from '../lib/queryClient';

// ✅ FIX: Global flag to prevent redirect loops
let isRedirecting = false;

/* ===========================
   RESPONSE INTERCEPTOR
=========================== */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;
        const status = response?.status;
        const currentPath = window.location.pathname;

        if (status === 401) {
            // ✅ Unauthorized: Clear session and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            queryClient.clear();

            // ✅ Only redirect if not already on auth page and not currently redirecting
            const isOnAuthPage = currentPath.startsWith('/auth');
            
            if (!isOnAuthPage && !isRedirecting) {
                isRedirecting = true;
                toast.error("Session expired. Please login again.");
                
                // Use window.location.replace to prevent back button issues
                window.location.replace('/auth');
                
                // Reset flag after a delay to allow re-triggering if needed
                setTimeout(() => {
                    isRedirecting = false;
                }, 1000);
            }
        } else if (status === 403) {
            // Forbidden: Show error toast (don't redirect)
            toast.error("You don't have permission to perform this action.");
        } else {
            // Other errors: Notify user
            const message = response?.data?.message || "An unexpected error occurred";
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export default api;