import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./shared/providers/AuthProvider";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PrivateRoute from "./shared/components/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Login />} />
            {/* outras rotas públicas */}
          </Route>
          {/* Rotas privadas (protegidas por auth) */}
          <Route element={<PrivateRoute />}>
            <Route element={<PrivateLayout />}>
              <Route path="/home" element={<Home />} />
              {/* outras rotas privadas */}
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
