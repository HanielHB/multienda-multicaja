import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const location = useLocation();

  if (!token) {
    // Si no hay token, redirigir al login
    return <Navigate to="/" replace />;
  }

  // Si se especifican roles permitidos y el usuario no tiene uno de ellos
  if (allowedRoles && !allowedRoles.includes(user.tipo)) {
    // Redirigir según el rol del usuario a su página principal permitida
    if (user.tipo === 'cajero') {
      return <Navigate to="/admin/apertura-cajas" replace />;
    } else {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  // Si hay token y permisos validos, renderizar el contenido protegido
  return children;
}
