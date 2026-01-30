import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css'; // Estilos globales

// --- Importa tus Layouts ---
import AdminLayout from './layouts/AdminLayout.jsx'; // Layout de ADMIN
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Componente de Ruta Protegida

// --- Importa tus Páginas ---
import Login from './pages/users/Login.jsx';
import Productos from './pages/admin/Productos.jsx';
import AddProducto from './pages/admin/AddProducto.jsx';
import Categorias from './pages/admin/Categorias.jsx';
import AddCategoria from './pages/admin/AddCategoria.jsx';
import Proveedores from './pages/admin/Proveedores.jsx';
import AddProveedor from './pages/admin/AddProveedor.jsx';
import MetodosPago from './pages/admin/MetodosPago.jsx';
import Clientes from './pages/admin/Clientes.jsx';
import Sucursales from './pages/admin/Sucursales.jsx';
import Usuarios from './pages/admin/Usuarios.jsx';
import Almacenes from './pages/admin/Almacenes.jsx';
import Inventario from './pages/admin/Inventario.jsx';
import AperturaCajas from './pages/admin/AperturaCajas.jsx';
import PuntoVenta from './pages/admin/PuntoVenta.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Reportes from './pages/admin/Reportes.jsx';

// Define las rutas
const router = createBrowserRouter([
  {
    // --- RUTA LOGIN ---
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    // --- RUTAS DE ADMIN ---
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ProtectedRoute allowedRoles={['administrador', 'supervisor']}><Dashboard /></ProtectedRoute>
      },
      {
        path: 'dashboard',
        element: <ProtectedRoute allowedRoles={['administrador', 'supervisor']}><Dashboard /></ProtectedRoute>
      },
      {
        path: 'productos',
        element: <ProtectedRoute allowedRoles={['administrador', 'supervisor']}><Productos /></ProtectedRoute>
      },
      {
        path: 'productos/add',
        element: <ProtectedRoute allowedRoles={['administrador', 'supervisor']}><AddProducto /></ProtectedRoute>
      },
      {
        path: 'productos/edit/:id',
        element: <ProtectedRoute allowedRoles={['administrador', 'supervisor']}><AddProducto /></ProtectedRoute>
      },
      {
        path: 'categorias',
        element: <ProtectedRoute allowedRoles={['administrador']}><Categorias /></ProtectedRoute>
      },
      {
        path: 'categorias/add',
        element: <ProtectedRoute allowedRoles={['administrador']}><AddCategoria /></ProtectedRoute>
      },
      {
        path: 'categorias/edit/:id',
        element: <ProtectedRoute allowedRoles={['administrador']}><AddCategoria /></ProtectedRoute>
      },
      {
        path: 'proveedores',
        element: <ProtectedRoute allowedRoles={['administrador']}><Proveedores /></ProtectedRoute>
      },
      {
        path: 'proveedores/add',
        element: <ProtectedRoute allowedRoles={['administrador']}><AddProveedor /></ProtectedRoute>
      },
      {
        path: 'metodos-pago',
        element: <ProtectedRoute allowedRoles={['administrador']}><MetodosPago /></ProtectedRoute>
      },
      {
        path: 'clientes',
        element: <ProtectedRoute allowedRoles={['administrador', 'supervisor']}><Clientes /></ProtectedRoute>
      },
      {
        path: 'sucursales',
        element: <ProtectedRoute allowedRoles={['administrador']}><Sucursales /></ProtectedRoute>
      },
      {
        path: 'usuarios',
        element: <ProtectedRoute allowedRoles={['administrador', 'supervisor']}><Usuarios /></ProtectedRoute>
      },
      {
        path: 'almacenes',
        element: <ProtectedRoute allowedRoles={['administrador']}><Almacenes /></ProtectedRoute>
      },
      {
        path: 'inventario',
        element: <ProtectedRoute allowedRoles={['administrador', 'supervisor']}><Inventario /></ProtectedRoute>
      },
      {
        path: 'apertura-cajas',
        element: <ProtectedRoute allowedRoles={['administrador', 'supervisor', 'cajero']}><AperturaCajas /></ProtectedRoute>
      },
      {
        path: 'punto-venta',
        element: <ProtectedRoute allowedRoles={['administrador', 'supervisor', 'cajero']}><PuntoVenta /></ProtectedRoute>
      },
      {
        path: 'reportes',
        element: <ProtectedRoute allowedRoles={['administrador', 'supervisor']}><Reportes /></ProtectedRoute>
      },
    ]
  }
]);

// Renderiza la aplicación
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);