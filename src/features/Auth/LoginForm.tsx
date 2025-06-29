// src/features/Auth/LoginForm.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "./auth.service";
import { useAuth } from "../../shared/hooks/useAuth";
import { notification } from "../../shared/services/notification";
import { LogIn } from "lucide-react";


export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      login(data);         // Atualiza contexto + localStorage
      notification.success("Login realizado com sucesso!");
      navigate("/home");         // Redireciona para rota protegida
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao autenticar");
        notification.error("Erro ao autenticar");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Login</h2>
      <input
        type="email"
        autoComplete="current-email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
        required
      />
      <input
        type="password"
        autoComplete="current-password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
        required
      />
      {error && <div className="text-red-400 text-center">{error}</div>}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Entrando...
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5 mr-2" />
            Entrar
          </>
        )}
      </button>
    </form>
  );
}
