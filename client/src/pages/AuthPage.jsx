import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { authService } from "../services/authService";
import { LoadingSpinner } from "../components/LoadingSpinner";

const initialForm = { name: "", email: "", password: "" };

export function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const { saveAuth, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [destination, isAuthenticated, navigate]);

  const heading = useMemo(
    () =>
      mode === "login"
        ? "Keep billing, stock, and sales in one steady place."
        : "Start your LocalBiz workspace with secure inventory and billing.",
    [mode],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password };

      const response = mode === "login" ? await authService.login(payload) : await authService.register(payload);
      saveAuth(response);
      success(mode === "login" ? "Welcome back to LocalBiz Manager." : "Account created successfully.");
      navigate(destination, { replace: true });
    } catch (submitError) {
      error(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-aura px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="panel overflow-hidden p-8 sm:p-12">
          <span className="badge bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200">LocalBiz Manager</span>
          <h1 className="mt-6 max-w-xl font-display text-5xl leading-tight text-slate-900 dark:text-white">{heading}</h1>
          <p className="mt-5 max-w-xl text-base text-slate-600 dark:text-slate-300">
            Built for neighborhood stores and service counters that need simple billing, dependable stock control, and clean daily visibility.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="panel-muted p-5">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Fast inventory updates</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Stock changes instantly after every sale, so the shelf count stays honest.</p>
            </div>
            <div className="panel-muted p-5">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Invoice downloads</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Generate clean PDF invoices from real transaction data whenever customers need a copy.</p>
            </div>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="panel p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700 dark:text-brand-300">Secure access</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{mode === "login" ? "Sign in to manage billing and inventory." : "Register your admin account to get started."}</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {mode === "register" ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Full name</label>
                <input className="input" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Aarav Sharma" required />
              </div>
            ) : null}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
              <input className="input" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="owner@localbiz.in" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
              <input className="input" type="password" minLength="6" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Minimum 6 characters" required />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? <LoadingSpinner size="sm" /> : mode === "login" ? "Login" : "Register"}
            </button>
          </form>

          <button
            type="button"
            className="mt-6 text-sm font-medium text-brand-700 transition hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
            onClick={() => {
              setMode((current) => (current === "login" ? "register" : "login"));
              setForm(initialForm);
            }}
          >
            {mode === "login" ? "Need an account? Register here." : "Already registered? Login here."}
          </button>
        </motion.section>
      </div>
    </div>
  );
}
