import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = '/api';

export default function Almacenes() {
    const [groupedAlmacenes, setGroupedAlmacenes] = useState([]);
    const [sucursales, setSucursales] = useState([]); // List of all sucursales for reference if needed
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal states
    const [isAlmacenModalOpen, setIsAlmacenModalOpen] = useState(false);
    const [selectedSucursalId, setSelectedSucursalId] = useState(null);
    const [editingAlmacenId, setEditingAlmacenId] = useState(null);
    const [almacenForm, setAlmacenForm] = useState({ nombre: '', ubicacion: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [almacenesRes, sucursalesRes] = await Promise.all([
                fetch(`${API_URL}/almacenes`, { headers }),
                fetch(`${API_URL}/sucursales`, { headers })
            ]);

            if (!almacenesRes.ok || !sucursalesRes.ok) {
                throw new Error('Error al obtener datos');
            }

            const almacenesData = await almacenesRes.json();
            const sucursalesData = await sucursalesRes.json();

            const almacenesList = Array.isArray(almacenesData) ? almacenesData : (almacenesData.data || []);
            const sucursalesList = Array.isArray(sucursalesData) ? sucursalesData : (sucursalesData.data || []);

            setSucursales(sucursalesList);
            processGroupedData(sucursalesList, almacenesList);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const processGroupedData = (sucursalesList, almacenesList) => {
        // We want to show all sucursales, even those without almacenes
        const groups = sucursalesList.map(sucursal => {
            return {
                ...sucursal,
                almacenes: almacenesList.filter(a => a.sucursalId === sucursal.id)
            };
        });
        setGroupedAlmacenes(groups);
    };

    // Handlers
    const openAlmacenModal = (sucursalId, almacen = null) => {
        setSelectedSucursalId(sucursalId);
        if (almacen) {
            setEditingAlmacenId(almacen.id);
            setAlmacenForm({ nombre: almacen.nombre || '', ubicacion: almacen.ubicacion || '' });
        } else {
            setEditingAlmacenId(null);
            setAlmacenForm({ nombre: '', ubicacion: '' });
        }
        setIsAlmacenModalOpen(true);
    };

    const closeAlmacenModal = () => {
        setIsAlmacenModalOpen(false);
        setAlmacenForm({ nombre: '', ubicacion: '' });
        setSelectedSucursalId(null);
        setEditingAlmacenId(null);
    };

    const handleAlmacenSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = editingAlmacenId ? `${API_URL}/almacenes/${editingAlmacenId}` : `${API_URL}/almacenes`;
            const method = editingAlmacenId ? 'PUT' : 'POST';

            const dataToSend = {
                nombre: almacenForm.nombre,
                ubicacion: almacenForm.ubicacion,
                sucursalId: selectedSucursalId
            };

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Error al guardar almacén');
            }

            closeAlmacenModal();
            fetchData(); // Refresh all data
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteAlmacen = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este almacén?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/almacenes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar almacén');
            }

            fetchData();
        } catch (err) {
            alert('Error: ' + err.message);
        }
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
                    onClick={fetchData}
                    className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="text-center">
                <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em] mb-2">
                    Almacenes por sucursal
                </h1>
                <p className="text-neutral-gray dark:text-gray-400 text-base">
                    Gestiona tus almacenes organizados por sucursal
                </p>
            </div>

            {/* Sucursales Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groupedAlmacenes.map((sucursal) => (
                    <div
                        key={sucursal.id}
                        className="bg-white dark:bg-background-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden hover:shadow-md transition-shadow"
                    >
                        {/* Sucursal Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/30">
                            <h2 className="text-base font-bold text-gray-900 dark:text-white">
                                SUCURSAL: <span className="text-primary">{sucursal.nombre}</span>
                            </h2>
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-neutral-gray bg-white dark:bg-gray-800 px-2 py-1 rounded border border-border-light dark:border-border-dark">
                                    {sucursal.almacenes?.length || 0} almacenes
                                </span>
                            </div>
                        </div>

                        {/* Almacenes List */}
                        <div className="p-5">
                            <div className="flex flex-col gap-3">
                                {sucursal.almacenes && sucursal.almacenes.length > 0 ? (
                                    sucursal.almacenes.map((almacen) => (
                                        <div
                                            key={almacen.id}
                                            className="flex items-center justify-between p-4 bg-background-light dark:bg-gray-800/50 rounded-lg border border-border-light dark:border-border-dark group hover:border-primary/30 transition-colors"
                                        >
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-[18px] text-amber-600 dark:text-amber-500">warehouse</span>
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                        {almacen.nombre}
                                                    </span>
                                                </div>
                                                {almacen.ubicacion && (
                                                    <span className="text-xs text-neutral-gray dark:text-gray-500 ml-6 mt-0.5">
                                                        <span className="font-medium">Ubicación:</span> {almacen.ubicacion}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openAlmacenModal(sucursal.id, almacen)}
                                                    className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-white hover:text-primary dark:hover:bg-gray-700 transition-colors"
                                                    title="Editar almacén"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAlmacen(almacen.id)}
                                                    className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-red-50 hover:text-destructive-red dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                                    title="Eliminar almacén"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-sm text-neutral-gray italic">
                                        No hay almacenes en esta sucursal
                                    </div>
                                )}


                                <button
                                    onClick={() => openAlmacenModal(sucursal.id)}
                                    className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-500 font-medium hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all duration-300 mt-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                    <span className="text-amber-600 dark:text-amber-500">Agregar almacén</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Agregar/Editar Almacén */}
            {isAlmacenModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeAlmacenModal}
                    />
                    <div className="relative w-full max-w-md bg-white dark:bg-background-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden">
                        <div className="relative px-6 py-5 border-b border-border-light dark:border-border-dark bg-gradient-to-r from-amber-500/5 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/10">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30">
                                    <span className="material-symbols-outlined text-2xl">{editingAlmacenId ? 'edit' : 'warehouse'}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {editingAlmacenId ? 'Editar Almacén' : 'Nuevo Almacén'}
                                    </h2>
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
                                            onChange={(e) => setAlmacenForm({ ...almacenForm, nombre: e.target.value })}
                                            onFocus={() => setFocusedField('almacenNombre')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-neutral-gray"
                                            placeholder="Ej. Almacén Principal"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="ubicacion">
                                        Ubicación
                                    </label>
                                    <div className={`relative transition-all duration-300 ${focusedField === 'ubicacion' ? 'scale-[1.01]' : ''}`}>
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-gray material-symbols-outlined text-[20px]">
                                            pin_drop
                                        </span>
                                        <input
                                            type="text"
                                            id="ubicacion"
                                            value={almacenForm.ubicacion}
                                            onChange={(e) => setAlmacenForm({ ...almacenForm, ubicacion: e.target.value })}
                                            onFocus={() => setFocusedField('ubicacion')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-neutral-gray"
                                            placeholder="Ej. Bodega trasera, Piso 2..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-border-light dark:border-border-dark">
                                <button
                                    type="button"
                                    onClick={closeAlmacenModal}
                                    className="px-5 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02]"
                                >
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                    {formLoading ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
