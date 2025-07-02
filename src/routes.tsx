// routes.tsx

import Home from "./pages/Home";
import Login from "./pages/Login";
import BrokersPage from "./pages/BrokersPage";
import WalletsPage from "./pages/WalletsPage";
import AssetsPage from "./pages/AssetsPage";
// ... outros imports de página

export const publicRoutes = [
  { path: "/", element: <Login /> },
];

export const privateRoutes = [
  { path: "/home", element: <Home /> },
  { path: "/brokers", element: <BrokersPage /> },
  { path: "/wallets", element: <WalletsPage /> },
  { path: "/assets", element: <AssetsPage /> },
];
