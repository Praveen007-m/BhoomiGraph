import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export const useAgronomistDashboard = () => {
    return useQuery({
        queryKey: ['agronomist-dashboard'],
        queryFn: async () => {
            const { data } = await api.get('/agronomist/dashboard');
            return data;
        }
    });
};

export const useAgronomistFarms = () => {
    return useQuery({
        queryKey: ['agronomist-farms'],
        queryFn: async () => {
            const { data } = await api.get('/agronomist/farms');
            return data.farms;
        }
    });
};

export const useFarmDetails = (id: string) => {
    return useQuery({
        queryKey: ['agronomist-farm', id],
        queryFn: async () => {
            const { data } = await api.get(`/agronomist/farms/${id}`);
            return data.farm;
        },
        enabled: !!id
    });
};

export const useAdvisories = () => {
    return useQuery({
        queryKey: ['agronomist-advisories'],
        queryFn: async () => {
            const { data } = await api.get('/agronomist/advisories');
            return data.advisories;
        }
    });
};

export const useAdvisoryDetails = (id: string) => {
    return useQuery({
        queryKey: ['agronomist-advisory', id],
        queryFn: async () => {
            const { data } = await api.get(`/agronomist/advisories/${id}`);
            return data.advisory;
        },
        enabled: !!id
    });
};

export const useCreateAdvisory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (advisoryData: any) => {
            const { data } = await api.post('/agronomist/advisories', advisoryData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agronomist-advisories'] });
            queryClient.invalidateQueries({ queryKey: ['agronomist-dashboard'] });
        }
    });
};

export const useUpdateAdvisory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await api.patch(`/agronomist/advisories/${id}`, data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['agronomist-advisory', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['agronomist-advisories'] });
        }
    });
};
