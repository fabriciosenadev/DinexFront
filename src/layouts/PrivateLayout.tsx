import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import { notification } from "../shared/services/notification";
import { useState } from "react";

export default function PrivateLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    logout();
    notification.success("Logout realizado com sucesso!");
    setLoggingOut(false);
    setTimeout(() => {
      navigate("/");
    }, 200); // delay pra garantir renderização do toast antes de desmontar o layout
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <header className="fixed top-0 left-0 w-full h-16 flex items-center px-6 bg-slate-900 shadow justify-between z-20">
        <span className="text-white text-xl font-bold">Dinex</span>
        <button
          aria-label="Sair da conta"
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition flex items-center gap-2"
          disabled={loggingOut}
        >
          {loggingOut ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          ) : (
            <>
              {/* Ícone de logout do Heroicons */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                />
              </svg>
              Sair
            </>
          )}
        </button>

      </header>
      {/* padding-top para não sobrepor o header */}
      <main className="flex-1 flex flex-col items-center justify-center pt-16">
        <Outlet />
      </main>
    </div>
  );
}
