import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { adminService } from '../services/adminService';

export const useAdminSensors = () => {
    return useQuery({
        queryKey: ["admin-sensors"],
        queryFn: adminService.getSensors,
    });
};

export const useAddSensor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post("/admin/sensors", data);
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-sensors"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        },
    });
};
