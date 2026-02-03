import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = '/api';

export default function Inventario() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Ingreso');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchProduct, setSearchProduct] = useState('');
    const [esTransferencia, setEsTransferencia] = useState(false);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [formData, setFormData] = useState({
        sucursalId: '',
        almacenId: '',
        almacenDestinoId: '',
        cantidad: '',
        motivo: ''
    });

    // Data states
    const [movimientos, setMovimientos] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [almacenes, setAlmacenes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [inventarios, setInventarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Product selection for modal
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [almacenesProducto, setAlmacenesProducto] = useState([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Estado para el menú de exportación
    const [showExportMenu, setShowExportMenu] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Fetch movimientos
            const movimientosRes = await fetch(`${API_URL}/inventarios/movimientos?limit=1000`, { headers });
            if (movimientosRes.ok) {
                const movimientosData = await movimientosRes.json();
                setMovimientos(movimientosData.data || movimientosData || []);
            }

            // Fetch sucursales
            const sucursalesRes = await fetch(`${API_URL}/sucursales`, { headers });
            if (sucursalesRes.ok) {
                const sucursalesData = await sucursalesRes.json();
                setSucursales(sucursalesData.data || sucursalesData || []);
            }

            // Fetch almacenes
            const almacenesRes = await fetch(`${API_URL}/almacenes`, { headers });
            if (almacenesRes.ok) {
                const almacenesData = await almacenesRes.json();
                setAlmacenes(almacenesData.data || almacenesData || []);
            }

            // Fetch productos for the modal
            const productosRes = await fetch(`${API_URL}/productos?limit=1000`, { headers });
            if (productosRes.ok) {
                const productosData = await productosRes.json();
                setProductos(productosData.data || productosData || []);
            }

        } catch (err) {
            console.error('Error fetching initial data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch almacenes where product exists
    const fetchAlmacenesProducto = async (productoId, producto = null) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/inventarios/producto/${productoId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                let almacenesConStock = data.detalle?.filter(inv => inv.cantidad >= 0) || [];
                
                // Si no hay inventarios pero el producto tiene un almacén asignado, usarlo
                if (almacenesConStock.length === 0 && producto?.almacenId) {
                    const almacenProducto = almacenes.find(a => a.id === producto.almacenId);
                    if (almacenProducto) {
                        almacenesConStock = [{
                            almacenId: producto.almacenId,
                            almacen: almacenProducto,
                            cantidad: producto.stock || 0
                        }];
                    }
                }
                
                setAlmacenesProducto(almacenesConStock);
                
                // Auto-select if only one almacen
                if (almacenesConStock.length === 1) {
                    setFormData(prev => ({
                        ...prev,
                        almacenId: almacenesConStock[0].almacenId.toString()
                    }));
                }
            }
        } catch (err) {
            console.error('Error fetching almacenes for product:', err);
        }
    };

    // Filter movimientos based on search and date
    const filteredMovimientos = movimientos.filter(mov => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm ||
            mov.producto?.nombre?.toLowerCase().includes(searchLower) ||
            mov.almacen?.nombre?.toLowerCase().includes(searchLower) ||
            mov.almacen?.sucursal?.nombre?.toLowerCase().includes(searchLower) ||
            mov.motivo?.toLowerCase().includes(searchLower) ||
            mov.tipo?.toLowerCase().includes(searchLower);
        
        // Filtro de fecha
        let matchesDate = true;
        if (fechaInicio || fechaFin) {
            const movDate = new Date(mov.createdAt || mov.fecha);
            movDate.setHours(0, 0, 0, 0);
            
            if (fechaInicio) {
                const startDate = new Date(fechaInicio);
                startDate.setHours(0, 0, 0, 0);
                matchesDate = matchesDate && movDate >= startDate;
            }
            if (fechaFin) {
                const endDate = new Date(fechaFin);
                endDate.setHours(23, 59, 59, 999);
                matchesDate = matchesDate && movDate <= endDate;
            }
        }
        
        return matchesSearch && matchesDate;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredMovimientos.length / itemsPerPage);
    const paginatedMovimientos = filteredMovimientos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Filter productos for modal search
    const filteredProductos = productos.filter(p =>
        p.nombre?.toLowerCase().includes(searchProduct.toLowerCase()) ||
        p.codigoBarras?.toLowerCase().includes(searchProduct.toLowerCase())
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProductSelect = (producto) => {
        setProductoSeleccionado(producto);
        setSearchProduct(producto.nombre);
        setFormData(prev => ({ ...prev, almacenId: '' }));
        
        // Fetch almacenes where this product exists, passing the product for fallback
        fetchAlmacenesProducto(producto.id, producto);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!productoSeleccionado || !formData.cantidad || !formData.almacenId) {
            alert('Selecciona un producto, almacén e ingresa la cantidad');
            return;
        }

        if (esTransferencia && !formData.almacenDestinoId) {
            alert('Selecciona el almacén destino para la transferencia');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            
            if (esTransferencia) {
                // Transferencia: usar el nuevo endpoint que busca producto equivalente
                const transferResponse = await fetch(`${API_URL}/inventarios/transferencia`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productoOrigenId: productoSeleccionado.id,
                        almacenOrigenId: parseInt(formData.almacenId),
                        almacenDestinoId: parseInt(formData.almacenDestinoId),
                        cantidad: parseInt(formData.cantidad)
                    })
                });
                
                if (!transferResponse.ok) {
                    const errorData = await transferResponse.json();
                    throw new Error(errorData.error || 'Error en la transferencia');
                }
                
                const result = await transferResponse.json();
                console.log('Transferencia exitosa:', result);

                fetchInitialData();
                closeModal();
            } else {
                // Ingreso o Salida normal
                const ajuste = activeTab === 'Ingreso' 
                    ? parseInt(formData.cantidad) 
                    : -parseInt(formData.cantidad);
                
                const payload = {
                    productoId: productoSeleccionado.id,
                    almacenId: parseInt(formData.almacenId),
                    ajuste: ajuste,
                    motivo: formData.motivo || (activeTab === 'Ingreso' ? 'registro de inventario manual' : 'salida de inventario manual')
                };

                const response = await fetch(`${API_URL}/inventarios/ajuste`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    fetchInitialData();
                    closeModal();
                } else {
                    const errorData = await response.json();
                    alert('Error: ' + (errorData.message || errorData.error || 'No se pudo registrar'));
                }
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error al registrar el movimiento: ' + err.message);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ sucursalId: '', almacenId: '', almacenDestinoId: '', cantidad: '', motivo: '' });
        setSearchProduct('');
        setProductoSeleccionado(null);
        setActiveTab('Ingreso');
        setEsTransferencia(false);
        setAlmacenesProducto([]);
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().replace('T', ' ').substring(0, 19);
    };

    // Get movement type display
    const getMovementTypeDisplay = (motivo) => {
        const lowerMotivo = motivo?.toLowerCase() || '';
        if (lowerMotivo.includes('venta')) return 'venta realizada';
        if (lowerMotivo.includes('compra') || lowerMotivo.includes('recepción')) return 'recepción de mercadería';
        if (lowerMotivo.includes('transferencia')) return 'transferencia entre almacenes';
        if (lowerMotivo.includes('ajuste')) return 'ajuste de inventario';
        return motivo || 'registro de inventario manual';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Get almacenes for dropdown based on mode
    const getAlmacenesForDropdown = () => {
        if (activeTab === 'Ingreso') {
            // En ingreso: mostrar todos los almacenes
            return almacenes;
        } else {
            // En salida: mostrar solo almacenes donde el producto tiene stock
            if (productoSeleccionado && almacenesProducto.length > 0) {
                return almacenesProducto.map(ap => ({
                    id: ap.almacenId,
                    nombre: ap.almacen?.nombre || `Almacén ${ap.almacenId}`,
                    stock: ap.cantidad
                }));
            }
            return [];
        }
    };

    // Get available destination almacenes (excluding origin)
    const getAlmacenesDestino = () => {
        return almacenes.filter(a => a.id.toString() !== formData.almacenId);
    };

    // Función para exportar a Excel (CSV)
    const exportToExcel = () => {
        const dataToExport = filteredMovimientos.map(mov => ({
            'Fecha': new Date(mov.createdAt).toLocaleDateString('es-ES'),
            'Hora': new Date(mov.createdAt).toLocaleTimeString('es-ES'),
            'Usuario': mov.usuario?.nombres || 'Sistema',
            'Sucursal': mov.almacen?.sucursal?.nombre || 'N/A',
            'Almacén': mov.almacen?.nombre || 'N/A',
            'Movimiento': getMovementTypeDisplay(mov.motivo),
            'Producto': mov.producto?.nombre || 'N/A',
            'Talla': mov.producto?.talla || '',
            'Color': mov.producto?.color || '',
            'Tipo': mov.tipo === 'ENTRADA' ? 'Ingreso' : 'Egreso',
            'Cantidad': mov.cantidad
        }));

        // Crear CSV con punto y coma (;) como delimitador para Excel
        const headers = Object.keys(dataToExport[0] || {});
        const csvRows = [];
        
        // Agregar encabezados
        csvRows.push(headers.join(';'));
        
        // Agregar datos - escapar campos con comillas si contienen caracteres especiales
        dataToExport.forEach(row => {
            const values = headers.map(header => {
                const value = String(row[header] || '');
                // Escapar valores que contengan punto y coma, comillas o saltos de línea
                if (value.includes(';') || value.includes('"') || value.includes('\n')) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            });
            csvRows.push(values.join(';'));
        });

        const csvContent = csvRows.join('\n');

        // Descargar archivo con BOM UTF-8 para compatibilidad con Excel
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `inventario_movimientos_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowExportMenu(false);
    };

    // Función para exportar a PDF
    const exportToPDF = () => {
        const printWindow = window.open('', '_blank');
        const tableRows = filteredMovimientos.map(mov => `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-size: 12px;">${formatDate(mov.createdAt)}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${mov.usuario?.nombres || 'Sistema'}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${mov.almacen?.sucursal?.nombre || 'N/A'}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${mov.almacen?.nombre || 'N/A'}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${getMovementTypeDisplay(mov.motivo)}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${mov.producto?.nombre || 'N/A'}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${mov.producto?.talla || '-'}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
                    <span style="background: ${mov.tipo === 'ENTRADA' ? '#d1fae5' : '#fed7aa'}; color: ${mov.tipo === 'ENTRADA' ? '#065f46' : '#92400e'}; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                        ${mov.tipo === 'ENTRADA' ? 'Ingreso' : 'Egreso'}
                    </span>
                </td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center; font-weight: bold; color: ${mov.tipo === 'ENTRADA' ? '#059669' : '#dc2626'};">
                    ${mov.tipo === 'ENTRADA' ? '+' : '-'}${mov.cantidad}
                </td>
            </tr>
        `).join('');

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Movimientos de Inventario - SisPOS</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #333; margin-bottom: 5px; }
                    .date { color: #666; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; font-size: 13px; }
                    th { background-color: #4F46E5; color: white; padding: 10px; text-align: left; font-size: 12px; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    .footer { margin-top: 20px; text-align: center; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <h1>Movimientos de Inventario</h1>
                <p class="date">Generado el: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                ${fechaInicio || fechaFin ? `<p class="date">Período: ${fechaInicio || 'Inicio'} - ${fechaFin || 'Hoy'}</p>` : ''}
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Usuario</th>
                            <th>Sucursal</th>
                            <th>Almacén</th>
                            <th>Movimiento</th>
                            <th>Producto</th>
                            <th>Talla</th>
                            <th style="text-align: center;">Tipo</th>
                            <th style="text-align: center;">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                <p class="footer">Total de movimientos: ${filteredMovimientos.length}</p>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
        setShowExportMenu(false);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex flex-wrap justify-between gap-3 items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Inventario</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button 
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all"
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
                    <button
                        onClick={openModal}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-primary/40"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Registrar
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white dark:bg-background-dark dark:border dark:border-border-dark rounded-xl shadow-sm border border-border-light overflow-hidden">
                {/* Search and Date Filter Bar */}
                <div className="p-4 border-b border-border-light dark:border-border-dark flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Date Filters */}
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-neutral-gray whitespace-nowrap">Desde:</label>
                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => {
                                    setFechaInicio(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-3 py-2 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-neutral-gray whitespace-nowrap">Hasta:</label>
                            <input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => {
                                    setFechaFin(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-3 py-2 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary text-sm"
                            />
                        </div>
                        {(fechaInicio || fechaFin) && (
                            <button
                                onClick={() => {
                                    setFechaInicio('');
                                    setFechaFin('');
                                    setCurrentPage(1);
                                }}
                                className="px-3 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-[16px]">close</span>
                                Limpiar
                            </button>
                        )}
                    </div>
                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-neutral-gray text-[20px]">search</span>
                        <input
                            className="w-full pl-10 py-2 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary text-sm"
                            placeholder="...buscar"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background-light dark:bg-gray-900/50 border-b border-border-light dark:border-border-dark text-xs uppercase text-neutral-gray font-semibold tracking-wide">
                                <th className="p-4 pl-6">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                        Fecha <span className="material-symbols-outlined text-[14px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                        Usuario <span className="material-symbols-outlined text-[14px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                        Sucursal <span className="material-symbols-outlined text-[14px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                        Almacén <span className="material-symbols-outlined text-[14px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                        Movimiento <span className="material-symbols-outlined text-[14px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                        Producto <span className="material-symbols-outlined text-[14px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                        Talla <span className="material-symbols-outlined text-[14px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                        Tipo <span className="material-symbols-outlined text-[14px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4 pr-6">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
                                        Cantidad <span className="material-symbols-outlined text-[14px]">unfold_more</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {paginatedMovimientos.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="p-8 text-center text-neutral-gray">
                                        <span className="material-symbols-outlined text-4xl mb-2 block">inventory_2</span>
                                        No hay movimientos registrados
                                    </td>
                                </tr>
                            ) : (
                                paginatedMovimientos.map((mov) => (
                                    <tr key={mov.id} className="hover:bg-background-light dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 pl-6">
                                            <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                                                {formatDate(mov.createdAt)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {mov.usuario?.nombres || 'Sistema'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-gray-900 dark:text-white">
                                                {mov.almacen?.sucursal?.nombre || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-primary font-medium">
                                                {mov.almacen?.nombre || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {getMovementTypeDisplay(mov.motivo)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {mov.producto?.nombre || 'N/A'}
                                                {mov.producto?.color && <span className="ml-1 text-xs text-gray-500 capitalize">{mov.producto.color}</span>}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                {mov.producto?.talla || '-'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                mov.tipo === 'ENTRADA' 
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                                {mov.tipo === 'ENTRADA' ? 'Ingreso' : 'Egreso'}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6">
                                            <span className={`text-sm font-bold ${
                                                mov.tipo === 'ENTRADA' 
                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}>
                                                {mov.tipo === 'ENTRADA' ? '+' : '-'}{mov.cantidad}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-border-light dark:border-border-dark flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-sm text-neutral-gray dark:text-gray-400">
                        {filteredMovimientos.length > 0 ? (
                            <>Mostrando <span className="font-medium text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredMovimientos.length)}</span> de <span className="font-medium text-gray-900 dark:text-white">{filteredMovimientos.length}</span> movimientos</>
                        ) : (
                            'Sin resultados'
                        )}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="px-3 py-1.5 text-sm font-medium border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="px-3 py-1.5 text-sm font-medium border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Flotante - Registrar Movimiento */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    <div className="relative w-full max-w-md bg-white dark:bg-background-dark rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        {/* Tabs Header */}
                        <div className="flex border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-900/50">
                            <button
                                onClick={() => {
                                    setActiveTab('Ingreso');
                                    setEsTransferencia(false);
                                    setFormData(prev => ({ ...prev, almacenId: '', almacenDestinoId: '' }));
                                }}
                                className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative ${activeTab === 'Ingreso'
                                        ? 'text-gray-900 dark:text-white bg-white dark:bg-background-dark'
                                        : 'text-neutral-gray hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                Ingreso
                                {activeTab === 'Ingreso' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('Salida');
                                    setFormData(prev => ({ ...prev, almacenId: '', almacenDestinoId: '' }));
                                    if (productoSeleccionado) {
                                        fetchAlmacenesProducto(productoSeleccionado.id);
                                    }
                                }}
                                className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative ${activeTab === 'Salida'
                                        ? 'text-gray-900 dark:text-white bg-white dark:bg-background-dark'
                                        : 'text-neutral-gray hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                Salida
                                {activeTab === 'Salida' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                )}
                            </button>
                            <button
                                onClick={closeModal}
                                className="px-4 flex items-center justify-center text-neutral-gray hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[24px]">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="flex flex-col">
                            <div className="p-6 flex flex-col gap-5">
                                {/* Title */}
                                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                                    {esTransferencia ? 'TRANSFERIR PRODUCTO' : `REGISTRAR ${activeTab === 'Ingreso' ? 'ENTRADA' : 'SALIDA'}`}
                                </h2>

                                {/* Search Product */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Producto *</label>
                                    <span className="material-symbols-outlined absolute left-4 top-9 text-neutral-gray text-[20px]">search</span>
                                    <input
                                        type="text"
                                        value={searchProduct}
                                        onChange={(e) => {
                                            setSearchProduct(e.target.value);
                                            setProductoSeleccionado(null);
                                            setAlmacenesProducto([]);
                                            setFormData(prev => ({ ...prev, almacenId: '' }));
                                        }}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary text-sm"
                                        placeholder="Buscar producto..."
                                    />
                                    {/* Product dropdown */}
                                    {searchProduct && !productoSeleccionado && filteredProductos.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {filteredProductos.slice(0, 5).map(prod => (
                                                <button
                                                    key={prod.id}
                                                    type="button"
                                                    onClick={() => handleProductSelect(prod)}
                                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                                                >
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-gray-900 dark:text-white">{prod.nombre}</span>
                                                            {prod.talla && (
                                                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                                                                    T: {prod.talla}
                                                                </span>
                                                            )}
                                                            {prod.color && (
                                                                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded capitalize">
                                                                    {prod.color}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-neutral-gray">{prod.codigoBarras} • Stock: {prod.stock || 0}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                {productoSeleccionado && (
                                    <div className="flex flex-col gap-1 py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-neutral-gray">Producto:</span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                {productoSeleccionado.nombre}
                                                {productoSeleccionado.talla && <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded font-normal">T: {productoSeleccionado.talla}</span>}
                                                {productoSeleccionado.color && <span className="ml-1 text-xs text-gray-500 font-normal capitalize">{productoSeleccionado.color}</span>}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-neutral-gray">Stock Total:</span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{productoSeleccionado.stock || 0}</span>
                                        </div>
                                        {activeTab === 'Salida' && almacenesProducto.length > 0 && (
                                            <div className="mt-1 pt-1 border-t border-gray-200 dark:border-gray-700">
                                                <span className="text-xs text-neutral-gray">Disponible en:</span>
                                                {almacenesProducto.map(ap => (
                                                    <span key={ap.almacenId} className="block text-xs text-primary">
                                                        {ap.almacen?.nombre}: {ap.cantidad} unid.
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Almacén Origen */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {esTransferencia ? 'Almacén Origen *' : 'Almacén *'}
                                    </label>
                                    <select
                                        name="almacenId"
                                        value={formData.almacenId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary text-sm"
                                        required
                                    >
                                        <option value="">Seleccionar almacén...</option>
                                        {productoSeleccionado && almacenesProducto.length > 0 ? (
                                            almacenesProducto.map(ap => (
                                                <option key={ap.almacenId} value={ap.almacenId}>
                                                    {ap.almacen?.nombre}{activeTab === 'Salida' ? ` (${ap.cantidad} disponibles)` : ''}
                                                </option>
                                            ))
                                        ) : !productoSeleccionado ? (
                                            <option value="" disabled>Primero selecciona un producto</option>
                                        ) : null}
                                    </select>
                                    {productoSeleccionado && almacenesProducto.length === 0 && (
                                        <p className="text-xs text-amber-600 mt-1">Este producto no tiene inventario registrado en ningún almacén</p>
                                    )}
                                </div>

                                {/* Transfer option for Salida */}
                                {activeTab === 'Salida' && productoSeleccionado && almacenesProducto.length > 0 && (
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <input
                                            type="checkbox"
                                            id="esTransferencia"
                                            checked={esTransferencia}
                                            onChange={(e) => setEsTransferencia(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <label htmlFor="esTransferencia" className="text-sm font-medium text-blue-800 dark:text-blue-300 cursor-pointer">
                                            Transferir a otro almacén
                                        </label>
                                    </div>
                                )}

                                {/* Almacén Destino (only for transfer) */}
                                {esTransferencia && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Almacén Destino *</label>
                                        <select
                                            name="almacenDestinoId"
                                            value={formData.almacenDestinoId}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary text-sm"
                                            required={esTransferencia}
                                        >
                                            <option value="">Seleccionar almacén destino...</option>
                                            {getAlmacenesDestino().map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                                        </select>
                                    </div>
                                )}

                                {/* Cantidad */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cantidad *</label>
                                    <input
                                        type="number"
                                        name="cantidad"
                                        value={formData.cantidad}
                                        onChange={handleChange}
                                        min="1"
                                        className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary text-sm"
                                        placeholder="Ingrese cantidad"
                                        required
                                    />
                                </div>

                                {/* Motivo - only if not transfer */}
                                {!esTransferencia && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Motivo (opcional)</label>
                                        <input
                                            type="text"
                                            name="motivo"
                                            value={formData.motivo}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary text-sm"
                                            placeholder="Ej: recepción de mercadería, ajuste de inventario..."
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={`w-full py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                                    esTransferencia 
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-primary hover:bg-primary/90 text-white'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {esTransferencia ? 'swap_horiz' : 'save'}
                                </span>
                                {esTransferencia ? 'Transferir' : 'Guardar'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
