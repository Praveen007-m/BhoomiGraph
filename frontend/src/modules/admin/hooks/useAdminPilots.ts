import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export const useAdminPilots = () => {
    return useQuery({
        queryKey: ["admin-pilots"],
        queryFn: async () => {
            // Fetch users with role "pilot"
            const response = await api.get("/admin/users", { params: { role: 'pilot' } });
            return response.data.users;
        },
    });
};
