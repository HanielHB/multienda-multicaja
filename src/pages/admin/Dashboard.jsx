import React, { useState, useEffect } from 'react';

export default function Dashboard() {
    const [activeFilter, setActiveFilter] = useState('todo');
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Sample data
    const stats = {
        ventas: 15420.50,
        productosVendidos: 347,
        ganancias: 4250.75,
        cambioVentas: 12.5,
        cambioProductos: 8.3,
        cambioGanancias: -2.1
    };

    const movimientosCaja = [
        { id: 1, fecha: '31/12/2025', caja: 'Caja Principal', tipo: 'Ingreso', usuario: 'admin', monto: 500.00 },
        { id: 2, fecha: '31/12/2025', caja: 'Caja 1', tipo: 'Venta', usuario: 'vendedor1', monto: 125.50 },
        { id: 3, fecha: '31/12/2025', caja: 'Caja Principal', tipo: 'Retiro', usuario: 'admin', monto: -200.00 },
        { id: 4, fecha: '30/12/2025', caja: 'Caja 2', tipo: 'Venta', usuario: 'vendedor2', monto: 89.99 },
        { id: 5, fecha: '30/12/2025', caja: 'Caja 1', tipo: 'Venta', usuario: 'vendedor1', monto: 245.00 },
    ];

    const topProductos = [
        { id: 1, nombre: 'Zapatillas Running Pro', cantidad: 45, monto: 4049.55 },
        { id: 2, nombre: 'Botas de Montaña', cantidad: 32, monto: 4000.00 },
        { id: 3, nombre: 'Tenis Casuales', cantidad: 28, monto: 2100.00 },
        { id: 4, nombre: 'Sandalias Verano', cantidad: 25, monto: 1137.50 },
        { id: 5, nombre: 'Zapatos Formales', cantidad: 18, monto: 2700.00 },
    ];

    const topProductosMonto = [
        { id: 1, nombre: 'Zapatillas Running Pro', monto: 4049.55, porcentaje: 26 },
        { id: 2, nombre: 'Botas de Montaña', monto: 4000.00, porcentaje: 26 },
        { id: 3, nombre: 'Zapatos Formales', monto: 2700.00, porcentaje: 18 },
        { id: 4, nombre: 'Tenis Casuales', monto: 2100.00, porcentaje: 14 },
        { id: 5, nombre: 'Sandalias Verano', monto: 1137.50, porcentaje: 7 },
    ];

    const filters = [
        { id: 'todo', label: 'Todo' },
        { id: '7dias', label: 'Últimos 7 días' },
        { id: '30dias', label: 'Últimos 30 días' },
        { id: '12meses', label: 'Últimos 12 meses' },
        { id: 'hoy', label: 'Hoy' },
        { id: 'porDia', label: 'Por Día' },
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* CSS Animations */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .page-animate { animation: fadeIn 0.4s ease-out; }
        .card-animate { animation: slideUp 0.5s ease-out backwards; }
        .stat-value { animation: countUp 0.6s ease-out backwards; }
        .skeleton { 
          background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .hover-lift { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 40px -10px rgba(0,0,0,0.15); }
        .filter-btn { transition: all 0.2s ease; }
        .filter-btn:hover { transform: translateY(-1px); }
        .filter-active { 
          background: white; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
        }
        .realtime-dot {
          animation: pulse 2s ease-in-out infinite;
        }
        .progress-bar {
          transition: width 1s ease-out;
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        .table-row {
          animation: slideIn 0.3s ease-out backwards;
        }
      `}</style>

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 page-animate">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    Dashboard
                </h1>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-gray-800 rounded-xl">
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeFilter === filter.id
                                    ? 'filter-active text-gray-900 dark:text-white dark:bg-gray-700'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                    <button className="filter-btn px-4 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-all">
                        Limpiar filtro
                    </button>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Ventas Card */}
                <div
                    className="card-animate hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
                    style={{ animationDelay: '0.1s' }}
                >
                    <div className="flex items-start justify-between mb-4">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Ventas</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">$</span>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="skeleton h-8 w-32 rounded-lg mb-2"></div>
                    ) : (
                        <p className="stat-value text-2xl font-black text-gray-900 dark:text-white" style={{ animationDelay: '0.3s' }}>
                            S/ {formatCurrency(stats.ventas)}
                        </p>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                        <span className={`text-xs font-semibold ${stats.cambioVentas >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {stats.cambioVentas >= 0 ? '↑' : '↓'} {Math.abs(stats.cambioVentas)}%
                        </span>
                        <span className="text-xs text-gray-400">al periodo anterior</span>
                    </div>
                </div>

                {/* Productos Vendidos Card */}
                <div
                    className="card-animate hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
                    style={{ animationDelay: '0.2s' }}
                >
                    <div className="flex items-start justify-between mb-4">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Cant. Productos vendidos</span>
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">shopping_bag</span>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="skeleton h-8 w-24 rounded-lg mb-2"></div>
                    ) : (
                        <p className="stat-value text-2xl font-black text-gray-900 dark:text-white" style={{ animationDelay: '0.4s' }}>
                            {stats.productosVendidos}
                        </p>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                        <span className={`text-xs font-semibold ${stats.cambioProductos >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {stats.cambioProductos >= 0 ? '↑' : '↓'} {Math.abs(stats.cambioProductos)}%
                        </span>
                        <span className="text-xs text-gray-400">al periodo anterior</span>
                    </div>
                </div>

                {/* Ganancias Card */}
                <div
                    className="card-animate hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
                    style={{ animationDelay: '0.3s' }}
                >
                    <div className="flex items-start justify-between mb-4">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Ganancias</span>
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">trending_up</span>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="skeleton h-8 w-28 rounded-lg mb-2"></div>
                    ) : (
                        <p className="stat-value text-2xl font-black text-gray-900 dark:text-white" style={{ animationDelay: '0.5s' }}>
                            S/ {formatCurrency(stats.ganancias)}
                        </p>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                        <span className={`text-xs font-semibold ${stats.cambioGanancias >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {stats.cambioGanancias >= 0 ? '↑' : '↓'} {Math.abs(stats.cambioGanancias)}%
                        </span>
                        <span className="text-xs text-gray-400">al periodo anterior</span>
                    </div>
                </div>

                {/* TOP 5 Products by Quantity Card */}
                <div
                    className="card-animate hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm row-span-2"
                    style={{ animationDelay: '0.4s' }}
                >
                    <h3 className="text-lg font-black text-gray-900 dark:text-white text-center mb-1">TOP 5</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">Productos por cantidad vendida</p>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-32">
                            <div className="skeleton w-16 h-16 rounded-xl mb-4"></div>
                            <div className="skeleton h-4 w-24 rounded-lg"></div>
                        </div>
                    ) : topProductos.length > 0 ? (
                        <div className="space-y-3">
                            {topProductos.map((producto, index) => (
                                <div
                                    key={producto.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                                            index === 1 ? 'bg-gray-400' :
                                                index === 2 ? 'bg-amber-600' : 'bg-gray-300 text-gray-600'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{producto.nombre}</p>
                                        <p className="text-xs text-gray-400">{producto.cantidad} unidades</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                            <div className="float-animation">
                                <span className="material-symbols-outlined text-5xl mb-2">inventory_2</span>
                            </div>
                            <p className="text-sm">sin data...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Total Ventas Chart Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div
                    className="card-animate hover-lift lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
                    style={{ animationDelay: '0.5s' }}
                >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Total ventas</h3>
                    {isLoading ? (
                        <div className="skeleton h-12 w-40 rounded-lg mb-4"></div>
                    ) : (
                        <p className="stat-value text-4xl font-black text-gray-900 dark:text-white mb-2" style={{ animationDelay: '0.6s' }}>
                            S/ {formatCurrency(stats.ventas)}
                        </p>
                    )}
                    <div className="flex items-center gap-2 mb-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stats.cambioVentas >= 0
                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            {stats.cambioVentas >= 0 ? '+' : ''}{stats.cambioVentas}% al periodo anterior
                        </span>
                    </div>

                    {/* Simple Chart Visualization */}
                    <div className="h-32 flex items-end gap-2">
                        {[65, 45, 78, 52, 88, 42, 95, 68, 82, 55, 72, 60].map((height, index) => (
                            <div
                                key={index}
                                className="flex-1 bg-gradient-to-t from-primary/80 to-primary/40 rounded-t-lg transition-all duration-500 hover:from-primary hover:to-primary/60"
                                style={{
                                    height: `${height}%`,
                                    animationDelay: `${0.7 + index * 0.05}s`
                                }}
                            ></div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                        <span>Ene</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Abr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Ago</span>
                        <span>Sep</span>
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dic</span>
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div
                    className="card-animate hover-lift bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 shadow-lg shadow-primary/20"
                    style={{ animationDelay: '0.6s' }}
                >
                    <h3 className="text-white/80 text-sm font-medium mb-4">Acciones Rápidas</h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium text-sm transition-all">
                            <span className="material-symbols-outlined">add_shopping_cart</span>
                            Nueva Venta
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium text-sm transition-all">
                            <span className="material-symbols-outlined">inventory</span>
                            Agregar Producto
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium text-sm transition-all">
                            <span className="material-symbols-outlined">receipt_long</span>
                            Ver Reportes
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium text-sm transition-all">
                            <span className="material-symbols-outlined">point_of_sale</span>
                            Abrir Caja
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Movimientos de Caja */}
                <div
                    className="card-animate hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
                    style={{ animationDelay: '0.7s' }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Movimientos de caja</h3>
                        <div className="flex items-center gap-2">
                            <span className="realtime-dot w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-xs text-gray-400">realtime</span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-700">
                                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Fecha ↕
                                    </th>
                                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Caja ↕
                                    </th>
                                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Tipo ↕
                                    </th>
                                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Usuario ↕
                                    </th>
                                    <th className="text-right py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Monto ↕
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {movimientosCaja.map((mov, index) => (
                                    <tr
                                        key={mov.id}
                                        className="table-row border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                        style={{ animationDelay: `${0.8 + index * 0.05}s` }}
                                    >
                                        <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-300">{mov.fecha}</td>
                                        <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-300">{mov.caja}</td>
                                        <td className="py-3 px-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${mov.tipo === 'Ingreso' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    mov.tipo === 'Retiro' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                        'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                {mov.tipo}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-300">{mov.usuario}</td>
                                        <td className={`py-3 px-2 text-sm font-semibold text-right ${mov.monto >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {mov.monto >= 0 ? '+' : ''}S/ {formatCurrency(Math.abs(mov.monto))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <button className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            <span className="text-sm text-gray-500">1 de 1</span>
                            <button className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* TOP 10 Productos por Monto */}
                <div
                    className="card-animate hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
                    style={{ animationDelay: '0.8s' }}
                >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">TOP 10 (productos por monto)</h3>

                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="skeleton w-8 h-8 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="skeleton h-4 w-32 rounded mb-2"></div>
                                        <div className="skeleton h-2 w-full rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : topProductosMonto.length > 0 ? (
                        <div className="space-y-4">
                            {topProductosMonto.map((producto, index) => (
                                <div
                                    key={producto.id}
                                    className="group"
                                    style={{ animationDelay: `${0.9 + index * 0.1}s` }}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                                                    index === 1 ? 'bg-gray-400' :
                                                        index === 2 ? 'bg-amber-600' : 'bg-gray-300 text-gray-600'
                                                }`}>
                                                {index + 1}
                                            </div>
                                            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                {producto.nombre}
                                            </span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                            S/ {formatCurrency(producto.monto)}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="progress-bar h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
                                            style={{ width: `${producto.porcentaje}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <div className="float-animation">
                                <span className="material-symbols-outlined text-6xl mb-3">inventory_2</span>
                            </div>
                            <p className="text-sm">sin data...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
