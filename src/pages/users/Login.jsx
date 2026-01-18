import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = '/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // Guardar token y datos del usuario en localStorage
      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Redirigir al dashboard de admin
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display h-screen w-full overflow-hidden flex items-center justify-center">
      <div className="relative w-full max-w-md p-6">
        <div className="bg-white dark:bg-background-dark dark:border dark:border-border-dark rounded-xl shadow-lg w-full overflow-hidden">
          <div className="p-8 flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex flex-col items-center gap-3 mb-2">
              <div
                className="bg-center bg-no-repeat bg-cover rounded-full size-16 shadow-sm border border-gray-100 dark:border-border-dark flex items-center justify-center bg-primary/10"
              >
                <span className="material-symbols-outlined text-primary text-4xl">
                  store
                </span>
              </div>
              <div className="text-center">
                <h1 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight">
                  Zapatería Veloz
                </h1>
                <p className="text-neutral-gray dark:text-gray-400 text-sm font-medium mt-1">
                  Inicio de Sesión POS
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-[20px]">error</span>
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Form Section */}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Email/Usuario Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-gray-700 dark:text-gray-300 text-sm font-semibold"
                  htmlFor="email"
                >
                  Usuario o Correo
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray material-symbols-outlined text-[20px]">
                    person
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-neutral-gray dark:placeholder:text-gray-500"
                    id="email"
                    placeholder="ej. usuario@zapateria.com"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-gray-700 dark:text-gray-300 text-sm font-semibold"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray material-symbols-outlined text-[20px]">
                    lock
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-neutral-gray dark:placeholder:text-gray-500"
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="mt-4 w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all shadow-md shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:ring-offset-background-dark disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Iniciando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">login</span>
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            {/* Footer Section */}
            <div className="pt-4 border-t border-border-light dark:border-border-dark text-center">
              <p className="text-neutral-gray dark:text-gray-500 text-xs">
                © 2024 Zapatería Veloz. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}