import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./shared/providers/AuthProvider";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import PrivateRoute from "./shared/components/PrivateRoute";
import { Toaster } from "sonner";
import { privateRoutes, publicRoutes } from "./routes";

export default function App() {
  return (
    <>
    <Toaster position="top-right" offset={80} />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route element={<PublicLayout />}>
              {publicRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Route>
            {/* Rotas privadas (protegidas por auth) */}
            <Route element={<PrivateRoute />}>
              <Route element={<PrivateLayout />}>
                {privateRoutes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
