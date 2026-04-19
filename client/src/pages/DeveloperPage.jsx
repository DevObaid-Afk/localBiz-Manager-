import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function DeveloperPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.15),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.10),transparent_22%),linear-gradient(180deg,#f8fafc_0%,#edf6f2_48%,#edf2f7_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.15),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(96,165,250,0.10),transparent_24%),linear-gradient(180deg,#030712_0%,#07131a_46%,#0b1220_100%)] dark:text-white">
      <header className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/25 bg-white/70 px-5 py-3 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
          <Link to="/" className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900 dark:text-white">
            LocalBiz Manager
          </Link>
          <Link
            to="/"
            className="inline-flex items-center rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-700"
          >
            Back to Site
          </Link>
        </div>
      </header>

      <main className="px-4 pb-16 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl rounded-[2.2rem] border border-white/30 bg-white/75 p-8 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/65 sm:p-10 lg:p-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">Developer Information</p>
          <h1 className="mt-4 font-display text-4xl text-slate-950 dark:text-white sm:text-5xl">About the Developer</h1>

          <div className="mt-8 space-y-5 text-base leading-8 text-slate-600 dark:text-slate-300">
            <p>
              LocalBiz Manager was crafted by a product-focused developer with a practical goal: make digital operations simple, dependable, and affordable for local businesses.
            </p>
            <p>
              The platform is designed to replace fragmented manual workflows with one stable system for billing, inventory tracking, invoicing, and day-to-day business visibility.
            </p>
            <p>
              Development priorities continue to focus on real-world usability, clear workflows, and long-term maintainability so businesses can adopt technology without operational friction.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-emerald-300/30 bg-emerald-500/10 p-6 dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">Contact Information</p>
            <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-200">
              <p>
                <span className="font-semibold">Phone / WhatsApp:</span> +91 8591079598
              </p>
              <p>
                <span className="font-semibold">Email:</span> exehassan62@gmail.com
              </p>
              <p>
                <span className="font-semibold">Location:</span> Mumbai, Maharashtra, India
              </p>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
