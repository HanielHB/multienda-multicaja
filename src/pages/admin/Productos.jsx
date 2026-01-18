import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = '/api';

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/productos`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener productos');
            }

            const result = await response.json();
            setProductos(result.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/productos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar producto');
            }

            // Refresh the list
            fetchProductos();
        } catch (err) {
            alert('Error al eliminar: ' + err.message);
        }
    };

    const getStockStatus = (producto) => {
        const stock = producto.stockActual ?? producto.stock ?? 0;
        const stockMinimo = producto.stockMinimo ?? 5;
        const unidad = producto.unidadMedida === 'Par' ? 'Pares' : 'Unidades';

        if (stock === 0) {
            return {
                label: 'Agotado',
                bgClass: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                dotClass: 'bg-red-500',
                cantidad: `0 ${unidad}`
            };
        } else if (stock <= stockMinimo) {
            return {
                label: 'Bajo Stock',
                bgClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                dotClass: 'bg-amber-500',
                cantidad: `${stock} ${unidad}`
            };
        } else {
            return {
                label: 'En Stock',
                bgClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
                dotClass: 'bg-emerald-500',
                cantidad: `${stock} ${unidad}`
            };
        }
    };

    const getCategoryIcon = (categoria) => {
        const iconMap = {
            'Deportivo': 'sports_soccer',
            'Formal': 'business_center',
            'Botas': 'hiking',
            'Sandalias': 'beach_access',
            'Niños': 'child_care',
            'Damas': 'woman',
            'Caballeros': 'man',
            'Casual': 'do_not_step',
            'Accesorios': 'checkroom'
        };
        return iconMap[categoria] || 'inventory_2';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                <span className="material-symbols-outlined text-red-500 text-4xl mb-2">error</span>
                <p className="text-red-700 dark:text-red-400">{error}</p>
                <button
                    onClick={fetchProductos}
                    className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

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
                    </Link>
                </div>
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
                                <th className="py-4 px-6 text-xs font-bold text-neutral-gray dark:text-gray-400 uppercase tracking-wider w-[30%]">Descripción del Producto</th>
                                <th className="py-4 px-6 text-xs font-bold text-neutral-gray dark:text-gray-400 uppercase tracking-wider text-right">Precio Venta</th>
                                <th className="py-4 px-6 text-xs font-bold text-neutral-gray dark:text-gray-400 uppercase tracking-wider text-right hidden lg:table-cell">Precio Compra</th>
                                <th className="py-4 px-6 text-xs font-bold text-neutral-gray dark:text-gray-400 uppercase tracking-wider text-center">Talla</th>
                                <th className="py-4 px-6 text-xs font-bold text-neutral-gray dark:text-gray-400 uppercase tracking-wider text-center">Color</th>
                                <th className="py-4 px-6 text-xs font-bold text-neutral-gray dark:text-gray-400 uppercase tracking-wider text-center">Inventario</th>
                                <th className="py-4 px-6 text-xs font-bold text-neutral-gray dark:text-gray-400 uppercase tracking-wider text-right w-[150px]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {productos.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center">
                                        <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-6xl mb-4 block">inventory_2</span>
                                        <p className="text-neutral-gray dark:text-gray-400">No hay productos registrados</p>
                                        <Link to="/admin/productos/add" className="text-primary hover:underline text-sm mt-2 inline-block">
                                            Agregar primer producto
                                        </Link>
                                    </td>
                                </tr>
                            ) : (
                                productos.map((producto) => {
                                    const stockStatus = getStockStatus(producto);
                                    return (
                                        <tr key={producto.id} className="group hover:bg-background-light dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-lg bg-background-light dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-neutral-gray">
                                                            {getCategoryIcon(producto.categoria?.nombre)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{producto.nombre}</p>
                                                        <p className="text-neutral-gray dark:text-gray-400 text-xs">
                                                            SKU: {producto.codigoBarras || producto.codigoInterno || 'N/A'}
                                                            {producto.categoria && ` • ${producto.categoria.nombre}`}
                                                        </p>
                                                        {(producto.sucursal || producto.almacen) && (
                                                            <p className="text-neutral-gray dark:text-gray-500 text-xs mt-0.5">
                                                                {producto.sucursal?.nombre}{producto.almacen && ` → ${producto.almacen.nombre}`}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <span className="font-bold text-gray-900 dark:text-white text-sm">
                                                    ${parseFloat(producto.precioVenta).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right hidden lg:table-cell">
                                                <span className="text-neutral-gray dark:text-gray-400 text-sm">
                                                    ${parseFloat(producto.precioCompra).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                                    {producto.talla || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                                    {producto.color || 'N/A'}
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
                                                    <Link
                                                        to={`/admin/productos/edit/${producto.id}`}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-primary bg-blue-50 hover:bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-colors border border-transparent"
                                                        title="Editar Producto"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                                        <span className="hidden sm:inline">Editar</span>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(producto.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-destructive-red bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors border border-transparent"
                                                        title="Eliminar Producto"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                                        <span className="hidden sm:inline">Eliminar</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-white dark:bg-background-dark border-t border-border-light dark:border-border-dark flex items-center justify-between">
                    <span className="text-sm text-neutral-gray dark:text-gray-400">
                        Mostrando <span className="font-medium text-gray-900 dark:text-white">{productos.length}</span> productos
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
