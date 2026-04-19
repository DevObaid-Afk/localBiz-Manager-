import { motion } from "framer-motion";

export function StatCard({ label, value, helper }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="panel p-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{helper}</p>
    </motion.div>
  );
}
