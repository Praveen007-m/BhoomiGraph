import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export const usePilotJobs = () => {
    return useQuery({
        queryKey: ["pilot-jobs"],
        queryFn: async () => {
            const response = await api.get("/pilot/jobs");
            return response.data.jobs;
        },
    });
};

export const useUpdateJobStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const response = await api.patch(`/pilot/jobs/${id}/status`, { status });
            return response.data.job;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pilot-jobs"] });
        },
    });
};
