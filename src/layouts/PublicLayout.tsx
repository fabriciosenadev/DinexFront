import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
      <Outlet />
    </div>
  );
}
