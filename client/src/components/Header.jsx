export function Header({ title, subtitle, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700 dark:text-brand-300">Workspace</p>
        <h2 className="mt-2 font-display text-4xl text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
