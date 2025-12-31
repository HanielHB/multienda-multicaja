import React from 'react';
import { Link } from 'react-router-dom';

export default function Categorias() {
    // Sample categories data
    const categorias = [
        {
            id: 1,
            nombre: 'Deportivo',
            descripcion: 'Calzado para actividades físicas y entrenamiento.',
            icon: 'directions_run',
            colorClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        },
        {
            id: 2,
            nombre: 'Casual',
            descripcion: 'Estilo relajado para uso diario.',
            icon: 'styler',
            colorClass: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
        },
        {
            id: 3,
            nombre: 'Formal',
            descripcion: 'Zapatos de vestir y ocasiones especiales.',
            icon: 'work',
            colorClass: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
        },
        {
            id: 4,
            nombre: 'Sandalias',
            descripcion: 'Calzado abierto ligero para verano.',
            icon: 'beach_access',
            colorClass: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
        },
        {
            id: 5,
            nombre: 'Botas',
            descripcion: 'Calzado resistente para trabajo o invierno.',
            icon: 'hiking',
            colorClass: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
        },
    ];

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
                {/* Search and Filter Bar */}
                <div className="p-4 border-b border-border-light dark:border-border-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-neutral-gray text-[20px]">search</span>
                        <input
                            className="w-full pl-10 py-2 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary text-sm"
                            placeholder="Buscar categoría..."
                            type="text"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">filter_list</span>
                            Filtrar
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background-light dark:bg-gray-900/50 border-b border-border-light dark:border-border-dark text-xs uppercase text-neutral-gray font-semibold tracking-wide">
                                <th className="p-4 pl-6 w-1/2">Nombre</th>
                                <th className="p-4">Descripción</th>
                                <th className="p-4 pr-6 text-right w-40">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {categorias.map((categoria) => (
                                <tr key={categoria.id} className="hover:bg-background-light dark:hover:bg-gray-800/50 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${categoria.colorClass}`}>
                                                <span className="material-symbols-outlined">{categoria.icon}</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{categoria.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-neutral-gray dark:text-gray-400">{categoria.descripcion}</span>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800 transition-colors"
                                                title="Editar"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button
                                                className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-red-50 hover:text-destructive-red dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                                title="Eliminar"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-border-light dark:border-border-dark flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-sm text-neutral-gray dark:text-gray-400">
                        Mostrando <span className="font-medium text-gray-900 dark:text-white">1-5</span> de <span className="font-medium text-gray-900 dark:text-white">12</span> categorías
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
        </div>
    );
}
