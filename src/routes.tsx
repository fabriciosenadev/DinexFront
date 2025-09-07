import Home from "./pages/Home";
import Login from "./pages/Login";
import BrokersPage from "./pages/BrokersPage";
import WalletsPage from "./pages/WalletsPage";
import AssetsPage from "./pages/AssetsPage";
import OperationsPage from "./pages/OperationsPage";
import ReportsPage from "./pages/ReportsPage";
// import SettingsPage from "./pages/SettingsPage";
import ImportPage from "./pages/ImportPage";
import SettingsHome from "./pages/SettingsHome";

export const publicRoutes = [
  { path: "/", element: <Login /> },
];

export const privateRoutes = [
  { path: "/dashboard", element: <Home /> },
  { path: "/assets", element: <AssetsPage /> },
  { path: "/operations", element: <OperationsPage /> },
  { path: "/import", element: <ImportPage /> },
  { path: "/wallets", element: <WalletsPage /> },

  { path: "/reports", element: <ReportsPage /> },

  // Configurações (hub + filhos)
  // { path: "/settings", element: <SettingsPage /> },
  { path: "/settings", element: <SettingsHome /> },
  { path: "/settings/brokers", element: <BrokersPage /> },
  // reserve: { path: "/settings/preferences", element: <div>Em breve</div> },
];

