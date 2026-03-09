import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export const useValidationFarms = () => {
    return useQuery({
        queryKey: ["validation-farms"],
        queryFn: async () => {
            const response = await api.get("/agronomist/validation-farms");
            return response.data.farms;
        },
    });
};

export const useAdvisoryHistory = () => {
    return useQuery({
        queryKey: ["advisory-history"],
        queryFn: async () => {
            const response = await api.get("/agronomist/advisories");
            return response.data.advisories;
        },
    });
};

export const useCreateAdvisory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (advisoryData: any) => {
            const response = await api.post("/agronomist/advisory", advisoryData);
            return response.data.advisory;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["advisory-history"] });
        },
    });
};
