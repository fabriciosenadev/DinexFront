import { Outlet } from "react-router-dom";

export default function PrivateLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <header className="w-full h-16 flex items-center px-6 bg-slate-900 shadow">
        <span className="text-white text-xl font-bold">Dinex</span>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
}
