import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export const usePilotDashboard = () => {
    return useQuery({
        queryKey: ['pilot-dashboard'],
        queryFn: async () => {
            const { data } = await api.get('/pilot/dashboard');
            return data;
        }
    });
};

export const usePilotBookings = () => {
    return useQuery({
        queryKey: ['pilot-bookings'],
        queryFn: async () => {
            const { data } = await api.get('/pilot/bookings');
            return data.jobs;
        }
    });
};

export const usePilotBookingDetails = (id: string) => {
    return useQuery({
        queryKey: ['pilot-booking', id],
        queryFn: async () => {
            const { data } = await api.get(`/pilot/bookings/${id}`);
            return data.job;
        },
        enabled: !!id
    });
};

export const useUpdateMissionStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const { data } = await api.patch(`/pilot/bookings/${id}/status`, { status });
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pilot-booking', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['pilot-bookings'] });
            queryClient.invalidateQueries({ queryKey: ['pilot-dashboard'] });
        }
    });
};

export const useUploadSurvey = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await api.post(`/pilot/bookings/${id}/upload`, data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['pilot-booking', variables.id] });
        }
    });
};
