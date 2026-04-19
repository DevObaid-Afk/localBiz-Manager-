import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { Header } from "../components/Header";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { productService } from "../services/productService";
import { saleService } from "../services/saleService";

function downloadInvoice(sale) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("LocalBiz Manager Invoice", 20, 20);
  doc.setFontSize(11);
  doc.text(`Invoice: ${sale.invoiceNumber}`, 20, 32);
  doc.text(`Date: ${new Date(sale.soldAt).toLocaleString()}`, 20, 39);

  let y = 55;
  sale.items.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.name}`, 20, y);
    doc.text(`Qty: ${item.quantity}`, 110, y);
    doc.text(`Price: Rs ${item.price.toFixed(2)}`, 140, y);
    doc.text(`Subtotal: Rs ${item.subtotal.toFixed(2)}`, 20, y + 7);
    y += 17;
  });

  doc.setFontSize(14);
  doc.text(`Total: Rs ${sale.total.toFixed(2)}`, 20, y + 12);
  doc.save(`${sale.invoiceNumber}.pdf`);
}

export function BillingPage() {
  const { token } = useAuth();
  const { success, error } = useToast();
  const [products, setProducts] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [latestSale, setLatestSale] = useState(null);

  useEffect(() => {
    productService
      .getProducts({ token })
      .then((response) => setProducts(response.products))
      .catch((loadError) => error(loadError.message))
      .finally(() => setLoading(false));
  }, [error, token]);

  const total = useMemo(
    () =>
      billItems.reduce((sum, item) => {
        const product = products.find((entry) => entry._id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0),
    [billItems, products],
  );

  const addLine = () => {
    setBillItems((current) => [...current, { productId: "", quantity: 1 }]);
  };

  const updateLine = (index, field, value) => {
    setBillItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  };

  const removeLine = (index) => {
    setBillItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const submitBill = async () => {
    try {
      setSubmitting(true);
      const payload = {
        items: billItems.filter((item) => item.productId).map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
        })),
      };

      if (!payload.items.length) {
        throw new Error("Add at least one product before creating a bill.");
      }

      const response = await saleService.createSale({ token, payload });
      setLatestSale(response.sale);
      setBillItems([]);
      success("Bill created successfully and stock updated.");
      const refreshedProducts = await productService.getProducts({ token });
      setProducts(refreshedProducts.products);
    } catch (submitError) {
      error(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Header
        title="Billing"
        subtitle="Create bills quickly, validate inventory before checkout, and download a polished PDF invoice for each completed sale."
        actions={<button type="button" className="btn-primary" onClick={addLine}>Add line item</button>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="panel p-5">
          {loading ? (
            <div className="flex items-center justify-center py-16"><LoadingSpinner size="lg" /></div>
          ) : products.length ? (
            <div className="space-y-4">
              {billItems.length === 0 ? (
                <EmptyState title="Your bill is empty" description="Add line items to begin a new sale. Products with current stock will appear here." action={<button type="button" className="btn-primary" onClick={addLine}>Add first line item</button>} />
              ) : (
                billItems.map((item, index) => {
                  const selected = products.find((product) => product._id === item.productId);
                  return (
                    <div key={`${item.productId}-${index}`} className="panel-muted grid gap-4 p-4 md:grid-cols-[1fr_160px_auto]">
                      <select className="input" value={item.productId} onChange={(event) => updateLine(index, "productId", event.target.value)}>
                        <option value="">Select a product</option>
                        {products.map((product) => (
                          <option key={product._id} value={product._id}>
                            {product.name} | Rs {product.price.toFixed(2)} | stock {product.stock}
                          </option>
                        ))}
                      </select>
                      <input className="input" type="number" min="1" step="1" value={item.quantity} onChange={(event) => updateLine(index, "quantity", event.target.value)} />
                      <button type="button" className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white" onClick={() => removeLine(index)}>
                        Remove
                      </button>
                      {selected ? (
                        <div className="md:col-span-3 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                          <span className="badge bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200">Available: {selected.stock}</span>
                          <span>Line total: Rs {(selected.price * Number(item.quantity || 0)).toFixed(2)}</span>
                        </div>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <EmptyState title="No products available for billing" description="Add products first, then return here to create your first invoice." />
          )}
        </div>

        <div className="space-y-6">
          <div className="panel p-6">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Bill summary</p>
            <div className="mt-5 space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-between"><span>Items selected</span><span>{billItems.filter((item) => item.productId).length}</span></div>
              <div className="flex items-center justify-between"><span>Total quantity</span><span>{billItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}</span></div>
              <div className="flex items-center justify-between border-t border-stone-200 pt-3 text-base font-semibold text-slate-900 dark:border-slate-800 dark:text-white"><span>Grand total</span><span>Rs {total.toFixed(2)}</span></div>
            </div>
            <button type="button" className="btn-primary mt-6 w-full" onClick={submitBill} disabled={submitting}>
              {submitting ? "Processing sale..." : "Create bill"}
            </button>
          </div>

          <div className="panel p-6">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Latest invoice</p>
            {latestSale ? (
              <div className="mt-4 space-y-4 text-sm text-slate-500 dark:text-slate-400">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{latestSale.invoiceNumber}</p>
                  <p>{new Date(latestSale.soldAt).toLocaleString()}</p>
                </div>
                <p>Total: Rs {latestSale.total.toFixed(2)}</p>
                <button type="button" className="btn-secondary w-full" onClick={() => downloadInvoice(latestSale)}>
                  Download PDF invoice
                </button>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Complete a sale and the invoice download action will appear here instantly.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
