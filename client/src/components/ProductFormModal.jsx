import { useEffect, useState } from "react";

const initialState = { name: "", price: "", stock: "" };

export function ProductFormModal({ open, product, onClose, onSubmit, submitting }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: product.price,
        stock: product.stock,
      });
    } else {
      setForm(initialState);
    }
  }, [product]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
      <div className="panel w-full max-w-lg p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-brand-300">Product</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{product ? "Edit product" : "Add product"}</h3>
          </div>
          <button type="button" onClick={onClose} className="btn-secondary px-4 py-2">
            Close
          </button>
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({
              name: form.name,
              price: Number(form.price),
              stock: Number(form.stock),
            });
          }}
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Product name</label>
            <input className="input" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Fresh Bread" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Price</label>
              <input className="input" type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} placeholder="0.00" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Stock</label>
              <input className="input" type="number" min="0" step="1" value={form.stock} onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))} placeholder="0" required />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Saving..." : product ? "Update product" : "Create product"}
          </button>
        </form>
      </div>
    </div>
  );
}
