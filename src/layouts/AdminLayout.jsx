import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if current path matches
  const isActive = (path) => location.pathname === path;

  // Obtener usuario del almacenamiento local
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Estado para sidebar móvil
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Estado para el modal de confirmación de cierre de sesión
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [hasCajaAbierta, setHasCajaAbierta] = React.useState(false);

  // Cerrar sidebar al cambiar de ruta en móvil
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    // Verificar si hay una caja abierta
    const cajaActiva = localStorage.getItem('cajaActiva');
    setHasCajaAbierta(!!cajaActiva);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cajaActiva');
    localStorage.removeItem('sesionCajaId');
    navigate('/');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-dark-charcoal dark:text-background-light">
      <div className="relative flex min-h-screen w-full">

        {/* Mobile Header Bar - visible solo en móviles */}
        <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-background-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-4 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined text-2xl text-gray-700 dark:text-gray-300">menu</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">store</span>
            <span className="font-bold text-gray-900 dark:text-white">Jani Shoes</span>
          </div>
          <div className="w-10" /> {/* Espaciador para centrar título */}
        </header>

        {/* Overlay para cerrar sidebar en móvil */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* SideNavBar - Responsive */}
        <aside className={`fixed inset-y-0 left-0 w-64 flex flex-col justify-between border-r border-border-light bg-white p-4 dark:border-border-dark dark:bg-background-dark overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <div className="flex flex-col gap-8">
            {/* Botón cerrar sidebar móvil */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Cerrar menú"
            >
              <span className="material-symbols-outlined text-gray-500">close</span>
            </button>

            <div className="flex items-center gap-3 px-2">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">store</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-dark-charcoal dark:text-white text-base font-bold leading-normal">Jani Shoes</h1>
                <p className="text-neutral-gray text-sm font-normal leading-normal capitalize">
                  Panel {user.tipo ? user.tipo : 'Usuario'}
                </p>
                <p className="text-neutral-gray text-sm font-normal leading-normal capitalize">
                  Usuario: {user.nombres ? user.nombres : 'Nombres'}
                </p>
              </div>
            </div>
            <nav className="flex flex-col gap-2">
              {/* Dashboard: Admin y Supervisor */}
              {['administrador', 'supervisor'].includes(user?.tipo) && (
                <Link
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive('/admin/dashboard')
                    ? 'bg-primary/10 text-primary'
                    : 'text-neutral-gray hover:bg-primary/10 hover:text-primary'
                    }`}
                  to="/admin/dashboard"
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={isActive('/admin/dashboard') ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    dashboard
                  </span>
                  <p className={`text-sm leading-normal ${isActive('/admin/dashboard') ? 'font-bold' : 'font-medium'}`}>
                    Dashboard
                  </p>
                </Link>
              )}

              {/* Productos: Admin y Supervisor */}
              {['administrador', 'supervisor'].includes(user?.tipo) && (
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
              )}

              {/* Categorías: Solo Admin */}
              {['administrador'].includes(user?.tipo) && (
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
              )}



              {/* Clientes: Admin, Supervisor y Cajero */}
              {['administrador', 'supervisor', 'cajero'].includes(user?.tipo) && (
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
              )}

              {/* Sucursales: Solo Admin */}
              {['administrador'].includes(user?.tipo) && (
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
              )}

              {/* Usuarios: Admin y Supervisor */}
              {['administrador', 'supervisor'].includes(user?.tipo) && (
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
              )}

              {/* Almacenes: Solo Admin (o Supervisor View?) - Plan dice Admin only */}
              {['administrador'].includes(user?.tipo) && (
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
              )}

              {/* Inventario: Admin, Supervisor y Cajero */}
              {['administrador', 'supervisor', 'cajero'].includes(user?.tipo) && (
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
              )}

              {/* Apertura Cajas: Admin, Supervisor, Cajero */}
              {['administrador', 'supervisor', 'cajero'].includes(user?.tipo) && (
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
              )}

              {/* Punto de Venta: Admin, Supervisor, Cajero */}
              {['administrador', 'supervisor', 'cajero'].includes(user?.tipo) && (
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
              )}

              {/* Reportes: Admin y Supervisor */}
              {['administrador', 'supervisor'].includes(user?.tipo) && (
                <Link
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive('/admin/reportes') || location.pathname.startsWith('/admin/reportes')
                    ? 'bg-primary/10 text-primary'
                    : 'text-neutral-gray hover:bg-primary/10 hover:text-primary'
                    }`}
                  to="/admin/reportes"
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={isActive('/admin/reportes') || location.pathname.startsWith('/admin/reportes') ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    bar_chart
                  </span>
                  <p className={`text-sm leading-normal ${isActive('/admin/reportes') || location.pathname.startsWith('/admin/reportes') ? 'font-bold' : 'font-medium'}`}>
                    Reportes
                  </p>
                </Link>
              )}

              {/* Backup: Solo Admin */}
              {['administrador'].includes(user?.tipo) && (
                <Link
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${isActive('/admin/backup') || location.pathname.startsWith('/admin/backup')
                    ? 'bg-primary/10 text-primary'
                    : 'text-neutral-gray hover:bg-primary/10 hover:text-primary'
                    }`}
                  to="/admin/backup"
                >
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={isActive('/admin/backup') || location.pathname.startsWith('/admin/backup') ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    cloud_download
                  </span>
                  <p className={`text-sm leading-normal ${isActive('/admin/backup') || location.pathname.startsWith('/admin/backup') ? 'font-bold' : 'font-medium'}`}>
                    Backup
                  </p>
                </Link>
              )}
            </nav>
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-neutral-gray hover:bg-primary/10 hover:text-primary w-full text-left"
            >
              <span className="material-symbols-outlined text-2xl">logout</span>
              <p className="text-sm font-medium leading-normal">Cerrar Sesión</p>
            </button>
          </div>
        </aside>

        {/* Main Content - responsive margins */}
        <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 p-4 sm:p-6 lg:p-10 min-h-screen overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Modal de confirmación de cierre de sesión */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-md w-full animate-[scaleIn_0.2s_ease-out]">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${hasCajaAbierta
                ? 'bg-amber-100 dark:bg-amber-900/30'
                : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                <span className={`material-symbols-outlined text-3xl ${hasCajaAbierta
                  ? 'text-amber-500'
                  : 'text-blue-500'
                  }`}>
                  {hasCajaAbierta ? 'warning' : 'logout'}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {hasCajaAbierta ? '¡Atención!' : 'Cerrar Sesión'}
              </h3>

              {/* Message */}
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {hasCajaAbierta ? (
                  <>
                    <span className="block font-semibold text-amber-600 dark:text-amber-500 mb-2">
                      Tienes una caja aperturada
                    </span>
                    <span className="block text-sm">
                      Se recomienda cerrar la caja antes de cerrar sesión. ¿Estás seguro de que deseas cerrar sesión de todas formas?
                    </span>
                  </>
                ) : (
                  '¿Estás seguro de que deseas cerrar sesión?'
                )}
              </p>

              {/* Buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmLogout}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all ${hasCajaAbierta
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-red-500 hover:bg-red-600'
                    }`}
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}