import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";
import { notification } from "../shared/services/notification";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { MENU } from "./PrivateMenu";


export default function PrivateLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // para drawer mobile
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    logout();
    notification.success("Logout realizado com sucesso!");
    setLoggingOut(false);
    setTimeout(() => {
      navigate("/");
    }, 200);
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Sidebar */}
      <aside className={`
        bg-slate-900 text-white w-60 flex-shrink-0 h-screen hidden sm:flex flex-col 
        justify-between py-6 px-4 fixed sm:relative z-30
      `}>
        <div>
          <div className="text-2xl font-bold mb-8">Dinex</div>
          <nav>
            <ul className="flex flex-col gap-3">
              {MENU.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className="hover:bg-slate-800 rounded px-3 py-2 flex items-center"
                    onClick={() => setOpen && setOpen(false)}
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
            <svg className="animate-spin h-5 w-5" /* ... spinner svg ... */ />
          ) : (
            <>
              <LogOut className="w-5 h-5" /> Sair
            </>
          )}
        </button>
      </aside>

      {/* Sidebar mobile drawer */}
      {/* ...drawer com overlay e botão de abrir/fechar, semelhante ao exemplo do mockup... */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex"
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
                        onClick={() => setOpen && setOpen(false)}
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

      {/* Main content */}
      <div className="flex-1 min-h-screen sm:ml-60 flex flex-col">
        {/* Topbar mobile (com menu hamburguer) */}
        <header className="sm:hidden fixed w-full top-0 left-0 bg-slate-900 flex items-center justify-between px-4 h-16 z-40">
          <button
            className="text-white"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            {/* Ícone de hambúrguer */}
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span className="text-xl font-bold text-white">Dinex</span>
          <div></div>
        </header>
        {/* padding para não sobrepor header mobile */}
        <main className="flex-1 pt-16 px-2 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

