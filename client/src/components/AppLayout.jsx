import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { ToastViewport } from "./ToastViewport";

export function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toasts, removeToast, info } = useToast();

  const handleLogout = () => {
    logout();
    info("You have been logged out.");
    navigate("/auth", { replace: true });
  };

  return (
    <div className="min-h-screen bg-aura px-4 py-4 sm:px-6 lg:px-8">
      <ToastViewport toasts={toasts} onClose={removeToast} />
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="panel overflow-hidden">
          <div className="flex items-center justify-end border-b border-stone-200/70 px-6 py-4 dark:border-slate-800">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
          <div className="p-5 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
