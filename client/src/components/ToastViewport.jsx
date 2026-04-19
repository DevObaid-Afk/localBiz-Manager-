import { motion } from "framer-motion";

const toneMap = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-100",
  error: "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-100",
  info: "border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-900/50 dark:bg-brand-950/40 dark:text-brand-100",
};

export function ToastViewport({ toasts, onClose }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.96 }}
          className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-soft ${toneMap[toast.type]}`}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium">{toast.message}</p>
            <button type="button" onClick={() => onClose(toast.id)} className="text-xs uppercase tracking-[0.2em] opacity-70">
              Close
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
