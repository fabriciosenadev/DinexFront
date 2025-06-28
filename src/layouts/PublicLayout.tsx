import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
      {/* Header fixo */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center px-6 bg-slate-900 shadow z-20">
        <span className="text-white text-xl font-bold">Dinex</span>
        {/* Se quiser botão ou nav aqui */}
      </header>
      {/* Conteúdo não fica escondido pelo header */}
      <main className="flex-1 flex flex-col items-center justify-center pt-16 w-full">
        <Outlet />
      </main>
    </div>
  );
}
