import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export const useFarmerDashboard = () => {
    return useQuery({
        queryKey: ["farmer-dashboard"],
        queryFn: async () => {
            const response = await api.get("/farmer/dashboard");
            return response.data.stats;
        },
        enabled: !!localStorage.getItem('token'),
    });
};

export const useFarmerFarms = () => {
    return useQuery({
        queryKey: ["farmer-farms"],
        queryFn: async () => {
            const response = await api.get("/farmer/farms");
            return response.data.farms;
        },
        enabled: !!localStorage.getItem('token'),
    });
};

export const useFarmerBookings = () => {
    return useQuery({
        queryKey: ["farmer-bookings"],
        queryFn: async () => {
            const response = await api.get("/farmer/bookings");
            return response.data.bookings;
        },
        enabled: !!localStorage.getItem('token'),
    });
};

export const useFarmerDroneProjects = () => {
    return useQuery({
        queryKey: ["farmer-drone-projects"],
        queryFn: async () => {
            const response = await api.get("/farmer/drone-projects");
            return response.data.projects;
        },
        enabled: !!localStorage.getItem('token'),
    });
};

export const useFarmerNDVI = (farmId: string) => {
    return useQuery({
        queryKey: ["farmer-ndvi", farmId],
        queryFn: async () => {
            const response = await api.get(`/farmer/farms/${farmId}/ndvi`);
            return response.data.data;
        },
        enabled: !!farmId && !!localStorage.getItem('token'),
    });
};

export const useFarmerIoT = (farmId: string) => {
    return useQuery({
        queryKey: ["farmer-iot", farmId],
        queryFn: async () => {
            const response = await api.get(`/farmer/farms/${farmId}/iot`);
            return response.data.data;
        },
        enabled: !!farmId && !!localStorage.getItem('token'),
    });
};

export const useFarmerAlerts = () => {
    return useQuery({
        queryKey: ["farmer-alerts"],
        queryFn: async () => {
            const response = await api.get("/farmer/alerts");
            return response.data.alerts;
        },
        enabled: !!localStorage.getItem('token'),
    });
};
