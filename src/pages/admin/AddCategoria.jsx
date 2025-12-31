import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AddCategoria() {
    const [selectedIcon, setSelectedIcon] = useState('directions_run');
    const [isActive, setIsActive] = useState(true);

    const iconOptions = [
        { icon: 'directions_run', label: 'Deportivo' },
        { icon: 'styler', label: 'Casual' },
        { icon: 'work', label: 'Formal' },
        { icon: 'beach_access', label: 'Sandalias' },
        { icon: 'hiking', label: 'Botas' },
        { icon: 'child_care', label: 'Niños' },
        { icon: 'woman', label: 'Damas' },
        { icon: 'man', label: 'Caballeros' },
    ];

    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-neutral-gray">
                <Link className="text-sm hover:text-primary transition-colors" to="/admin/productos">Inventario</Link>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <Link className="text-sm hover:text-primary transition-colors" to="/admin/categorias">Categorías</Link>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Nueva Categoría</span>
            </div>

            {/* Page Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Crear Categoría</h1>
                <p className="text-neutral-gray dark:text-gray-400 text-base">Ingresa la información básica para registrar una nueva categoría en el sistema.</p>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-background-dark dark:border dark:border-border-dark rounded-xl shadow-sm border border-border-light overflow-hidden">
                <div className="p-6 md:p-8">
                    <form className="flex flex-col gap-6">
                        {/* Nombre de la Categoría */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-900 dark:text-white text-sm font-semibold leading-tight" htmlFor="categoryName">
                                Nombre de la Categoría <span className="text-destructive-red">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm py-3 px-4 placeholder:text-neutral-gray transition-all"
                                    id="categoryName"
                                    name="categoryName"
                                    placeholder="Ej. Deportivo, Casual, Sandalias..."
                                    required
                                    type="text"
                                />
                            </div>
                            <p className="text-xs text-neutral-gray dark:text-gray-400">El nombre debe ser único y descriptivo.</p>
                        </div>

                        {/* Descripción */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-900 dark:text-white text-sm font-semibold leading-tight" htmlFor="categoryDescription">
                                Descripción
                            </label>
                            <textarea
                                className="w-full rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm py-3 px-4 placeholder:text-neutral-gray min-h-[120px] resize-y transition-all"
                                id="categoryDescription"
                                name="categoryDescription"
                                placeholder="Describe brevemente qué tipo de productos incluye esta categoría..."
                            ></textarea>
                        </div>

                        {/* Icono Representativo */}
                        <div className="flex flex-col gap-3">
                            <label className="text-gray-900 dark:text-white text-sm font-semibold leading-tight">
                                Icono Representativo
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {iconOptions.map((option) => (
                                    <label key={option.icon} className="cursor-pointer group" title={option.label}>
                                        <input
                                            type="radio"
                                            name="icon"
                                            value={option.icon}
                                            checked={selectedIcon === option.icon}
                                            onChange={() => setSelectedIcon(option.icon)}
                                            className="sr-only peer"
                                        />
                                        <div className={`flex items-center justify-center w-12 h-12 rounded-lg border transition-all duration-200 ${selectedIcon === option.icon
                                                ? 'bg-primary/10 border-primary text-primary shadow-sm shadow-primary/20'
                                                : 'border-border-light dark:border-border-dark bg-background-light dark:bg-gray-800 text-neutral-gray hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                                            }`}>
                                            <span className="material-symbols-outlined">{option.icon}</span>
                                        </div>
                                    </label>
                                ))}
                                <button
                                    type="button"
                                    className="flex items-center justify-center w-12 h-12 rounded-lg border border-dashed border-border-light dark:border-border-dark text-neutral-gray hover:text-primary hover:border-primary transition-all duration-200"
                                    title="Agregar más íconos"
                                >
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                            </div>
                            <p className="text-xs text-neutral-gray dark:text-gray-400">Selecciona un ícono que represente visualmente esta categoría.</p>
                        </div>

                        {/* Preview del ícono seleccionado */}
                        <div className="flex items-center gap-4 p-4 bg-background-light dark:bg-gray-800/50 rounded-lg border border-border-light dark:border-border-dark">
                            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary">
                                <span className="material-symbols-outlined text-3xl">{selectedIcon}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Vista previa</span>
                                <span className="text-xs text-neutral-gray">Así se verá el ícono en la lista de categorías</span>
                            </div>
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
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-primary/40"
                            >
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                Guardar Categoría
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
