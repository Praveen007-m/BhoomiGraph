import { useQuery } from "@tanstack/react-query";
import { adminService } from '../services/adminService';

export const useAdminTransactions = (filters: { type?: string; dateRange?: string } = {}) => {
    return useQuery({
        queryKey: ["admin-transactions", filters],
        queryFn: () => adminService.getBookings(filters), // Transactions often map to bookings or separate API
    });
};
