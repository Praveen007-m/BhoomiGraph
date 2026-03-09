import api from "./api";

export const farmService = {
  getAllFarms: async () => {
    const res = await api.get("/farms");
    return res.data;
  },

  getFarmById: async (id: string) => {
    const res = await api.get(`/farms/${id}`);
    return res.data;
  },

  createFarm: async (data: any) => {
    const res = await api.post("/farms", data);
    return res.data;
  },

  updateFarm: async (id: string, data: any) => {
    const res = await api.put(`/farms/${id}`, data);
    return res.data;
  },

  deleteFarm: async (id: string) => {
    const res = await api.delete(`/farms/${id}`);
    return res.data;
  },
};