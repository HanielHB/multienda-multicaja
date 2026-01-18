import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const API_URL = '/api';

export default function AddCategoria() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState('');
    const [nombre, setNombre] = useState('');
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (isEditing) {
            fetchCategoria();
        }
    }, [id]);

    const fetchCategoria = async () => {
        try {
            setLoadingData(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/categorias/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const result = await response.json();
                const categoria = result.data || result;
                setNombre(categoria.nombre || '');
                setIsActive(categoria.activa ?? true);
            } else {
                throw new Error('Error al cargar la categoría');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingData(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            const dataToSend = {
                nombre: nombre,
                activa: isActive
            };

            const url = isEditing ? `${API_URL}/categorias/${id}` : `${API_URL}/categorias`;
            const method = isEditing ? 'PUT' : 'POST';

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
                throw new Error(result.message || `Error al ${isEditing ? 'actualizar' : 'crear'} categoría`);
            }

            navigate('/admin/categorias');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-neutral-gray">
                <Link className="text-sm hover:text-primary transition-colors" to="/admin/productos">Inventario</Link>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <Link className="text-sm hover:text-primary transition-colors" to="/admin/categorias">Categorías</Link>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
                </span>
            </div>

            {/* Page Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                    {isEditing ? 'Editar Categoría' : 'Crear Categoría'}
                </h1>
                <p className="text-neutral-gray dark:text-gray-400 text-base">
                    {isEditing ? 'Modifica la información de la categoría.' : 'Ingresa el nombre para registrar una nueva categoría.'}
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500 text-[20px]">error</span>
                    <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                </div>
            )}

            {/* Form Card */}
            <div className="bg-white dark:bg-background-dark dark:border dark:border-border-dark rounded-xl shadow-sm border border-border-light overflow-hidden">
                <div className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Nombre de la Categoría */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-900 dark:text-white text-sm font-semibold leading-tight" htmlFor="categoryName">
                                Nombre de la Categoría <span className="text-destructive-red">*</span>
                            </label>
                            <input
                                className="w-full rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm py-3 px-4 placeholder:text-neutral-gray transition-all"
                                id="categoryName"
                                name="categoryName"
                                placeholder="Ej. Deportivo, Casual, Sandalias..."
                                required
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                            <p className="text-xs text-neutral-gray dark:text-gray-400">El nombre debe ser único y descriptivo.</p>
                        </div>

                        {/* Categoría Activa Toggle */}
                        <div className="flex items-center justify-between p-4 bg-background-light dark:bg-gray-800/50 rounded-lg border border-border-light dark:border-border-dark">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Categoría Activa</span>
                                <span className="text-xs text-neutral-gray">Las categorías inactivas no aparecerán en el sistema POS</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="sr-only peer"
                                    id="isActive"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-4 pt-6 mt-2 border-t border-border-light dark:border-border-dark">
                            <Link
                                to="/admin/categorias"
                                className="px-5 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-primary/40 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                {loading ? 'Guardando...' : (isEditing ? 'Actualizar Categoría' : 'Guardar Categoría')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
