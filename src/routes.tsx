import Home from "./pages/Home";
import Login from "./pages/Login";
import BrokersPage from "./pages/BrokersPage";
import WalletsPage from "./pages/WalletsPage";
import AssetsPage from "./pages/AssetsPage";
import OperationsPage from "./pages/OperationsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import ImportPage from "./pages/ImportPage";

export const publicRoutes = [
  { path: "/", element: <Login /> },
];

export const privateRoutes = [
  { path: "/dashboard", element: <Home /> },
  { path: "/brokers", element: <BrokersPage /> },
  { path: "/wallets", element: <WalletsPage /> },
  { path: "/assets", element: <AssetsPage /> },
  { path: "/operations", element: <OperationsPage /> },
  { path: "/reports", element: <ReportsPage /> },
  { path: "/settings", element: <SettingsPage /> },
  { path: "/import", element: <ImportPage /> },
];

