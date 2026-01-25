import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();

  // Check if current path matches
  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-dark-charcoal dark:text-background-light">
      <div className="relative flex min-h-screen w-full">

        {/* SideNavBar - Fixed */}
        <aside className="fixed top-0 left-0 h-screen w-64 flex flex-col justify-between border-r border-border-light bg-white p-4 dark:border-border-dark dark:bg-background-dark overflow-y-auto z-40">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3 px-2">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">store</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-dark-charcoal dark:text-white text-base font-bold leading-normal">Zapatería Veloz</h1>
                <p className="text-neutral-gray text-sm font-normal leading-normal">Panel Admin</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive('/admin') && location.pathname === '/admin' || isActive('/admin/dashboard')
                  ? 'bg-primary/10 text-primary'
                  : 'text-neutral-gray hover:bg-primary/10 hover:text-primary'
                  }`}
                to="/admin/dashboard"
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={isActive('/admin') && location.pathname === '/admin' || isActive('/admin/dashboard') ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  dashboard
                </span>
                <p className={`text-sm leading-normal ${isActive('/admin') && location.pathname === '/admin' || isActive('/admin/dashboard') ? 'font-bold' : 'font-medium'}`}>
                  Dashboard
                </p>
              </Link>
              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive('/admin/productos') || location.pathname.startsWith('/admin/productos')
                  ? 'bg-primary/10 text-primary'
                  : 'text-neutral-gray hover:bg-primary/10 hover:text-primary'
                  }`}
                to="/admin/productos"
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={isActive('/admin/productos') || location.pathname.startsWith('/admin/productos') ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  inventory_2
                </span>
                <p className={`text-sm leading-normal ${isActive('/admin/productos') || location.pathname.startsWith('/admin/productos') ? 'font-bold' : 'font-medium'}`}>
                  Productos
                </p>
              </Link>
              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive('/admin/categorias') || location.pathname.startsWith('/admin/categorias')
                  ? 'bg-primary/10 text-primary'
                  : 'text-neutral-gray hover:bg-primary/10 hover:text-primary'
                  }`}
                to="/admin/categorias"
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={isActive('/admin/categorias') || location.pathname.startsWith('/admin/categorias') ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  category
                </span>
                <p className={`text-sm leading-normal ${isActive('/admin/categorias') || location.pathname.startsWith('/admin/categorias') ? 'font-bold' : 'font-medium'}`}>
                  Categorías
                </p>
              </Link>
              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive('/admin/proveedores') || location.pathname.startsWith('/admin/proveedores')
                  ? 'bg-primary/10 text-primary'
                  : 'text-neutral-gray hover:bg-primary/10 hover:text-primary'
                  }`}
                to="/admin/proveedores"
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={isActive('/admin/proveedores') || location.pathname.startsWith('/admin/proveedores') ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  local_shipping
                </span>
                <p className={`text-sm leading-normal ${isActive('/admin/proveedores') || location.pathname.startsWith('/admin/proveedores') ? 'font-bold' : 'font-medium'}`}>
                  Proveedores
                </p>
              </Link>
              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive('/admin/metodos-pago') || location.pathname.startsWith('/admin/metodos-pago')
                  ? 'bg-primary/10 text-primary'
                  : 'text-neutral-gray hover:bg-primary/10 hover:text-primary'
                  }`}
                to="/admin/metodos-pago"
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={isActive('/admin/metodos-pago') || location.pathname.startsWith('/admin/metodos-pago') ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  payments
                </span>
                <p className={`text-sm leading-normal ${isActive('/admin/metodos-pago') || location.pathname.startsWith('/admin/metodos-pago') ? 'font-bold' : 'font-medium'}`}>
                  Métodos de Pago
                </p>
              </Link>
              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive('/admin/clientes') || location.pathname.startsWith('/admin/clientes')
                  ? 'bg-primary/10 text-primary'
                  : 'text-neutral-gray hover:bg-primary/10 hover:text-primary'
                  }`}
                to="/admin/clientes"
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={isActive('/admin/clientes') || location.pathname.startsWith('/admin/clientes') ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  group
                </span>
                <p className={`text-sm leading-normal ${isActive('/admin/clientes') || location.pathname.startsWith('/admin/clientes') ? 'font-bold' : 'font-medium'}`}>
                  Clientes
                </p>
              </Link>
              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive('/admin/sucursales') || location.pathname.startsWith('/admin/sucursales')
                  ? 'bg-primary/10 text-primary'
                  : 'text-neutral-gray hover:bg-primary/10 hover:text-primary'
                  }`}
                to="/admin/sucursales"
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={isActive('/admin/sucursales') || location.pathname.startsWith('/admin/sucursales') ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  point_of_sale
                </span>
                <p className={`text-sm leading-normal ${isActive('/admin/sucursales') || location.pathname.startsWith('/admin/sucursales') ? 'font-bold' : 'font-medium'}`}>
                  Sucursales
                </p>
              </Link>
              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive('/admin/usuarios') || location.pathname.startsWith('/admin/usuarios')
                  ? 'bg-primary/10 text-primary'
                  : 'text-neutral-gray hover:bg-primary/10 hover:text-primary'
                  }`}
                to="/admin/usuarios"
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={isActive('/admin/usuarios') || location.pathname.startsWith('/admin/usuarios') ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  manage_accounts
                </span>
                <p className={`text-sm leading-normal ${isActive('/admin/usuarios') || location.pathname.startsWith('/admin/usuarios') ? 'font-bold' : 'font-medium'}`}>
                  Usuarios
                </p>
              </Link>
              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive('/admin/almacenes') || location.pathname.startsWith('/admin/almacenes')
                  ? 'bg-primary/10 text-primary'
                  : 'text-neutral-gray hover:bg-primary/10 hover:text-primary'
                  }`}
                to="/admin/almacenes"
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={isActive('/admin/almacenes') || location.pathname.startsWith('/admin/almacenes') ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  warehouse
                </span>
                <p className={`text-sm leading-normal ${isActive('/admin/almacenes') || location.pathname.startsWith('/admin/almacenes') ? 'font-bold' : 'font-medium'}`}>
                  Almacenes
                </p>
              </Link>
              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive('/admin/inventario') || location.pathname.startsWith('/admin/inventario')
                  ? 'bg-primary/10 text-primary'
                  : 'text-neutral-gray hover:bg-primary/10 hover:text-primary'
                  }`}
                to="/admin/inventario"
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={isActive('/admin/inventario') || location.pathname.startsWith('/admin/inventario') ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  inventory
                </span>
                <p className={`text-sm leading-normal ${isActive('/admin/inventario') || location.pathname.startsWith('/admin/inventario') ? 'font-bold' : 'font-medium'}`}>
                  Inventario
                </p>
              </Link>
              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive('/admin/apertura-cajas') || location.pathname.startsWith('/admin/apertura-cajas')
                  ? 'bg-primary/10 text-primary'
                  : 'text-neutral-gray hover:bg-primary/10 hover:text-primary'
                  }`}
                to="/admin/apertura-cajas"
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={isActive('/admin/apertura-cajas') || location.pathname.startsWith('/admin/apertura-cajas') ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  point_of_sale
                </span>
                <p className={`text-sm leading-normal ${isActive('/admin/apertura-cajas') || location.pathname.startsWith('/admin/apertura-cajas') ? 'font-bold' : 'font-medium'}`}>
                  Apertura Cajas
                </p>
              </Link>
              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive('/admin/punto-venta') || location.pathname.startsWith('/admin/punto-venta')
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : 'text-neutral-gray hover:bg-emerald-500/10 hover:text-emerald-600'
                  }`}
                to="/admin/punto-venta"
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={isActive('/admin/punto-venta') || location.pathname.startsWith('/admin/punto-venta') ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  storefront
                </span>
                <p className={`text-sm leading-normal ${isActive('/admin/punto-venta') || location.pathname.startsWith('/admin/punto-venta') ? 'font-bold' : 'font-medium'}`}>
                  Punto de Venta
                </p>
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-1">
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-neutral-gray hover:bg-primary/10 hover:text-primary" to="#">
              <span className="material-symbols-outlined text-2xl">help_outline</span>
              <p className="text-sm font-medium leading-normal">Ayuda</p>
            </Link>
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-neutral-gray hover:bg-primary/10 hover:text-primary" to="/">
              <span className="material-symbols-outlined text-2xl">logout</span>
              <p className="text-sm font-medium leading-normal">Cerrar Sesión</p>
            </Link>
          </div>
        </aside>

        {/* Main Content - with left margin to account for fixed sidebar */}
        <main className="flex-1 ml-64 p-6 lg:p-10 min-h-screen overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}