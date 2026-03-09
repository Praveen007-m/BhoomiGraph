import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { adminService } from '../services/adminService';

export const useAdminBookings = (filters: { status?: string } = {}) => {
    return useQuery({
        queryKey: ["admin-bookings", filters],
        queryFn: () => adminService.getBookings(filters),
    });
};

export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await api.patch(`/admin/bookings/${id}/status`, data);
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        },
    });
};
