import { api } from "./api";

export const saleService = {
  getDashboard: (token) => api.get("/sales/dashboard", { token }),
  getSales: ({ token, date = "" }) => api.get(`/sales${date ? `?date=${date}` : ""}`, { token }),
  createSale: ({ token, payload }) => api.post("/sales", payload, { token }),
};
