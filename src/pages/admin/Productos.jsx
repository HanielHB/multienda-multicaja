import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = '/api';

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    // Estados de filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [sucursalFilter, setSucursalFilter] = useState('');

    // Estado para modal de eliminar
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productoToDelete, setProductoToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Función para determinar el estado de stock de un producto
    const getStockStatusValue = (producto) => {
        const stock = producto.stockActual ?? producto.stock ?? 0;
        const stockMinimo = producto.stockMinimo ?? 5;
        if (stock === 0) return 'out_of_stock';
        if (stock <= stockMinimo) return 'low_stock';
        return 'in_stock';
    };

    // Filtrar productos
    const filteredProducts = productos.filter(producto => {
        // Filtro de búsqueda
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm || 
            producto.nombre?.toLowerCase().includes(searchLower) ||
            producto.codigoBarras?.toLowerCase().includes(searchLower) ||
            producto.codigoInterno?.toLowerCase().includes(searchLower) ||
            producto.categoria?.nombre?.toLowerCase().includes(searchLower);

        // Filtro de categoría
        const matchesCategory = !categoryFilter || 
            producto.categoriaId?.toString() === categoryFilter;

        // Filtro de estado de stock
        const matchesStock = !stockFilter || 
            getStockStatusValue(producto) === stockFilter;

        // Filtro de sucursal
        const matchesSucursal = !sucursalFilter || 
            producto.sucursalId?.toString() === sucursalFilter;

        return matchesSearch && matchesCategory && matchesStock && matchesSucursal;
    });

    // Calcular productos para la página actual (usando productos filtrados)
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Funciones de paginación
    const goToPreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    // Resetear página cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter, stockFilter, sucursalFilter]);

    useEffect(() => {
        fetchProductos();
        fetchCategorias();
        fetchSucursales();
    }, []);

    const fetchCategorias = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/categorias`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const result = await response.json();
                setCategorias(result.data || result || []);
            }
        } catch (err) {
            console.error('Error fetching categorias:', err);
        }
    };

    const fetchSucursales = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/sucursales`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const result = await response.json();
                setSucursales(result.data || result || []);
            }
        } catch (err) {
            console.error('Error fetching sucursales:', err);
        }
    };

    const fetchProductos = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/productos?limit=1000`, {
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
        setDeleting(true);
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

            // Close modal and refresh list
            setShowDeleteModal(false);
            setProductoToDelete(null);
            fetchProductos();
        } catch (err) {
            alert('Error al eliminar: ' + err.message);
        } finally {
            setDeleting(false);
        }
    };

    const openDeleteModal = (producto) => {
        setProductoToDelete(producto);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setProductoToDelete(null);
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

    // Estado para el menú de exportación
    const [showExportMenu, setShowExportMenu] = useState(false);

    // Función para exportar a Excel (CSV)
    const exportToExcel = () => {
        const dataToExport = filteredProducts.map(producto => ({
            'Nombre': producto.nombre,
            'SKU': producto.codigoBarras || producto.codigoInterno || 'N/A',
            'Categoría': producto.categoria?.nombre || 'N/A',
            'Precio Venta': parseFloat(producto.precioVenta).toFixed(2),
            'Precio Compra': parseFloat(producto.precioCompra).toFixed(2),
            'Talla': producto.talla || 'N/A',
            'Color': producto.color || 'N/A',
            'Stock': producto.stockActual ?? producto.stock ?? 0,
            'Estado': getStockStatusValue(producto) === 'in_stock' ? 'En Stock' : 
                     getStockStatusValue(producto) === 'low_stock' ? 'Bajo Stock' : 'Agotado'
        }));

        // Crear CSV
        const headers = Object.keys(dataToExport[0] || {});
        const csvContent = [
            headers.join(','),
            ...dataToExport.map(row => 
                headers.map(header => `"${row[header]}"`).join(',')
            )
        ].join('\n');

        // Descargar archivo
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `productos_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        setShowExportMenu(false);
    };

    // Función para exportar a PDF
    const exportToPDF = () => {
        const printWindow = window.open('', '_blank');
        const tableRows = filteredProducts.map(producto => `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${producto.nombre}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${producto.codigoBarras || producto.codigoInterno || 'N/A'}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${producto.categoria?.nombre || 'N/A'}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">Bs. ${parseFloat(producto.precioVenta).toFixed(2)}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${producto.talla || 'N/A'}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${producto.color || 'N/A'}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${producto.stockActual ?? producto.stock ?? 0}</td>
            </tr>
        `).join('');

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Lista de Productos - SisPOS</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #333; margin-bottom: 5px; }
                    .date { color: #666; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th { background-color: #4F46E5; color: white; padding: 10px; text-align: left; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    .footer { margin-top: 20px; text-align: center; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <h1>Lista de Productos</h1>
                <p class="date">Generado el: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>SKU</th>
                            <th>Categoría</th>
                            <th style="text-align: right;">Precio</th>
                            <th style="text-align: center;">Talla</th>
                            <th style="text-align: center;">Color</th>
                            <th style="text-align: center;">Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                <p class="footer">Total de productos: ${filteredProducts.length}</p>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
        setShowExportMenu(false);
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
                    <div className="relative">
                        <button 
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all"
                        >
                            <span className="material-symbols-outlined text-[20px]">download</span> Exportar
                            <span className="material-symbols-outlined text-[16px]">expand_more</span>
                        </button>
                        {showExportMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)}></div>
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-border-light dark:border-border-dark z-20 overflow-hidden">
                                    <button
                                        onClick={exportToExcel}
                                        className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px] text-green-600">table_view</span>
                                        Exportar a Excel
                                    </button>
                                    <button
                                        onClick={exportToPDF}
                                        className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors border-t border-border-light dark:border-border-dark"
                                    >
                                        <span className="material-symbols-outlined text-[20px] text-red-600">picture_as_pdf</span>
                                        Exportar a PDF
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <select 
                        className="px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer min-w-[140px]"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">Todas las Categorías</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                    <select 
                        className="px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer min-w-[140px]"
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                    >
                        <option value="">Estado Stock</option>
                        <option value="in_stock">En Stock</option>
                        <option value="low_stock">Stock Bajo</option>
                        <option value="out_of_stock">Agotado</option>
                    </select>
                    <select 
                        className="px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer min-w-[160px]"
                        value={sucursalFilter}
                        onChange={(e) => setSucursalFilter(e.target.value)}
                    >
                        <option value="">Todas las Sucursales</option>
                        {sucursales.map(suc => (
                            <option key={suc.id} value={suc.id}>{suc.nombre}</option>
                        ))}
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
                                currentProducts.map((producto) => {
                                    const stockStatus = getStockStatus(producto);
                                    return (
                                        <tr key={producto.id} className="group hover:bg-background-light dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4">
                                                    {/* Imagen del producto */}
                                                    <div className="size-12 rounded-lg bg-background-light dark:bg-gray-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                        {producto.imagen ? (
                                                            <img 
                                                                src={producto.imagen} 
                                                                alt={producto.nombre}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'flex';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <span 
                                                            className="material-symbols-outlined text-neutral-gray"
                                                            style={{ display: producto.imagen ? 'none' : 'block' }}
                                                        >
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
                                                    Bs. {parseFloat(producto.precioVenta).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right hidden lg:table-cell">
                                                <span className="text-neutral-gray dark:text-gray-400 text-sm">
                                                    Bs. {parseFloat(producto.precioCompra).toFixed(2)}
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
                                                        onClick={() => openDeleteModal(producto)}
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
                        {filteredProducts.length > 0 ? (
                            <>Mostrando <span className="font-medium text-gray-900 dark:text-white">{indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)}</span> de <span className="font-medium text-gray-900 dark:text-white">{filteredProducts.length}</span> productos</>
                        ) : (
                            <>No se encontraron productos</>
                        )}
                    </span>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-border-light dark:border-border-dark text-neutral-gray dark:text-gray-400 hover:bg-background-light dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>
                        <button 
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 rounded-lg border border-border-light dark:border-border-dark text-neutral-gray dark:text-gray-400 hover:bg-background-light dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && productoToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeDeleteModal}
                    />
                    {/* Modal */}
                    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200">
                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-500 text-[32px]">delete_forever</span>
                            </div>
                        </div>
                        {/* Content */}
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                ¿Eliminar producto?
                            </h3>
                            <p className="text-neutral-gray dark:text-gray-400">
                                Estás a punto de eliminar <span className="font-semibold text-gray-900 dark:text-white">"{productoToDelete.nombre}"</span>. Esta acción no se puede deshacer.
                            </p>
                        </div>
                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={closeDeleteModal}
                                disabled={deleting}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(productoToDelete.id)}
                                disabled={deleting}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {deleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Eliminando...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                        Eliminar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
