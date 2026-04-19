import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { LoadingScreen } from "../components/LoadingSpinner";

const features = [
  {
    title: "Product Management",
    description: "Organize pricing, stock, and product updates from one clean inventory workspace.",
    icon: "PK",
  },
  {
    title: "Fast Billing System",
    description: "Create bills in seconds with live totals and smooth checkout flows for your team.",
    icon: "BL",
  },
  {
    title: "Sales Tracking",
    description: "Review completed transactions, revenue movement, and business performance over time.",
    icon: "SL",
  },
  {
    title: "Inventory Alerts",
    description: "Spot low stock items early so you can restock before the next busy shift begins.",
    icon: "AL",
  },
  {
    title: "PDF Invoice Generation",
    description: "Download professional invoices instantly for every completed sale and customer request.",
    icon: "PD",
  },
  {
    title: "CSV Export",
    description: "Export sales history into spreadsheets for bookkeeping, tax work, or quick reporting.",
    icon: "CV",
  },
  {
    title: "Secure Login System",
    description: "Protect business data with JWT authentication and role-ready account access patterns.",
    icon: "SC",
  },
];

const plans = [
  {
    name: "Starter Plan",
    price: "\u20B9199/month",
    description: "A clean entry point for small shops starting digital billing and stock control.",
    features: ["Product Management", "Billing System", "Sales History", "PDF Invoices"],
  },
  {
    name: "Quarter Plan",
    price: "\u20B9499 / 3 Months",
    description: "Best for growing counters that want longer coverage and hands-on support.",
    features: ["All Starter features", "Priority Support", "Sales Analytics"],
  },
  {
    name: "Lifetime Plan",
    price: "\u20B92000 One-Time",
    description: "Own the complete platform with long-term value and every core capability unlocked.",
    features: ["All features unlocked", "Lifetime access", "Free updates"],
    popular: true,
  },
  {
    name: "Custom Services",
    price: "Tailored Quote",
    description: "Need custom features or advanced setup? Contact us for tailored solutions.",
    features: ["Business-specific workflows", "Custom onboarding", "Advanced implementation support"],
  },
];

const testimonials = [
  {
    quote: "Very easy to use and saved hours of manual billing!",
    author: "Grocery Store Owner",
  },
  {
    quote: "The sales tracking and stock alerts made our daily closing much smoother.",
    author: "Retail Counter Manager",
  },
  {
    quote: "Invoices look professional and the system is simple enough for the whole team.",
    author: "Pharmacy Operator",
  },
];

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

function SectionLabel({ children }) {
  return (
    <span className="inline-flex rounded-full border border-emerald-400/25 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">
      {children}
    </span>
  );
}

function MarketingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-full border border-white/20 bg-white/70 px-4 py-3 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-900 dark:text-white">
            LocalBiz Manager
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-slate-600 transition hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <Link to="/auth" className="btn-secondary px-4 py-2.5">
              Login
            </Link>
            <Link to="/auth" className="btn-primary px-4 py-2.5">
              Get Started
            </Link>
          </div>

          <button
            type="button"
            className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 lg:hidden"
            onClick={() => setMenuOpen((current) => !current)}
          >
            Menu
          </button>
        </div>

        {menuOpen ? (
          <div className="mt-4 space-y-3 border-t border-slate-200/70 pt-4 dark:border-slate-800 lg:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl px-3 py-2 text-sm text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-900"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <Link to="/auth" className="btn-secondary" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/auth" className="btn-primary" onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function LandingPage() {
  const { isAuthenticated, loading } = useAuth();

  const stats = useMemo(
    () => [
      { label: "Fast setup", value: "15 min" },
      { label: "Core workflows", value: "7+" },
      { label: "Responsive screens", value: "100%" },
    ],
    [],
  );

  if (loading) {
    return <LoadingScreen label="Preparing LocalBiz Manager..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.12),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef6f3_45%,#eef2f7_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(96,165,250,0.10),transparent_24%),linear-gradient(180deg,#030712_0%,#07131a_46%,#0b1220_100%)] dark:text-white">
      <MarketingNavbar />

      <main>
        <section id="home" className="px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
              <SectionLabel>Smart SaaS for Local Businesses</SectionLabel>
              <h1 className="mt-6 max-w-3xl font-display text-5xl leading-tight text-slate-950 dark:text-white sm:text-6xl">
                Smart Billing & Inventory for Modern Businesses
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Manage products, generate invoices, track sales, and grow your business {"\u2014"} all in one powerful dashboard.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link to="/auth" className="btn-primary text-base">
                  Get Started
                </Link>
                <a href="#features" className="btn-secondary text-base">
                  View Demo
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/30 bg-white/65 p-4 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/55">
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-3xl border border-emerald-300/35 bg-emerald-500/10 p-5 shadow-soft dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:text-emerald-300">Demo Login</p>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
                  Email: <span className="font-semibold">demo@localbiz.com</span>
                </p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                  Password: <span className="font-semibold">demo123</span>
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute inset-x-12 top-10 h-40 rounded-full bg-emerald-400/30 blur-3xl dark:bg-emerald-500/20" />
              <div className="absolute -right-8 bottom-8 h-36 w-36 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-500/15" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/30 bg-white/70 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70">
                <div className="mb-4 flex items-center justify-between rounded-[1.5rem] border border-white/35 bg-slate-950/90 px-5 py-4 text-white">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">Live Preview</p>
                    <p className="mt-2 text-lg font-semibold">Business command center</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                </div>
                <img
                  src="/dashboard-preview.svg"
                  alt="LocalBiz Manager dashboard preview"
                  loading="lazy"
                  className="w-full rounded-[1.5rem] border border-slate-200/60 bg-slate-950/80 object-cover shadow-2xl dark:border-slate-800"
                />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <SectionLabel>Features</SectionLabel>
              <h2 className="mt-5 font-display text-4xl text-slate-950 dark:text-white">Everything needed to run billing and inventory from one place.</h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                LocalBiz Manager is built to keep everyday operations fast, accurate, and easy for teams across shops, counters, and service businesses.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature, index) => (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  whileHover={{ y: -6 }}
                  className="group rounded-[2rem] border border-white/35 bg-white/72 p-6 shadow-soft backdrop-blur-xl transition dark:border-white/10 dark:bg-slate-900/65"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 text-sm font-bold text-white shadow-lg shadow-emerald-500/20">
                    {feature.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <SectionLabel>Pricing</SectionLabel>
              <h2 className="mt-5 font-display text-4xl text-slate-950 dark:text-white">Simple plans for every stage of growth.</h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                Start small, scale confidently, or choose lifetime access if you want the full platform from day one.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-4">
              {plans.map((plan) => (
                <motion.div
                  key={plan.name}
                  whileHover={{ y: -8 }}
                  className={`relative rounded-[2rem] border p-7 shadow-soft backdrop-blur-xl ${
                    plan.popular
                      ? "border-emerald-400/40 bg-slate-950 text-white shadow-emerald-500/10"
                      : "border-white/35 bg-white/75 dark:border-white/10 dark:bg-slate-900/65"
                  }`}
                >
                  {plan.popular ? (
                    <span className="absolute right-6 top-6 rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-950">
                      Most Popular
                    </span>
                  ) : null}
                  <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${plan.popular ? "text-emerald-300" : "text-emerald-700 dark:text-emerald-300"}`}>
                    {plan.name}
                  </p>
                  <p className={`mt-6 text-4xl font-semibold ${plan.popular ? "text-white" : "text-slate-950 dark:text-white"}`}>{plan.price}</p>
                  <p className={`mt-4 text-sm leading-7 ${plan.popular ? "text-slate-300" : "text-slate-600 dark:text-slate-300"}`}>{plan.description}</p>

                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className={`flex items-start gap-3 text-sm ${plan.popular ? "text-slate-200" : "text-slate-700 dark:text-slate-200"}`}>
                        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${plan.popular ? "bg-emerald-300" : "bg-emerald-500"}`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/auth" className={plan.popular ? "btn-primary mt-8 w-full bg-white text-slate-950 hover:bg-slate-100" : "btn-primary mt-8 w-full"}>
                    Get Started
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <SectionLabel>Testimonials</SectionLabel>
              <h2 className="mt-5 font-display text-4xl text-slate-950 dark:text-white">Trusted by business owners who want less manual work.</h2>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {testimonials.map((item) => (
                <motion.blockquote
                  key={item.author}
                  whileHover={{ y: -5 }}
                  className="rounded-[2rem] border border-white/35 bg-white/75 p-7 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/65"
                >
                  <p className="text-base leading-8 text-slate-700 dark:text-slate-200">"{item.quote}"</p>
                  <footer className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">- {item.author}
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-white/30 bg-gradient-to-br from-emerald-500 via-emerald-600 to-sky-600 p-10 text-white shadow-[0_30px_80px_rgba(16,185,129,0.25)]">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100">Start today</p>
                <h2 className="mt-4 font-display text-4xl">Start managing your business smarter today.</h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-50/90">
                  From billing to stock visibility, LocalBiz Manager helps you replace manual work with a faster, calmer workflow.
                </p>
              </div>
              <Link to="/auth" className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100">
                Get Started
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-slate-200/70 px-4 py-12 dark:border-slate-800/80 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-950 dark:text-white">LocalBiz Manager</p>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">
              Billing, inventory, invoices, and business clarity in one modern dashboard for local businesses.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">Quick Links</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300">
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#contact">Contact</a>
              <Link to="/auth">Login</Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">Contact</p>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">hello@localbiz.com</p>
            <Link to="/developer" className="mt-2 inline-block text-xs text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
              Developer
            </Link>
            <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">{"\u00A9"} 2026 LocalBiz Manager</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

