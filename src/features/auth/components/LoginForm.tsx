import type React from "react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../store/useAuthStore";
import { ConstantesURL } from "../../../constantes";
import { AlertCircle, Loader2 } from "lucide-react";


export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${ConstantesURL.auth}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales inválidas. Inténtalo de nuevo.');
      }
      const userObject= {
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
        id: data.usuarioId || data.id
      };
      setAuth(userObject, data.token);
      navigate({ to: '/dashboard' });

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center">
        <h2 className="text-white text-lg font-semibold mb-2 py-3">Iniciar Sesión</h2>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle size={20} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col w-full">
          <label className="text-white text-sm font-medium mb-2 opacity-90">Email</label>
          <input
            type="email"
            value={email}
            disabled={loading}
            className="px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 outline-none focus:border-orange-500 disabled:opacity-50 transition-colors"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="text-white text-sm font-medium mb-2 opacity-90">Contraseña</label>
          <input
            type="password"
            value={password}
            disabled={loading}
            className="px-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 outline-none focus:border-orange-500 disabled:opacity-50 transition-colors"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <div className="pt-4 w-full">
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-medium w-full py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <span>Ingresar</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};