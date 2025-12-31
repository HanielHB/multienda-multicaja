import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Almacenes() {
    // State for sucursales with their almacenes
    const [sucursales, setSucursales] = useState([
        {
            id: 1,
            nombre: 'GENERICA',
            canDelete: false,
            almacenes: [
                { id: 1, nombre: 'Almacen principal', codigo: '2025-12-31T17:49:16.803436' }
            ]
        },
        {
            id: 2,
            nombre: 'GENERICA2',
            canDelete: true,
            almacenes: []
        }
    ]);

    // Modal states
    const [isAlmacenModalOpen, setIsAlmacenModalOpen] = useState(false);
    const [selectedSucursalId, setSelectedSucursalId] = useState(null);
    const [almacenForm, setAlmacenForm] = useState({ nombre: '' });
    const [focusedField, setFocusedField] = useState(null);

    // Handlers
    const openAlmacenModal = (sucursalId) => {
        setSelectedSucursalId(sucursalId);
        setAlmacenForm({ nombre: '' });
        setIsAlmacenModalOpen(true);
    };

    const closeAlmacenModal = () => {
        setIsAlmacenModalOpen(false);
        setAlmacenForm({ nombre: '' });
        setSelectedSucursalId(null);
    };

    const handleAlmacenSubmit = (e) => {
        e.preventDefault();
        const newAlmacen = {
            id: Date.now(),
            nombre: almacenForm.nombre,
            codigo: new Date().toISOString()
        };
        setSucursales(sucursales.map(suc =>
            suc.id === selectedSucursalId
                ? { ...suc, almacenes: [...suc.almacenes, newAlmacen] }
                : suc
        ));
        closeAlmacenModal();
    };

    const handleDeleteSucursal = (sucursalId) => {
        setSucursales(sucursales.filter(s => s.id !== sucursalId));
    };

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
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
        @keyframes cardAppear {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .modal-backdrop { animation: fadeIn 0.2s ease-out; }
        .modal-content { animation: slideUp 0.3s ease-out; }
        .card-animate { animation: cardAppear 0.3s ease-out; }
        .input-animated { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .input-animated:focus { transform: scale(1.01); }
        .btn-bounce:active { transform: scale(0.97); }
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 25px -5px rgba(0,0,0,0.1); }
      `}</style>

            {/* Header Section */}
            <div className="text-center">
                <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em] mb-2">
                    Almacenes por sucursal
                </h1>
                <p className="text-neutral-gray dark:text-gray-400 text-base">
                    gestiona tus almacenes por sucursal
                </p>
            </div>

            {/* Sucursales Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sucursales.map((sucursal) => (
                    <div
                        key={sucursal.id}
                        className="card-animate bg-white dark:bg-background-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden hover-lift"
                    >
                        {/* Sucursal Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark">
                            <h2 className="text-base font-bold text-gray-900 dark:text-white">
                                SUCURSAL: <span className="text-primary">{sucursal.nombre}</span>
                            </h2>
                            <div className="flex items-center gap-1">
                                {sucursal.canDelete && (
                                    <button
                                        onClick={() => handleDeleteSucursal(sucursal.id)}
                                        className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-red-50 hover:text-destructive-red dark:hover:bg-red-900/20 transition-colors"
                                        title="Eliminar sucursal"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                )}
                                <button
                                    className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800 transition-colors"
                                    title="Editar sucursal"
                                >
                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                </button>
                            </div>
                        </div>

                        {/* Almacenes List */}
                        <div className="p-5">
                            <div className="flex flex-col gap-3">
                                {sucursal.almacenes.map((almacen) => (
                                    <div
                                        key={almacen.id}
                                        className="flex items-center justify-between p-4 bg-background-light dark:bg-gray-800/50 rounded-lg border border-border-light dark:border-border-dark"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-xs text-neutral-gray dark:text-gray-500 font-mono">
                                                {almacen.codigo}
                                            </span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                {almacen.nombre}
                                            </span>
                                        </div>
                                        <button
                                            className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-white hover:text-primary dark:hover:bg-gray-700 transition-colors"
                                            title="Editar almacén"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                    </div>
                                ))}

                                {/* Add Almacen Button */}
                                <button
                                    onClick={() => openAlmacenModal(sucursal.id)}
                                    className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-500 font-medium hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all duration-300"
                                >
                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                    <span className="text-amber-600 dark:text-amber-500">agregar almacen</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Agregar Almacén */}
            {isAlmacenModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeAlmacenModal}
                    />
                    <div className="modal-content relative w-full max-w-md bg-white dark:bg-background-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden">
                        <div className="relative px-6 py-5 border-b border-border-light dark:border-border-dark bg-gradient-to-r from-amber-500/5 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/10">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30">
                                    <span className="material-symbols-outlined text-2xl">warehouse</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nuevo Almacén</h2>
                                    <p className="text-sm text-neutral-gray">
                                        Sucursal: <span className="font-semibold text-primary">
                                            {sucursales.find(s => s.id === selectedSucursalId)?.nombre}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeAlmacenModal}
                                className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleAlmacenSubmit} className="p-6">
                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="almacenNombre">
                                        Nombre del Almacén <span className="text-destructive-red">*</span>
                                    </label>
                                    <div className={`relative transition-all duration-300 ${focusedField === 'almacenNombre' ? 'scale-[1.01]' : ''}`}>
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-gray material-symbols-outlined text-[20px]">
                                            warehouse
                                        </span>
                                        <input
                                            type="text"
                                            id="almacenNombre"
                                            value={almacenForm.nombre}
                                            onChange={(e) => setAlmacenForm({ nombre: e.target.value })}
                                            onFocus={() => setFocusedField('almacenNombre')}
                                            onBlur={() => setFocusedField(null)}
                                            className="input-animated w-full pl-12 pr-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-neutral-gray"
                                            placeholder="Ej. Almacén Principal, Bodega 1..."
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-border-light dark:border-border-dark">
                                <button
                                    type="button"
                                    onClick={closeAlmacenModal}
                                    className="px-5 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 btn-bounce"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] btn-bounce"
                                >
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
