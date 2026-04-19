import { useEffect, useMemo, useState } from "react";
import { Header } from "../components/Header";
import { EmptyState } from "../components/EmptyState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { saleService } from "../services/saleService";

function exportCsv(sales) {
  const lines = ["Invoice Number,Date,Items,Total"];
  sales.forEach((sale) => {
    const itemCount = sale.items.reduce((sum, item) => sum + item.quantity, 0);
    lines.push(`${sale.invoiceNumber},${new Date(sale.soldAt).toISOString()},${itemCount},${sale.total}`);
  });

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "sales-history.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function SalesPage() {
  const { token } = useAuth();
  const { error, success } = useToast();
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState({ totalRevenue: 0, totalSales: 0 });
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  const loadSales = async (selectedDate = date) => {
    try {
      setLoading(true);
      const response = await saleService.getSales({ token, date: selectedDate });
      setSales(response.sales);
      setSummary(response.summary);
    } catch (loadError) {
      error(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales("");
  }, []);

  const totalItemsSold = useMemo(
    () => sales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0),
    [sales],
  );

  return (
    <div>
      <Header
        title="Sales History"
        subtitle="Review every completed bill, filter by date, and export transaction history for bookkeeping or reconciliation."
        actions={<button type="button" className="btn-secondary" onClick={() => { exportCsv(sales); success("Sales history exported as CSV."); }} disabled={!sales.length}>Export CSV</button>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel p-5"><p className="text-sm text-slate-500 dark:text-slate-400">Total revenue</p><p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Rs {summary.totalRevenue.toFixed(2)}</p></div>
        <div className="panel p-5"><p className="text-sm text-slate-500 dark:text-slate-400">Bills</p><p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{summary.totalSales}</p></div>
        <div className="panel p-5"><p className="text-sm text-slate-500 dark:text-slate-400">Items sold</p><p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{totalItemsSold}</p></div>
      </div>

      <div className="panel mt-6 p-5">
        <div className="flex flex-col gap-4 sm:flex-row">
          <input className="input max-w-xs" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          <button type="button" className="btn-primary" onClick={() => loadSales(date)}>Apply date filter</button>
          <button type="button" className="btn-secondary" onClick={() => { setDate(""); loadSales(""); }}>Clear filter</button>
        </div>

        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-14"><LoadingSpinner size="lg" /></div>
          ) : sales.length ? (
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="pb-3 font-medium">Invoice</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale._id} className="border-b border-stone-100 align-top dark:border-slate-900">
                    <td className="py-4 font-medium text-slate-900 dark:text-white">{sale.invoiceNumber}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{new Date(sale.soldAt).toLocaleString()}</td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">{sale.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}</td>
                    <td className="py-4 font-semibold text-slate-900 dark:text-white">Rs {sale.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState title="No sales yet" description="Completed bills will appear here. Use the billing page to create your first sale." />
          )}
        </div>
      </div>
    </div>
  );
}
