import { useQuery } from "@tanstack/react-query";
import { adminService } from '../services/adminService';

export const useAdminStats = () => {
    return useQuery({
        queryKey: ["admin-stats"],
        queryFn: adminService.getStats,
        enabled: !!localStorage.getItem('token'),
    });
};

export const useAdminRevenue = () => {
    return useQuery({
        queryKey: ["admin-revenue"],
        queryFn: adminService.getRevenue,
        enabled: !!localStorage.getItem('token'),
    });
};
