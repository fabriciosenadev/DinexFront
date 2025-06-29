import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./shared/providers/AuthProvider";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import PrivateRoute from "./shared/components/PrivateRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
// import TesteNotificacao from "./pages/TesteNotificacao";
import { Toaster } from "sonner"; // Importando Toaster do sonner
import BrokersPage from "./pages/BrokersPage";

export default function App() {
  return (
    <>
    <Toaster position="top-right" offset={64} />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Login />} />
              {/* <Route path="/teste-notificacao" element={<TesteNotificacao />} /> */}
              {/* outras rotas públicas */}
            </Route>
            {/* Rotas privadas (protegidas por auth) */}
            <Route element={<PrivateRoute />}>
              <Route element={<PrivateLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/brokers" element={<BrokersPage />} />
                {/* outras rotas privadas */}
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
