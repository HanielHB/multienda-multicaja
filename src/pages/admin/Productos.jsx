import React from 'react';
import { Link } from 'react-router-dom';

export default function Productos() {
    // Sample product data matching the HTML structure
    const productos = [
        {
            id: 1,
            nombre: 'Botas de Montaña X-Trail',
            sku: 'BTA-001',
            tallas: 'Tallas: 38-45',
            icon: 'hiking',
            precioVenta: 89.99,
            precioCompra: 45.00,
            seVendePor: 'Par',
            stock: 45,
            estadoStock: 'en_stock'
        },
        {
            id: 2,
            nombre: 'Zapatillas Urbanas Classic',
            sku: 'ZPT-023',
            tallas: 'Tallas: 36-44',
            icon: 'do_not_step',
            precioVenta: 55.00,
            precioCompra: 28.50,
            seVendePor: 'Par',
            stock: 5,
            estadoStock: 'bajo_stock'
        },
        {
            id: 3,
            nombre: 'Patines Profesionales Pro',
            sku: 'PAT-099',
            tallas: 'Tallas: Ajustable',
            icon: 'roller_skating',
            precioVenta: 120.00,
            precioCompra: 65.00,
            seVendePor: 'Par',
            stock: 0,
            estadoStock: 'agotado'
        },
        {
            id: 4,
            nombre: 'Cordones Premium (Pack 3)',
            sku: 'ACC-004',
            tallas: 'Colores Varios',
            icon: 'checkroom',
            precioVenta: 8.50,
            precioCompra: 2.10,
            seVendePor: 'Unidad',
            stock: 120,
            estadoStock: 'en_stock'
        },
        {
            id: 5,
            nombre: 'Mocasines de Cuero',
            sku: 'MOC-012',
            tallas: 'Tallas: 40-43',
            icon: 'steps',
            precioVenta: 115.00,
            precioCompra: 60.00,
            seVendePor: 'Par',
            stock: 18,
            estadoStock: 'en_stock'
        },
    ];

    const getStockStatus = (estado, stock, seVendePor) => {
        const unidad = seVendePor === 'Par' ? 'Pares' : 'Unidades';
        switch (estado) {
            case 'en_stock':
                return {
                    label: 'En Stock',
                    bgClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
                    dotClass: 'bg-emerald-500',
                    cantidad: `${stock} ${unidad}`
                };
            case 'bajo_stock':
                return {
                    label: 'Bajo Stock',
                    bgClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                    dotClass: 'bg-amber-500',
                    cantidad: `${stock} ${unidad}`
                };
            case 'agotado':
                return {
                    label: 'Agotado',
                    bgClass: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                    dotClass: 'bg-red-500',
                    cantidad: `0 ${unidad}`
                };
            default:
                return {
                    label: 'En Stock',
                    bgClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
                    dotClass: 'bg-emerald-500',
                    cantidad: `${stock} ${unidad}`
                };
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lista de Productos</h2>
                    <p className="text-neutral-gray dark:text-gray-400 text-sm mt-1">Gestiona el catálogo de calzado y existencias.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all">
                        <span className="material-symbols-outlined text-[20px]">download</span> Exportar
                    </button>
                    <Link to="/admin/productos/add" className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all">
                        <span className="material-symbols-outlined text-[20px]">add</span> Nuevo Producto
                    </Link>                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white dark:bg-background-dark dark:border dark:border-border-dark rounded-xl shadow-sm border border-border-light p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray material-symbols-outlined text-[20px]">search</span>
                    <input
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-neutral-gray"
                        placeholder="Buscar por nombre, código o categoría..."
                        type="text"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <select className="px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer min-w-[140px]">
                        <option value="">Categoría</option>
                        <option value="deportivo">Deportivo</option>
                        <option value="formal">Formal</option>
                        <option value="botas">Botas</option>
                        <option value="sandalias">Sandalias</option>
                    </select>
                    <select className="px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer min-w-[140px]">
                        <option value="">Estado Stock</option>
                        <option value="in_stock">En Stock</option>
                        <option value="low_stock">Stock Bajo</option>
                        <option value="out_of_stock">Agotado</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-background-dark dark:border dark:border-border-dark rounded-xl shadow-sm border border-border-light overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background-light dark:bg-gray-900/50 border-b border-border-light dark:border-border-dark">
                                <th className="py-4 px-6 text-xs font-bold text-neutral-gray dark:text-gray-400 uppercase tracking-wider w-[35%]">Descripción del Producto</th>
                                <th className="py-4 px-6 text-xs font-bold text-neutral-gray dark:text-gray-400 uppercase tracking-wider text-right">Precio Venta</th>
                                <th className="py-4 px-6 text-xs font-bold text-neutral-gray dark:text-gray-400 uppercase tracking-wider text-right hidden lg:table-cell">Precio Compra</th>
                                <th className="py-4 px-6 text-xs font-bold text-neutral-gray dark:text-gray-400 uppercase tracking-wider text-center">Se Vende Por</th>
                                <th className="py-4 px-6 text-xs font-bold text-neutral-gray dark:text-gray-400 uppercase tracking-wider text-center">Inventario</th>
                                <th className="py-4 px-6 text-xs font-bold text-neutral-gray dark:text-gray-400 uppercase tracking-wider text-right w-[180px]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {productos.map((producto) => {
                                const stockStatus = getStockStatus(producto.estadoStock, producto.stock, producto.seVendePor);
                                return (
                                    <tr key={producto.id} className="group hover:bg-background-light dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-lg bg-background-light dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-neutral-gray">{producto.icon}</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{producto.nombre}</p>
                                                    <p className="text-neutral-gray dark:text-gray-400 text-xs">SKU: {producto.sku} • {producto.tallas}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className="font-bold text-gray-900 dark:text-white text-sm">${producto.precioVenta.toFixed(2)}</span>
                                        </td>
                                        <td className="py-4 px-6 text-right hidden lg:table-cell">
                                            <span className="text-neutral-gray dark:text-gray-400 text-sm">${producto.precioCompra.toFixed(2)}</span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${producto.seVendePor === 'Par'
                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                : 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                                }`}>
                                                {producto.seVendePor}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${stockStatus.bgClass}`}>
                                                    <span className={`size-1.5 rounded-full ${stockStatus.dotClass}`}></span>
                                                    {stockStatus.label}
                                                </span>
                                                <span className="text-xs text-neutral-gray mt-1">{stockStatus.cantidad}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-primary bg-blue-50 hover:bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors border border-transparent" title="Editar Producto">
                                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                                    <span className="hidden sm:inline">Editar</span>
                                                </button>
                                                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-destructive-red bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors border border-transparent" title="Eliminar Producto">
                                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                                    <span className="hidden sm:inline">Eliminar</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-white dark:bg-background-dark border-t border-border-light dark:border-border-dark flex items-center justify-between">
                    <span className="text-sm text-neutral-gray dark:text-gray-400">
                        Mostrando <span className="font-medium text-gray-900 dark:text-white">1</span> a <span className="font-medium text-gray-900 dark:text-white">5</span> de <span className="font-medium text-gray-900 dark:text-white">128</span> resultados
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg border border-border-light dark:border-border-dark text-neutral-gray dark:text-gray-400 hover:bg-background-light dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>
                        <button className="p-2 rounded-lg border border-border-light dark:border-border-dark text-neutral-gray dark:text-gray-400 hover:bg-background-light dark:hover:bg-gray-700 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
