import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Inventario() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Ingreso');
    const [expandedSections, setExpandedSections] = useState({
        cantidad: true,
        precioCosto: false,
        precioVenta: false
    });
    const [searchProduct, setSearchProduct] = useState('');
    const [formData, setFormData] = useState({
        sucursal: 'Generica',
        almacen: 'Almacen principal',
        cantidad: '',
        precioCosto: '',
        precioVenta: ''
    });

    // Product info
    const productoSeleccionado = {
        nombre: 'producto de prueba',
        stock: 17
    };

    // Sample inventory movements data
    const movimientos = [
        {
            id: 1,
            fecha: '2025-12-31T14:18:18+00:00',
            sucursal: 'Generica',
            almacen: 'Almacen principal',
            movimiento: 'registro de inventario manual',
            origen: 'inventario',
            tipo: 'Ingreso',
            cantidad: 7
        },
        {
            id: 2,
            fecha: '2025-12-30T10:25:00+00:00',
            sucursal: 'Centro',
            almacen: 'Bodega 1',
            movimiento: 'venta realizada',
            origen: 'venta',
            tipo: 'Egreso',
            cantidad: 2
        },
        {
            id: 3,
            fecha: '2025-12-29T16:45:30+00:00',
            sucursal: 'Generica',
            almacen: 'Almacen principal',
            movimiento: 'transferencia entre almacenes',
            origen: 'transferencia',
            tipo: 'Egreso',
            cantidad: 5
        },
        {
            id: 4,
            fecha: '2025-12-28T09:00:00+00:00',
            sucursal: 'Norte',
            almacen: 'Almacen secundario',
            movimiento: 'recepción de mercadería',
            origen: 'compra',
            tipo: 'Ingreso',
            cantidad: 20
        },
    ];

    const sucursales = ['Generica', 'Centro', 'Norte', 'Sur'];
    const almacenes = ['Almacen principal', 'Bodega 1', 'Almacen secundario'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Inventario data:', { ...formData, tipo: activeTab });
        setIsModalOpen(false);
        setFormData({ sucursal: 'Generica', almacen: 'Almacen principal', cantidad: '', precioCosto: '', precioVenta: '' });
        setSearchProduct('');
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ sucursal: 'Generica', almacen: 'Almacen principal', cantidad: '', precioCosto: '', precioVenta: '' });
        setSearchProduct('');
        setActiveTab('Ingreso');
    };

    return (
        <div className="flex flex-col gap-6">
            {/* CSS Animations */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 100px; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .modal-backdrop { animation: fadeIn 0.2s ease-out; }
        .modal-content { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .input-animated { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .input-animated:focus { transform: scale(1.01); box-shadow: 0 0 0 3px rgba(19, 91, 236, 0.1); }
        .btn-bounce:active { transform: scale(0.97); }
        .tab-indicator { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .section-expand { transition: all 0.3s ease-out; overflow: hidden; }
        .section-expand.collapsed { max-height: 0; opacity: 0; padding: 0; }
        .section-expand.expanded { max-height: 100px; opacity: 1; }
        .hover-lift { transition: all 0.2s ease; }
        .hover-lift:hover { transform: translateY(-1px); }
        .shimmer-btn {
          background: linear-gradient(90deg, #EAB308 0%, #FDE047 50%, #EAB308 100%);
          background-size: 200% 100%;
        }
        .shimmer-btn:hover {
          animation: shimmer 1.5s infinite;
        }
      `}</style>

            {/* Header Section */}
            <div className="flex flex-wrap justify-between gap-3 items-center">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-gray">Producto:</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">producto de prueba</span>
                    </div>
                    <div className="h-6 w-px bg-border-light dark:bg-border-dark"></div>
                    <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Inventario</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={openModal}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] btn-bounce"
                    >
                        Registrar
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white dark:bg-background-dark dark:border dark:border-border-dark rounded-xl shadow-sm border border-border-light overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-end">
                    <div className="relative w-full sm:w-64">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-neutral-gray text-[20px]">search</span>
                        <input
                            className="w-full pl-10 py-2 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary text-sm"
                            placeholder="...buscar"
                            type="text"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background-light dark:bg-gray-900/50 border-b border-border-light dark:border-border-dark text-xs uppercase text-neutral-gray font-semibold tracking-wide">
                                <th className="p-4 pl-6">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                                        Fecha
                                        <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                                        Sucursal
                                        <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                                        Almacen
                                        <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                                        Movimiento
                                        <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                                        Origen
                                        <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                                        Tipo
                                        <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4 pr-6">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                                        Cantidad
                                        <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {movimientos.map((mov) => (
                                <tr key={mov.id} className="hover:bg-background-light dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <span className="text-sm text-gray-900 dark:text-white font-mono">{mov.fecha}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{mov.sucursal}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-amber-600 dark:text-amber-500 font-medium hover:underline cursor-pointer">
                                            {mov.almacen}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-neutral-gray dark:text-gray-400">{mov.movimiento}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-neutral-gray dark:text-gray-400">{mov.origen}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${mov.tipo === 'Ingreso'
                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {mov.tipo}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6">
                                        <span className={`text-sm font-bold ${mov.tipo === 'Ingreso'
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : 'text-red-600 dark:text-red-400'
                                            }`}>
                                            {mov.tipo === 'Ingreso' ? '+' : '-'}{mov.cantidad}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-border-light dark:border-border-dark flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-sm text-neutral-gray dark:text-gray-400">
                        Mostrando <span className="font-medium text-gray-900 dark:text-white">1-4</span> de <span className="font-medium text-gray-900 dark:text-white">24</span> movimientos
                    </span>
                    <div className="flex gap-2">
                        <button
                            className="px-3 py-1.5 text-sm font-medium border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled
                        >
                            Anterior
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Flotante - Registrar Movimiento */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="modal-backdrop absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={closeModal}
                    />

                    <div className="modal-content relative w-full max-w-md bg-white dark:bg-background-dark rounded-2xl shadow-2xl overflow-hidden">
                        {/* Tabs Header */}
                        <div className="flex border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-900/50">
                            <button
                                onClick={() => setActiveTab('Ingreso')}
                                className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative ${activeTab === 'Ingreso'
                                        ? 'text-gray-900 dark:text-white bg-white dark:bg-background-dark'
                                        : 'text-neutral-gray hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                Ingreso
                                {activeTab === 'Ingreso' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary tab-indicator" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('Salida')}
                                className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative ${activeTab === 'Salida'
                                        ? 'text-gray-900 dark:text-white bg-white dark:bg-background-dark'
                                        : 'text-neutral-gray hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                Salida
                                {activeTab === 'Salida' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary tab-indicator" />
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
                                    REGISTRAR {activeTab === 'Ingreso' ? 'ENTRADA' : 'SALIDA'}
                                </h2>

                                {/* Search Product */}
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-gray text-[20px]">search</span>
                                    <input
                                        type="text"
                                        value={searchProduct}
                                        onChange={(e) => setSearchProduct(e.target.value)}
                                        className="input-animated w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary text-sm"
                                        placeholder="Buscar producto..."
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex flex-col gap-1 py-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-neutral-gray">Producto:</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{productoSeleccionado.nombre}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-neutral-gray">Stock:</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{productoSeleccionado.stock}</span>
                                    </div>
                                </div>

                                {/* Sucursal */}
                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-neutral-gray min-w-[70px]">Sucursal:</label>
                                    <select
                                        name="sucursal"
                                        value={formData.sucursal}
                                        onChange={handleChange}
                                        className="input-animated flex-1 px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary text-sm font-medium"
                                    >
                                        {sucursales.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                {/* Almacen */}
                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-neutral-gray min-w-[70px]">Almacen:</label>
                                    <select
                                        name="almacen"
                                        value={formData.almacen}
                                        onChange={handleChange}
                                        className="input-animated flex-1 px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary text-sm font-medium"
                                    >
                                        {almacenes.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>

                                {/* Expandable Sections */}
                                {/* Cantidad */}
                                <div className="border-t border-border-light dark:border-border-dark">
                                    <button
                                        type="button"
                                        onClick={() => toggleSection('cantidad')}
                                        className="w-full flex items-center justify-between py-4 hover-lift"
                                    >
                                        <span className={`text-sm transition-all duration-200 ${expandedSections.cantidad ? 'text-gray-900 dark:text-white font-medium' : 'text-neutral-gray'}`}>
                                            Cantidad
                                        </span>
                                        <span className={`material-symbols-outlined text-neutral-gray transition-transform duration-300 ${expandedSections.cantidad ? 'rotate-90' : ''}`}>
                                            chevron_right
                                        </span>
                                    </button>
                                    <div className={`section-expand ${expandedSections.cantidad ? 'expanded pb-4' : 'collapsed'}`}>
                                        <input
                                            type="number"
                                            name="cantidad"
                                            value={formData.cantidad}
                                            onChange={handleChange}
                                            min="1"
                                            className="input-animated w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary text-sm"
                                            placeholder="Ingrese cantidad"
                                        />
                                    </div>
                                </div>

                                {/* Precio Costo */}
                                <div className="border-t border-border-light dark:border-border-dark">
                                    <button
                                        type="button"
                                        onClick={() => toggleSection('precioCosto')}
                                        className="w-full flex items-center justify-between py-4 hover-lift"
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className={`text-sm transition-all duration-200 ${expandedSections.precioCosto ? 'text-gray-900 dark:text-white font-medium' : 'text-neutral-gray'}`}>
                                                Precio costo
                                            </span>
                                            {!expandedSections.precioCosto && formData.precioCosto && (
                                                <span className="text-xs text-gray-500">{formData.precioCosto}</span>
                                            )}
                                        </div>
                                        <span className={`material-symbols-outlined text-neutral-gray transition-transform duration-300 ${expandedSections.precioCosto ? 'rotate-90' : ''}`}>
                                            chevron_right
                                        </span>
                                    </button>
                                    <div className={`section-expand ${expandedSections.precioCosto ? 'expanded pb-4' : 'collapsed'}`}>
                                        <input
                                            type="number"
                                            name="precioCosto"
                                            value={formData.precioCosto}
                                            onChange={handleChange}
                                            step="0.01"
                                            min="0"
                                            className="input-animated w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary text-sm"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Precio Venta */}
                                <div className="border-t border-border-light dark:border-border-dark">
                                    <button
                                        type="button"
                                        onClick={() => toggleSection('precioVenta')}
                                        className="w-full flex items-center justify-between py-4 hover-lift"
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className={`text-sm transition-all duration-200 ${expandedSections.precioVenta ? 'text-gray-900 dark:text-white font-medium' : 'text-neutral-gray'}`}>
                                                Precio venta
                                            </span>
                                            {!expandedSections.precioVenta && formData.precioVenta && (
                                                <span className="text-xs text-gray-500">{formData.precioVenta}</span>
                                            )}
                                        </div>
                                        <span className={`material-symbols-outlined text-neutral-gray transition-transform duration-300 ${expandedSections.precioVenta ? 'rotate-90' : ''}`}>
                                            chevron_right
                                        </span>
                                    </button>
                                    <div className={`section-expand ${expandedSections.precioVenta ? 'expanded pb-4' : 'collapsed'}`}>
                                        <input
                                            type="number"
                                            name="precioVenta"
                                            value={formData.precioVenta}
                                            onChange={handleChange}
                                            step="0.01"
                                            min="0"
                                            className="input-animated w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary text-sm"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="shimmer-btn w-full py-4 bg-yellow-400 text-gray-900 font-bold text-sm flex items-center justify-center gap-2 hover:bg-yellow-500 transition-all duration-300 btn-bounce"
                            >
                                <span className="material-symbols-outlined text-[20px]">save</span>
                                Guardar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
