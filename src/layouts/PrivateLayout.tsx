import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import { notification } from "../shared/services/notification";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { MENU } from "./PrivateMenu";

export default function PrivateLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // drawer mobile
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    logout();
    notification.success("Logout realizado com sucesso!");
    setLoggingOut(false);
    setTimeout(() => navigate("/"), 200);
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Sidebar (desktop) */}
      <aside
        className="
          bg-slate-900 text-white w-60 flex-shrink-0 h-screen hidden sm:flex flex-col 
          justify-between py-6 px-4 relative z-20 overflow-y-auto
        "
      >
        <div>
          <div className="text-2xl font-bold mb-8">Dinex</div>
          <nav>
            <ul className="flex flex-col gap-3">
              {MENU.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className="hover:bg-slate-800 rounded px-3 py-2 flex items-center"
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 w-full text-white font-semibold px-4 py-2 rounded flex items-center justify-center gap-2 mt-6"
          disabled={loggingOut}
        >
          {loggingOut ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
              <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
          ) : (
            <>
              <LogOut className="w-5 h-5" /> Sair
            </>
          )}
        </button>
      </aside>

      {/* Drawer mobile */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex sm:hidden"
          onClick={() => setOpen(false)}
        >
          <aside
            className="bg-slate-900 text-white w-2/3 max-w-xs h-full flex flex-col justify-between py-6 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="text-2xl font-bold mb-8">Dinex</div>
              <nav>
                <ul className="flex flex-col gap-3">
                  {MENU.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className="hover:bg-slate-800 rounded px-3 py-2 flex items-center"
                        onClick={() => setOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="bg-red-600 hover:bg-red-700 w-full text-white font-semibold px-4 py-2 rounded flex items-center justify-center gap-2 mt-6"
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span>Sair</span>
            </button>
          </aside>
        </div>
      )}

      {/* Área de conteúdo */}
      <div className="flex-1 min-h-screen flex flex-col">
        {/* Topbar mobile */}
        <header className="sm:hidden fixed w-full top-0 left-0 bg-slate-900 flex items-center justify-between px-4 h-16 z-40">
          <button
            className="text-white"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-xl font-bold text-white">Dinex</span>
          <div />
        </header>

        {/* Compensação do topbar mobile; sem gutters aqui */}
        <main className="flex-1 pt-16 w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
