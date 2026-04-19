export function ThemeToggle({ theme, onToggle }) {
  return (
    <button type="button" onClick={onToggle} className="btn-secondary gap-2 px-4 py-2.5 text-xs uppercase tracking-[0.22em]">
      <span>{theme === "light" ? "Dark" : "Light"}</span>
      <span className="rounded-full bg-stone-100 px-2 py-1 text-[10px] dark:bg-slate-800">Mode</span>
    </button>
  );
}
