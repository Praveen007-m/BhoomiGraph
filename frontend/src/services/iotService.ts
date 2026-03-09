import api from './api';

export const iotService = {
    registerDevice: async (data: any) => {
        const response = await api.post('/iot/register', data);
        return response.data;
    },

    getDevices: async (farmId: string) => {
        const response = await api.get(`/iot/${farmId}`);
        return response.data;
    },

    // Mocking sensor data since backend endpoint is missing or requires websocket
    getSensorData: async (farmId: string) => {
        // In a real app, this might be GET /iot/sensors/:farmId
        // For now, returning mock data to populate charts
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = [];
                for (let i = 0; i < 24; i++) {
                    data.push({
                        time: `${i}:00`,
                        moisture: 30 + Math.random() * 20,
                        temp: 20 + Math.random() * 10,
                        humidity: 50 + Math.random() * 15
                    });
                }
                resolve(data);
            }, 500);
        });
    },

    // Mocking weather data since backend route is missing
    getWeatherData: async (location: string) => {
        // In a real app, GET /weather?location=...
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    current: { temp: 28, condition: "Partly Cloudy", humidity: 65, wind: 12 },
                    forecast: [
                        { day: "Today", temp: 29 },
                        { day: "Tue", temp: 27 },
                        { day: "Wed", temp: 30 },
                        { day: "Thu", temp: 28 },
                        { day: "Fri", temp: 26 },
                    ]
                });
            }, 500);
        });
    },

    getWeatherByCoords: async (lat: number, lon: number) => {
        const response = await api.get(`/weather?lat=${lat}&lon=${lon}`);
        return response.data;
    }
};
