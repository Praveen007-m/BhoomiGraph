import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export const useNotifications = () => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const response = await api.get("/notifications");
            return response.data.notifications;
        },
        refetchInterval: 30000, // Poll every 30 seconds
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.patch(`/notifications/${id}/read`);
            return response.data.notification;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};
