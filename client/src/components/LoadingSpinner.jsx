import { motion } from "framer-motion";

export function LoadingSpinner({ size = "md" }) {
  const dimension = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-10 w-10" : "h-6 w-6";

  return (
    <motion.span
      className={`inline-block ${dimension} rounded-full border-2 border-brand-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-400`}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
    />
  );
}

export function LoadingScreen({ label = "Loading..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="panel flex w-full max-w-sm flex-col items-center gap-4 px-8 py-12 text-center">
        <LoadingSpinner size="lg" />
        <div>
          <p className="font-semibold text-slate-800 dark:text-white">{label}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Please wait while we prepare the latest data.</p>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return <div className="h-32 animate-pulse rounded-3xl bg-white/60 dark:bg-slate-900/60" />;
}
