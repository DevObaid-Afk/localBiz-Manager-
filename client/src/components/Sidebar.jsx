import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/billing", label: "Billing" },
  { to: "/sales", label: "Sales" },
];

export function Sidebar({ user, onLogout }) {
  return (
    <aside className="panel flex h-full flex-col justify-between p-5">
      <div>
        <div className="rounded-3xl bg-aura p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700 dark:text-brand-300">LocalBiz Manager</p>
          <h1 className="mt-3 font-display text-3xl text-slate-900 dark:text-white">Run billing and inventory with calm.</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Built for everyday counters, stockrooms, and growing local teams.</p>
        </div>

        <nav className="mt-8 space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20"
                    : "text-slate-600 hover:bg-brand-50 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="panel-muted mt-8 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Signed in as</p>
        <p className="mt-2 font-semibold text-slate-800 dark:text-white">{user?.name}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
        <button type="button" onClick={onLogout} className="btn-secondary mt-4 w-full">
          Logout
        </button>
      </div>
    </aside>
  );
}
