import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Sucursales() {
    // State for sucursales with their cajas
    const [sucursales, setSucursales] = useState([
        {
            id: 1,
            nombre: 'GENERICA',
            cajas: [
                { id: 1, nombre: 'Caja Principal', codigo: '2025-12-31T17:49:16.803436' }
            ]
        },
        {
            id: 2,
            nombre: 'CENTRO',
            cajas: [
                { id: 1, nombre: 'Caja 1', codigo: '2025-12-31T18:00:00.000000' },
                { id: 2, nombre: 'Caja 2', codigo: '2025-12-31T18:05:00.000000' }
            ]
        }
    ]);

    // Modal states
    const [isSucursalModalOpen, setIsSucursalModalOpen] = useState(false);
    const [isCajaModalOpen, setIsCajaModalOpen] = useState(false);
    const [selectedSucursalId, setSelectedSucursalId] = useState(null);
    const [sucursalForm, setSucursalForm] = useState({ nombre: '' });
    const [cajaForm, setCajaForm] = useState({ nombre: '' });
    const [focusedField, setFocusedField] = useState(null);

    // Handlers
    const openSucursalModal = () => {
        setSucursalForm({ nombre: '' });
        setIsSucursalModalOpen(true);
    };

    const closeSucursalModal = () => {
        setIsSucursalModalOpen(false);
        setSucursalForm({ nombre: '' });
    };

    const openCajaModal = (sucursalId) => {
        setSelectedSucursalId(sucursalId);
        setCajaForm({ nombre: '' });
        setIsCajaModalOpen(true);
    };

    const closeCajaModal = () => {
        setIsCajaModalOpen(false);
        setCajaForm({ nombre: '' });
        setSelectedSucursalId(null);
    };

    const handleSucursalSubmit = (e) => {
        e.preventDefault();
        const newSucursal = {
            id: Date.now(),
            nombre: sucursalForm.nombre.toUpperCase(),
            cajas: []
        };
        setSucursales([...sucursales, newSucursal]);
        closeSucursalModal();
    };

    const handleCajaSubmit = (e) => {
        e.preventDefault();
        const newCaja = {
            id: Date.now(),
            nombre: cajaForm.nombre,
            codigo: new Date().toISOString()
        };
        setSucursales(sucursales.map(suc =>
            suc.id === selectedSucursalId
                ? { ...suc, cajas: [...suc.cajas, newCaja] }
                : suc
        ));
        closeCajaModal();
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
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
                    Cajas por sucursal
                </h1>
                <p className="text-neutral-gray dark:text-gray-400 text-base mb-6">
                    gestiona tus sucursales y cajas
                </p>

                {/* Add Sucursal Button */}
                <button
                    onClick={openSucursalModal}
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all duration-300"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    agregar sucursal
                </button>
            </div>

            {/* Sucursales List */}
            <div className="flex flex-col gap-6">
                {sucursales.map((sucursal) => (
                    <div
                        key={sucursal.id}
                        className="card-animate bg-white dark:bg-background-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden hover-lift"
                    >
                        {/* Sucursal Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined">store</span>
                                </div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    SUCURSAL: <span className="text-primary">{sucursal.nombre}</span>
                                </h2>
                            </div>
                            <button
                                className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800 transition-colors"
                                title="Editar sucursal"
                            >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                        </div>

                        {/* Cajas List */}
                        <div className="p-5">
                            <div className="flex flex-col gap-3">
                                {sucursal.cajas.map((caja) => (
                                    <div
                                        key={caja.id}
                                        className="flex items-center justify-between p-4 bg-background-light dark:bg-gray-800/50 rounded-lg border border-border-light dark:border-border-dark"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-xs text-neutral-gray dark:text-gray-500 font-mono">
                                                {caja.codigo}
                                            </span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                {caja.nombre}
                                            </span>
                                        </div>
                                        <button
                                            className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-white hover:text-primary dark:hover:bg-gray-700 transition-colors"
                                            title="Editar caja"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                    </div>
                                ))}

                                {/* Add Caja Button */}
                                <button
                                    onClick={() => openCajaModal(sucursal.id)}
                                    className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-500 font-medium hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all duration-300"
                                >
                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                    <span className="text-amber-600 dark:text-amber-500">agregar caja</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Agregar Sucursal */}
            {isSucursalModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeSucursalModal}
                    />
                    <div className="modal-content relative w-full max-w-md bg-white dark:bg-background-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden">
                        <div className="relative px-6 py-5 border-b border-border-light dark:border-border-dark bg-gradient-to-r from-primary/5 to-blue-500/5 dark:from-primary/10 dark:to-blue-500/10">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/30">
                                    <span className="material-symbols-outlined text-2xl">add_business</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nueva Sucursal</h2>
                                    <p className="text-sm text-neutral-gray">Crea una nueva sucursal</p>
                                </div>
                            </div>
                            <button
                                onClick={closeSucursalModal}
                                className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSucursalSubmit} className="p-6">
                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="sucursalNombre">
                                        Nombre de la Sucursal <span className="text-destructive-red">*</span>
                                    </label>
                                    <div className={`relative transition-all duration-300 ${focusedField === 'sucursalNombre' ? 'scale-[1.01]' : ''}`}>
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-gray material-symbols-outlined text-[20px]">
                                            store
                                        </span>
                                        <input
                                            type="text"
                                            id="sucursalNombre"
                                            value={sucursalForm.nombre}
                                            onChange={(e) => setSucursalForm({ nombre: e.target.value })}
                                            onFocus={() => setFocusedField('sucursalNombre')}
                                            onBlur={() => setFocusedField(null)}
                                            className="input-animated w-full pl-12 pr-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-neutral-gray uppercase"
                                            placeholder="Ej. CENTRO, NORTE, SUR..."
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-border-light dark:border-border-dark">
                                <button
                                    type="button"
                                    onClick={closeSucursalModal}
                                    className="px-5 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 btn-bounce"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-blue-600 text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] btn-bounce"
                                >
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Agregar Caja */}
            {isCajaModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeCajaModal}
                    />
                    <div className="modal-content relative w-full max-w-md bg-white dark:bg-background-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden">
                        <div className="relative px-6 py-5 border-b border-border-light dark:border-border-dark bg-gradient-to-r from-amber-500/5 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/10">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30">
                                    <span className="material-symbols-outlined text-2xl">point_of_sale</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nueva Caja</h2>
                                    <p className="text-sm text-neutral-gray">
                                        Sucursal: <span className="font-semibold text-primary">
                                            {sucursales.find(s => s.id === selectedSucursalId)?.nombre}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeCajaModal}
                                className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleCajaSubmit} className="p-6">
                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="cajaNombre">
                                        Nombre de la Caja <span className="text-destructive-red">*</span>
                                    </label>
                                    <div className={`relative transition-all duration-300 ${focusedField === 'cajaNombre' ? 'scale-[1.01]' : ''}`}>
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-gray material-symbols-outlined text-[20px]">
                                            point_of_sale
                                        </span>
                                        <input
                                            type="text"
                                            id="cajaNombre"
                                            value={cajaForm.nombre}
                                            onChange={(e) => setCajaForm({ nombre: e.target.value })}
                                            onFocus={() => setFocusedField('cajaNombre')}
                                            onBlur={() => setFocusedField(null)}
                                            className="input-animated w-full pl-12 pr-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-neutral-gray"
                                            placeholder="Ej. Caja Principal, Caja 1..."
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-border-light dark:border-border-dark">
                                <button
                                    type="button"
                                    onClick={closeCajaModal}
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
