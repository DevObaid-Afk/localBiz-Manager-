import { api } from "./api";

export const productService = {
  getProducts: ({ token, search = "", stock = "all" }) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (stock && stock !== "all") params.set("stock", stock);
    const query = params.toString();
    return api.get(`/products${query ? `?${query}` : ""}`, { token });
  },
  createProduct: ({ token, payload }) => api.post("/products", payload, { token }),
  updateProduct: ({ token, id, payload }) => api.put(`/products/${id}`, payload, { token }),
  deleteProduct: ({ token, id }) => api.delete(`/products/${id}`, { token }),
};
