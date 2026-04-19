import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { EmptyState } from "../components/EmptyState";
import { Header } from "../components/Header";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProductFormModal } from "../components/ProductFormModal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { productService } from "../services/productService";

export function ProductsPage() {
  const { token } = useAuth();
  const { success, error } = useToast();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({ token, search, stock: stockFilter });
      setProducts(response.products);
    } catch (loadError) {
      error(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(loadProducts, 240);
    return () => window.clearTimeout(timer);
  }, [search, stockFilter]);

  useEffect(() => {
    loadProducts();
  }, []);

  const summary = useMemo(() => {
    const inventoryValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
    return {
      count: products.length,
      lowStock: products.filter((product) => product.stock < 5).length,
      inventoryValue,
    };
  }, [products]);

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      if (editingProduct) {
        await productService.updateProduct({ token, id: editingProduct._id, payload });
        success("Product updated successfully.");
      } else {
        await productService.createProduct({ token, payload });
        success("Product added successfully.");
      }
      setModalOpen(false);
      setEditingProduct(null);
      await loadProducts();
    } catch (submitError) {
      error(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct({ token, id });
      success("Product deleted successfully.");
      await loadProducts();
    } catch (deleteError) {
      error(deleteError.message);
    }
  };

  return (
    <div>
      <Header
        title="Products"
        subtitle="Add, search, edit, and monitor every product in your inventory without leaving the workspace."
        actions={<button type="button" className="btn-primary" onClick={() => setModalOpen(true)}>Add product</button>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel p-5"><p className="text-sm text-slate-500 dark:text-slate-400">Catalog size</p><p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{summary.count}</p></div>
        <div className="panel p-5"><p className="text-sm text-slate-500 dark:text-slate-400">Low stock alerts</p><p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{summary.lowStock}</p></div>
        <div className="panel p-5"><p className="text-sm text-slate-500 dark:text-slate-400">Inventory value</p><p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Rs {summary.inventoryValue.toFixed(2)}</p></div>
      </div>

      <div className="panel mt-6 p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <input className="input" placeholder="Search products by name" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select className="input" value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}>
            <option value="all">All stock levels</option>
            <option value="low">Low stock only</option>
          </select>
        </div>

        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>
          ) : products.length ? (
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Updated</th>
                  <th className="pb-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <motion.tr key={product._id} layout className="border-b border-stone-100 dark:border-slate-900">
                    <td className="py-4 font-medium text-slate-900 dark:text-white">{product.name}</td>
                    <td className="py-4 text-slate-600 dark:text-slate-300">Rs {product.price.toFixed(2)}</td>
                    <td className="py-4">
                      <span className={`badge ${product.stock < 5 ? "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200" : "bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200"}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{new Date(product.updatedAt).toLocaleString()}</td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <button type="button" className="btn-secondary px-4 py-2" onClick={() => { setEditingProduct(product); setModalOpen(true); }}>
                          Edit
                        </button>
                        <button type="button" className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-rose-700" onClick={() => handleDelete(product._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState title="No products found" description="Add your first product to start billing and stock tracking." action={<button type="button" className="btn-primary" onClick={() => setModalOpen(true)}>Create first product</button>} />
          )}
        </div>
      </div>

      <ProductFormModal
        open={modalOpen}
        product={editingProduct}
        submitting={saving}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
