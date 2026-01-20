import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = '/api';

export default function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filtrar categorías
    const filteredCategorias = categorias.filter(cat => {
        const searchLower = searchTerm.toLowerCase();
        return !searchTerm || 
            cat.nombre?.toLowerCase().includes(searchLower) ||
            cat.descripcion?.toLowerCase().includes(searchLower);
    });

    // Paginación
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredCategorias.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredCategorias.length / itemsPerPage);

    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

    // Reset página al buscar
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/categorias`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Error al obtener categorías');
            }

            const result = await response.json();
            setCategorias(Array.isArray(result) ? result : (result.data || []));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/categorias/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar categoría');
            }

            fetchCategorias();
        } catch (err) {
            alert('Error al eliminar: ' + err.message);
        }
    };

    const getIconColor = (index) => {
        const colors = [
            'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
            'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
            'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
            'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
            'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
            'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
            'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
            'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
        ];
        return colors[index % colors.length];
    };

    const getIcon = (icono) => {
        const iconMap = {
            'sport': 'directions_run',
            'casual': 'styler',
            'formal': 'work',
            'sandal': 'beach_access',
            'boot': 'hiking',
            'accessory': 'checkroom',
            'kids': 'child_care',
            'women': 'woman',
            'men': 'man'
        };
        return iconMap[icono] || 'category';
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
                    onClick={fetchCategorias}
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
                        <Link className="text-sm hover:text-primary" to="/admin/productos">Inventario</Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Categorías</span>
                    </div>
                    <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Lista de Categorías</h1>
                </div>
                <div className="flex gap-3">
                    <Link
                        to="/admin/categorias/add"
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Nueva Categoría
                    </Link>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white dark:bg-background-dark dark:border dark:border-border-dark rounded-xl shadow-sm border border-border-light overflow-hidden">
                <div className="p-4 border-b border-border-light dark:border-border-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-neutral-gray text-[20px]">search</span>
                        <input
                            className="w-full pl-10 py-2 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary text-sm"
                            placeholder="Buscar categoría..."
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
                                <th className="p-4 pl-6 w-1/3">Nombre</th>
                                <th className="p-4">Descripción</th>
                                <th className="p-4 text-center">Estado</th>
                                <th className="p-4 pr-6 text-right w-40">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {categorias.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center">
                                        <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-6xl mb-4 block">category</span>
                                        <p className="text-neutral-gray dark:text-gray-400">No hay categorías registradas</p>
                                        <Link to="/admin/categorias/add" className="text-primary hover:underline text-sm mt-2 inline-block">
                                            Agregar primera categoría
                                        </Link>
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map((categoria, index) => (
                                    <tr key={categoria.id} className="hover:bg-background-light dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${getIconColor(index)}`}>
                                                    <span className="material-symbols-outlined">{getIcon(categoria.icono)}</span>
                                                </div>
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{categoria.nombre}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-neutral-gray dark:text-gray-400">
                                                {categoria.descripcion || 'Sin descripción'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${categoria.activa
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                }`}>
                                                <span className={`size-1.5 rounded-full ${categoria.activa ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                                                {categoria.activa ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    to={`/admin/categorias/edit/${categoria.id}`}
                                                    className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800 transition-colors"
                                                    title="Editar"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(categoria.id)}
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
                        {filteredCategorias.length > 0 ? (
                            <>Mostrando <span className="font-medium text-gray-900 dark:text-white">{indexOfFirst + 1}-{Math.min(indexOfLast, filteredCategorias.length)}</span> de <span className="font-medium text-gray-900 dark:text-white">{filteredCategorias.length}</span> categorías</>
                        ) : (
                            <>No se encontraron categorías</>
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
        </div>
    );
}
