import api from "./api";

export const walletService = {
  async getBalance() {
    const res = await api.get("/wallet");
    return res.data;
  },
};