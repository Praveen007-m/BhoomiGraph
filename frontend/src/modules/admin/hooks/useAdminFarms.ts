import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { adminService } from '../services/adminService';

export const useAdminFarms = (filters: { status?: string } = {}) => {
    return useQuery({
        queryKey: ["admin-farms", filters],
        queryFn: () => adminService.getFarms(filters),
    });
};

export const useUpdateFarmStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const response = await api.patch(`/admin/farms/${id}/status`, { status });
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-farms"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        },
    });
};
