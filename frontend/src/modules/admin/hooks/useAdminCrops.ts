import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export const useAdminCrops = () => {
    return useQuery({
        queryKey: ["admin-crops"],
        queryFn: async () => {
            const response = await api.get("/admin/crops");
            return response.data.crops;
        },
    });
};

export const useAddCrop = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post("/admin/crops", data);
            return response.data.crop;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-crops"] });
        },
    });
};
