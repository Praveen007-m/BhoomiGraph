import api from './api';

const SERVICE_TYPE_MAP: Record<string, string> = {
    "Drone Mapping": "DroneMapping",
    "Soil Testing": "SoilTesting",
    "Crop Health Scan": "CropHealthScan"
};

export const serviceBookingService = {
    getAllBookings: async () => {
        const response = await api.get('/services/bookings');
        return response.data;
    },

    createBooking: async (bookingData: any) => {
        // Map service_type if it exists in the mapping
        const mappedData = {
            ...bookingData,
            service_type: SERVICE_TYPE_MAP[bookingData.service_type] || bookingData.service_type
        };
        const response = await api.post('/services/bookings', mappedData);
        return response.data;
    },

    updateBookingStatus: async (id: number, status: string) => {
        // Mocking PATCH since backend route seems to be missing or using generic update
        // If route is missing, we might need to add it or use a different approach.
        // Based on analysis, only POST and GET are defined in router. 
        // I will add PATCH to frontend service anticipating backend change or as placeholder.
        const response = await api.patch(`/services/bookings/${id}`, { status });
        return response.data;
    }
};
