import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = '/api';

export default function Sucursales() {
    const [sucursales, setSucursales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal states
    const [isSucursalModalOpen, setIsSucursalModalOpen] = useState(false);
    const [isCajaModalOpen, setIsCajaModalOpen] = useState(false);
    const [selectedSucursalId, setSelectedSucursalId] = useState(null);
    const [editingSucursalId, setEditingSucursalId] = useState(null);
    const [editingCajaId, setEditingCajaId] = useState(null);
    const [sucursalForm, setSucursalForm] = useState({ nombre: '', direccion: '' });
    const [cajaForm, setCajaForm] = useState({ nombre: '' });
    const [formLoading, setFormLoading] = useState(false);

    // Delete confirmation modal states
    const [isDeleteCajaModalOpen, setIsDeleteCajaModalOpen] = useState(false);
    const [deletingCajaId, setDeletingCajaId] = useState(null);
    const [deletingCajaName, setDeletingCajaName] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchSucursales();
    }, []);

    const fetchSucursales = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/sucursales`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Error al obtener sucursales');
            }

            const result = await response.json();
            setSucursales(Array.isArray(result) ? result : (result.data || []));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Sucursal Modal Handlers
    const openSucursalModal = (sucursal = null) => {
        if (sucursal) {
            setEditingSucursalId(sucursal.id);
            setSucursalForm({ nombre: sucursal.nombre || '', direccion: sucursal.direccion || '' });
        } else {
            setEditingSucursalId(null);
            setSucursalForm({ nombre: '', direccion: '' });
        }
        setIsSucursalModalOpen(true);
    };

    const closeSucursalModal = () => {
        setIsSucursalModalOpen(false);
        setSucursalForm({ nombre: '', direccion: '' });
        setEditingSucursalId(null);
    };

    const handleSucursalSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = editingSucursalId ? `${API_URL}/sucursales/${editingSucursalId}` : `${API_URL}/sucursales`;
            const method = editingSucursalId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sucursalForm)
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Error al guardar sucursal');
            }

            closeSucursalModal();
            fetchSucursales();
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteSucursal = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta sucursal?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/sucursales/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar sucursal');
            }

            fetchSucursales();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    // Caja Modal Handlers
    const openCajaModal = (sucursalId, caja = null) => {
        setSelectedSucursalId(sucursalId);
        if (caja) {
            setEditingCajaId(caja.id);
            setCajaForm({ nombre: caja.nombre || '' });
        } else {
            setEditingCajaId(null);
            setCajaForm({ nombre: '' });
        }
        setIsCajaModalOpen(true);
    };

    const closeCajaModal = () => {
        setIsCajaModalOpen(false);
        setCajaForm({ nombre: '' });
        setSelectedSucursalId(null);
        setEditingCajaId(null);
    };

    const handleCajaSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = editingCajaId ? `${API_URL}/cajas/${editingCajaId}` : `${API_URL}/cajas`;
            const method = editingCajaId ? 'PUT' : 'POST';

            const dataToSend = editingCajaId
                ? { nombre: cajaForm.nombre }
                : { nombre: cajaForm.nombre, sucursalId: selectedSucursalId };

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
                throw new Error(result.message || 'Error al guardar caja');
            }

            closeCajaModal();
            fetchSucursales();
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setFormLoading(false);
        }
    };

    // Delete Caja Modal Handlers
    const openDeleteCajaModal = (caja) => {
        setDeletingCajaId(caja.id);
        setDeletingCajaName(caja.nombre);
        setIsDeleteCajaModalOpen(true);
    };

    const closeDeleteCajaModal = () => {
        setIsDeleteCajaModalOpen(false);
        setDeletingCajaId(null);
        setDeletingCajaName('');
    };

    const handleDeleteCaja = async () => {
        if (!deletingCajaId) return;
        setDeleteLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/cajas/${deletingCajaId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar caja');
            }

            closeDeleteCajaModal();
            fetchSucursales();
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'LIBRE': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'OCUPADA': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'CERRADA': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
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
                    onClick={fetchSucursales}
                    className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center">
                <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em] mb-2">
                    Sucursales y Cajas
                </h1>
                <p className="text-neutral-gray dark:text-gray-400 text-base mb-6">
                    Gestiona tus sucursales y puntos de venta
                </p>

                {/* Add Sucursal Button */}
                <button
                    onClick={() => openSucursalModal()}
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all duration-300"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Agregar Sucursal
                </button>
            </div>

            {/* Sucursales List */}
            <div className="flex flex-col gap-6">
                {sucursales.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-background-dark rounded-xl border border-border-light dark:border-border-dark">
                        <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-6xl mb-4 block">store</span>
                        <p className="text-neutral-gray dark:text-gray-400">No hay sucursales registradas</p>
                    </div>
                ) : (
                    sucursales.map((sucursal) => (
                        <div
                            key={sucursal.id}
                            className="bg-white dark:bg-background-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden"
                        >
                            {/* Sucursal Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                                        <span className="material-symbols-outlined">store</span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {sucursal.nombre}
                                        </h2>
                                        {sucursal.direccion && (
                                            <p className="text-xs text-neutral-gray">{sucursal.direccion}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-neutral-gray mr-2">
                                        {sucursal._count?.usuarios || 0} usuarios • {sucursal._count?.almacenes || 0} almacenes
                                    </span>
                                    <button
                                        onClick={() => openSucursalModal(sucursal)}
                                        className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800 transition-colors"
                                        title="Editar sucursal"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSucursal(sucursal.id)}
                                        className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-red-50 hover:text-destructive-red dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                        title="Eliminar sucursal"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                </div>
                            </div>

                            {/* Cajas List */}
                            <div className="p-5">
                                <div className="flex flex-col gap-3">
                                    {sucursal.cajas?.map((caja) => (
                                        <div
                                            key={caja.id}
                                            className="flex items-center justify-between p-4 bg-background-light dark:bg-gray-800/50 rounded-lg border border-border-light dark:border-border-dark"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                                                    <span className="material-symbols-outlined">point_of_sale</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                        {caja.nombre}
                                                    </span>
                                                    <span className="text-xs text-neutral-gray dark:text-gray-500 font-mono">
                                                        {caja.codigo}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(caja.estado)}`}>
                                                    {caja.estado}
                                                </span>
                                                <button
                                                    onClick={() => openCajaModal(sucursal.id, caja)}
                                                    className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-white hover:text-primary dark:hover:bg-gray-700 transition-colors"
                                                    title="Editar caja"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => openDeleteCajaModal(caja)}
                                                    className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-red-50 hover:text-destructive-red dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                                    title="Eliminar caja"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Caja Button */}
                                    <button
                                        onClick={() => openCajaModal(sucursal.id)}
                                        className="flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-500 font-medium hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all duration-300"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                        <span>Agregar caja</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Agregar/Editar Sucursal */}
            {isSucursalModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeSucursalModal} />
                    <div className="relative w-full max-w-md bg-white dark:bg-background-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden">
                        <div className="relative px-6 py-5 border-b border-border-light dark:border-border-dark bg-gradient-to-r from-primary/5 to-blue-500/5">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg">
                                    <span className="material-symbols-outlined text-2xl">{editingSucursalId ? 'edit' : 'add_business'}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {editingSucursalId ? 'Editar Sucursal' : 'Nueva Sucursal'}
                                    </h2>
                                    <p className="text-sm text-neutral-gray">
                                        {editingSucursalId ? 'Modifica los datos de la sucursal' : 'Crea una nueva sucursal'}
                                    </p>
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
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Nombre de la Sucursal <span className="text-destructive-red">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={sucursalForm.nombre}
                                        onChange={(e) => setSucursalForm({ ...sucursalForm, nombre: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                                        placeholder="Ej. Zapatería Central"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        value={sucursalForm.direccion}
                                        onChange={(e) => setSucursalForm({ ...sucursalForm, direccion: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                                        placeholder="Av. Principal #456"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-border-light dark:border-border-dark">
                                <button
                                    type="button"
                                    onClick={closeSucursalModal}
                                    className="px-5 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                    {formLoading ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Agregar/Editar Caja */}
            {isCajaModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCajaModal} />
                    <div className="relative w-full max-w-md bg-white dark:bg-background-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden">
                        <div className="relative px-6 py-5 border-b border-border-light dark:border-border-dark bg-gradient-to-r from-amber-500/5 to-orange-500/5">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
                                    <span className="material-symbols-outlined text-2xl">{editingCajaId ? 'edit' : 'point_of_sale'}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {editingCajaId ? 'Editar Caja' : 'Nueva Caja'}
                                    </h2>
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
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Nombre de la Caja <span className="text-destructive-red">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={cajaForm.nombre}
                                        onChange={(e) => setCajaForm({ nombre: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                                        placeholder="Ej. Caja Principal, Caja 1..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-border-light dark:border-border-dark">
                                <button
                                    type="button"
                                    onClick={closeCajaModal}
                                    className="px-5 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-all shadow-sm disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                    {formLoading ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Confirmar Eliminación de Caja */}
            {isDeleteCajaModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeDeleteCajaModal} />
                    <div className="relative w-full max-w-sm bg-white dark:bg-background-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden">
                        <div className="relative px-6 py-5 border-b border-border-light dark:border-border-dark bg-gradient-to-r from-red-500/5 to-red-600/5">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg">
                                    <span className="material-symbols-outlined text-2xl">delete</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Eliminar Caja
                                    </h2>
                                    <p className="text-sm text-neutral-gray">
                                        Esta acción no se puede deshacer
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeDeleteCajaModal}
                                className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-700 dark:text-gray-300 text-center">
                                ¿Estás seguro de eliminar la caja <span className="font-bold text-gray-900 dark:text-white">"{deletingCajaName}"</span>?
                            </p>

                            <div className="flex items-center justify-center gap-3 pt-6 mt-6 border-t border-border-light dark:border-border-dark">
                                <button
                                    type="button"
                                    onClick={closeDeleteCajaModal}
                                    disabled={deleteLoading}
                                    className="px-5 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteCaja}
                                    disabled={deleteLoading}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all shadow-sm disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                    {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
