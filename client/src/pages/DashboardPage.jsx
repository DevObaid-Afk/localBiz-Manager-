import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { SkeletonCard } from "../components/LoadingSpinner";
import { RevenueBars } from "../components/RevenueBars";
import { StatCard } from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { saleService } from "../services/saleService";

export function DashboardPage() {
  const { token } = useAuth();
  const { error } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    saleService
      .getDashboard(token)
      .then(setData)
      .catch((err) => error(err.message))
      .finally(() => setLoading(false));
  }, [error, token]);

  return (
    <div>
      <Header title="Dashboard" subtitle="Track daily sales, current inventory health, and recent selling momentum in one glance." />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Today's total sales" value={`Rs ${Number(data?.todaySales || 0).toFixed(2)}`} helper="Updated from completed bills today." />
            <StatCard label="Total products" value={data?.totalProducts || 0} helper="Active products available in your catalog." />
            <StatCard label="Low stock items" value={data?.lowStockItems?.length || 0} helper="Products below the stock threshold of five units." />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <RevenueBars data={data?.analytics || []} />
            <div className="panel p-6">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Low stock watchlist</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Restock these items before the next busy window.</p>
              </div>
              <div className="mt-6 space-y-3">
                {data?.lowStockItems?.length ? (
                  data.lowStockItems.map((item) => (
                    <div key={item._id} className="panel-muted flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Rs {item.price.toFixed(2)} per unit</p>
                      </div>
                      <span className="badge bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200">{item.stock} left</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Inventory looks healthy right now. No items are below the alert threshold.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
