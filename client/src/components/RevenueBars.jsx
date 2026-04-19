export function RevenueBars({ data }) {
  const maxRevenue = Math.max(...data.map((item) => item.revenue), 0);

  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Revenue rhythm</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Recent sales trend to keep the counter team aligned.</p>
        </div>
        <span className="badge bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-200">Live</span>
      </div>
      <div className="mt-8 flex min-h-48 items-end gap-4">
        {data.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Sales will appear here as soon as bills are created.</p>
        ) : (
          data.map((item) => (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
              <div className="flex h-40 w-full items-end rounded-3xl bg-stone-100 p-2 dark:bg-slate-800/80">
                <div
                  className="w-full rounded-2xl bg-gradient-to-t from-brand-600 to-accent-400"
                  style={{ height: `${maxRevenue ? Math.max((item.revenue / maxRevenue) * 100, 8) : 8}%` }}
                />
              </div>
              <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                <p>{item.label}</p>
                <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">Rs {item.revenue.toFixed(0)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
