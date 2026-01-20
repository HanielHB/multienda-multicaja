import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = '/api';

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombres: '',
        email: '',
        password: '',
        nroDoc: '',
        telefono: '',
        tipo: 'cajero',
        sucursalId: '',
        estado: true
    });

    // Check if we are creating or editing
    const isEditing = Boolean(editingId);

    // Filtrar usuarios
    const filteredUsuarios = usuarios.filter(usr => {
        const searchLower = searchTerm.toLowerCase();
        return !searchTerm || 
            usr.nombres?.toLowerCase().includes(searchLower) ||
            usr.email?.toLowerCase().includes(searchLower) ||
            usr.sucursal?.nombre?.toLowerCase().includes(searchLower) ||
            usr.tipo?.toLowerCase().includes(searchLower);
    });

    // Paginación
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredUsuarios.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);

    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    // Reset página al buscar
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        fetchUsuarios();
        fetchSucursales();
    }, []);

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/usuarios`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Error al obtener usuarios');
            }

            const result = await response.json();
            setUsuarios(Array.isArray(result) ? result : (result.data || []));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchSucursales = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/sucursales`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const result = await response.json();
                setSucursales(Array.isArray(result) ? result : (result.data || []));
            }
        } catch (err) {
            console.error('Error fetching sucursales:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/usuarios/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar usuario');
            }

            fetchUsuarios();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const openModal = (usuario = null) => {
        if (usuario) {
            setEditingId(usuario.id);
            setFormData({
                nombres: usuario.nombres || '',
                email: usuario.email || '',
                password: '', // Password is usually not populated on edit
                nroDoc: usuario.nroDoc || '',
                telefono: usuario.telefono || '',
                tipo: usuario.tipo || 'cajero',
                sucursalId: usuario.sucursalId || '',
                estado: usuario.estado ?? true
            });
        } else {
            setEditingId(null);
            setFormData({
                nombres: '',
                email: '',
                password: '',
                nroDoc: '',
                telefono: '',
                tipo: 'cajero',
                sucursalId: '',
                estado: true
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({
            nombres: '',
            email: '',
            password: '',
            nroDoc: '',
            telefono: '',
            tipo: 'cajero',
            sucursalId: '',
            estado: true
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = isEditing ? `${API_URL}/usuarios/${editingId}` : `${API_URL}/usuarios`;
            const method = isEditing ? 'PUT' : 'POST';

            // Filter out empty password if editing
            const dataToSend = { ...formData };
            if (isEditing && !dataToSend.password) {
                delete dataToSend.password;
            }
            // Ensure sucursalId is number
            if (dataToSend.sucursalId) {
                dataToSend.sucursalId = parseInt(dataToSend.sucursalId);
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al guardar usuario');
            }

            closeModal();
            fetchUsuarios();
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const getRolColor = (rol) => {
        switch (rol) {
            case 'administrador': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'supervisor': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'vendedor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'cajero': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
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
                    onClick={fetchUsuarios}
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
            <div className="flex flex-wrap justify-between gap-3 items-center">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-neutral-gray mb-1">
                        <Link className="text-sm hover:text-primary transition-colors" to="/admin">Administración</Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Usuarios</span>
                    </div>
                    <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Lista de Usuarios</h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => openModal()}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-primary/40"
                    >
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        Nuevo Usuario
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
                            placeholder="Buscar usuario..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background-light dark:bg-gray-900/50 border-b border-border-light dark:border-border-dark text-xs uppercase text-neutral-gray font-semibold tracking-wide">
                                <th className="p-4 pl-6">Nombre</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Sucursal</th>
                                <th className="p-4">Rol</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4 pr-6 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {usuarios.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center">
                                        <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-6xl mb-4 block">group_off</span>
                                        <p className="text-neutral-gray dark:text-gray-400">No hay usuarios registrados</p>
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((usuario) => (
                                    <tr key={usuario.id} className="hover:bg-background-light dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{usuario.nombres}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-neutral-gray dark:text-gray-400">{usuario.email}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {usuario.sucursal ? usuario.sucursal.nombre : 'Sin asignación'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRolColor(usuario.tipo)}`}>
                                                {usuario.tipo}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${usuario.estado
                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${usuario.estado ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                                                {usuario.estado ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => openModal(usuario)}
                                                    className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800 transition-colors"
                                                    title="Editar"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(usuario.id)}
                                                    className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-red-50 hover:text-destructive-red dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
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
                        {filteredUsuarios.length > 0 ? (
                            <>Mostrando <span className="font-medium text-gray-900 dark:text-white">{indexOfFirst + 1}-{Math.min(indexOfLast, filteredUsuarios.length)}</span> de <span className="font-medium text-gray-900 dark:text-white">{filteredUsuarios.length}</span> usuarios</>
                        ) : (
                            <>No se encontraron usuarios</>
                        )}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 text-sm font-medium border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1.5 text-sm font-medium border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal - Registrar/Editar Usuario */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />

                    <div className="relative w-full max-w-2xl bg-white dark:bg-background-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden">
                        <div className="relative px-6 py-5 border-b border-border-light dark:border-border-dark text-center bg-gray-50 dark:bg-gray-800/50">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {isEditing ? 'Editar Usuario' : 'Registrar Usuario'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nombres */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo *</label>
                                    <input
                                        type="text"
                                        name="nombres"
                                        value={formData.nombres}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary text-sm"
                                        placeholder="Ej. Juan Pérez"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary text-sm"
                                        placeholder="usuario@ejemplo.com"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {isEditing ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary text-sm"
                                        placeholder="••••••"
                                        required={!isEditing}
                                    />
                                </div>

                                {/* Sucursal */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sucursal *</label>
                                    <select
                                        name="sucursalId"
                                        value={formData.sucursalId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary text-sm"
                                        required
                                    >
                                        <option value="">Seleccionar sucursal...</option>
                                        {sucursales.map(s => (
                                            <option key={s.id} value={s.id}>{s.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Rol/Tipo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rol *</label>
                                    <select
                                        name="tipo"
                                        value={formData.tipo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary text-sm"
                                    >
                                        <option value="administrador">Administrador</option>
                                        <option value="cajero">Cajero</option>
                                        <option value="vendedor">Vendedor</option>
                                        <option value="supervisor">Supervisor</option>
                                    </select>
                                </div>

                                {/* Documento */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nro. Documento</label>
                                    <input
                                        type="text"
                                        name="nroDoc"
                                        value={formData.nroDoc}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary text-sm"
                                        placeholder="12345678"
                                    />
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                                    <input
                                        type="text"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary text-sm"
                                        placeholder="+591 70000000"
                                    />
                                </div>

                                {/* Estado Checkbox */}
                                <div className="col-span-2 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-border-light dark:border-border-dark">
                                    <input
                                        type="checkbox"
                                        name="estado"
                                        checked={formData.estado}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        id="estadoUser"
                                    />
                                    <label htmlFor="estadoUser" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer select-none">
                                        Usuario Activo
                                    </label>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
                                >
                                    {formLoading ? 'Guardando...' : 'Guardar Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
