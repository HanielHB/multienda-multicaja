import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // Si no hay token, redirigir al login
    // replace={true} evita que se pueda volver atrás a esta ruta protegida
    return <Navigate to="/" replace />;
  }

  // Si hay token, renderizar el contenido protegido
  return children;
}
