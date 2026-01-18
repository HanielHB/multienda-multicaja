import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css'; // Estilos globales

// --- Importa tus Layouts ---
import AdminLayout from './layouts/AdminLayout.jsx'; // Layout de ADMIN

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
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'productos',
        element: <Productos />
      },
      {
        path: 'productos/add',
        element: <AddProducto />
      },
      {
        path: 'productos/edit/:id',
        element: <AddProducto />
      },
      {
        path: 'categorias',
        element: <Categorias />
      },
      {
        path: 'categorias/add',
        element: <AddCategoria />
      },
      {
        path: 'categorias/edit/:id',
        element: <AddCategoria />
      },
      {
        path: 'proveedores',
        element: <Proveedores />
      },
      {
        path: 'proveedores/add',
        element: <AddProveedor />
      },
      {
        path: 'metodos-pago',
        element: <MetodosPago />
      },
      {
        path: 'clientes',
        element: <Clientes />
      },
      {
        path: 'sucursales',
        element: <Sucursales />
      },
      {
        path: 'usuarios',
        element: <Usuarios />
      },
      {
        path: 'almacenes',
        element: <Almacenes />
      },
      {
        path: 'inventario',
        element: <Inventario />
      },
      {
        path: 'apertura-cajas',
        element: <AperturaCajas />
      },
      {
        path: 'punto-venta',
        element: <PuntoVenta />
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