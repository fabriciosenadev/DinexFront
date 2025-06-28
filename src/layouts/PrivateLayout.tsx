import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../shared/hooks/useAuth";

export default function PrivateLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <header className="w-full h-16 flex items-center px-6 bg-slate-900 shadow justify-between">
        <span className="text-white text-xl font-bold">Dinex</span>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition"
        >
          Sair
        </button>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}
