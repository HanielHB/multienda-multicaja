import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AddProducto() {
    const [controlarStock, setControlarStock] = useState(true);

    return (
        <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex flex-wrap justify-between gap-3 items-center">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-neutral-gray mb-1">
                        <Link className="text-sm hover:text-primary" to="/admin/productos">Inventario</Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Nuevo Producto</span>
                    </div>
                    <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Formulario de Producto</h1>
                </div>
                <div className="flex gap-3">
                    <Link
                        to="/admin/productos"
                        className="flex items-center justify-center px-4 py-2 rounded-lg border border-border-light dark:border-border-dark text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button className="flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-sm">
                        Guardar Producto
                    </button>
                </div>
            </div>

            {/* Form Sections */}
            <div className="flex flex-col gap-6">
                {/* Información General */}
                <div className="bg-white dark:bg-background-dark dark:border dark:border-border-dark rounded-xl shadow-sm border border-border-light p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Información General</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre del Producto */}
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Producto</label>
                            <input
                                className="w-full rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary px-3 py-2"
                                placeholder="Ej. Zapatillas Deportivas Air Run"
                                type="text"
                            />
                        </div>

                        {/* Categoría */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                            <select className="w-full rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary px-3 py-2">
                                <option>Seleccionar categoría...</option>
                                <option>Deportivo</option>
                                <option>Casual</option>
                                <option>Formal</option>
                                <option>Sandalias</option>
                            </select>
                        </div>

                        {/* Se vende por */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Se vende por</label>
                            <select className="w-full rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary px-3 py-2">
                                <option>Unidad (Par)</option>
                                <option>Caja</option>
                            </select>
                        </div>

                        {/* Precio de Compra */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio de Compra</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-neutral-gray">$</span>
                                <input
                                    className="w-full pl-7 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary px-3 py-2"
                                    placeholder="0.00"
                                    step="0.01"
                                    type="number"
                                />
                            </div>
                        </div>

                        {/* Precio de Venta */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio de Venta</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-neutral-gray">$</span>
                                <input
                                    className="w-full pl-7 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary px-3 py-2"
                                    placeholder="0.00"
                                    step="0.01"
                                    type="number"
                                />
                            </div>
                        </div>

                        {/* Código de Barras */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código de Barras</label>
                            <div className="flex gap-2">
                                <input
                                    className="w-full rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary px-3 py-2"
                                    placeholder="Escaneé o ingrese código"
                                    type="text"
                                />
                                <button className="p-2 text-neutral-gray hover:text-gray-700 dark:hover:text-gray-300 border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                                </button>
                            </div>
                        </div>

                        {/* Código Interno */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código Interno</label>
                            <div className="flex gap-2">
                                <input
                                    className="w-full rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary px-3 py-2"
                                    placeholder="Código automático"
                                    type="text"
                                />
                                <button className="px-3 py-2 bg-background-light hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark transition-colors">
                                    Generar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Control de Inventario */}
                <div className="bg-white dark:bg-background-dark dark:border dark:border-border-dark rounded-xl shadow-sm border border-border-light p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Control de Inventario</h2>
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="stock-toggle">Controlar stock</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    checked={controlarStock}
                                    onChange={(e) => setControlarStock(e.target.checked)}
                                    className="sr-only peer"
                                    id="stock-toggle"
                                    type="checkbox"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>

                    {controlarStock && (
                        <div className="p-5 bg-background-light dark:bg-gray-900/50 rounded-lg border border-border-light dark:border-border-dark">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Sucursal */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Sucursal</label>
                                    <select className="w-full rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary px-3 py-2">
                                        <option>Genérica</option>
                                        <option>Sucursal Norte</option>
                                        <option>Sucursal Centro</option>
                                    </select>
                                </div>

                                {/* Almacén */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Almacén</label>
                                    <select className="w-full rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary px-3 py-2">
                                        <option>Almacén principal</option>
                                        <option>Depósito Trasero</option>
                                    </select>
                                </div>

                                {/* Divider */}
                                <div className="col-span-1 md:col-span-2 border-t border-border-light dark:border-border-dark my-1"></div>

                                {/* Stock fields */}
                                <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    {/* Stock Actual */}
                                    <div className="flex flex-col gap-1">
                                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-[18px] text-neutral-gray">inventory</span>
                                            Stock Actual
                                        </label>
                                        <input
                                            className="w-full bg-transparent border-0 border-b-2 border-border-light dark:border-border-dark focus:ring-0 focus:border-primary px-0 py-2 text-gray-900 dark:text-white placeholder-neutral-gray transition-colors"
                                            placeholder="0"
                                            type="number"
                                        />
                                    </div>

                                    {/* Stock Mínimo */}
                                    <div className="flex flex-col gap-1">
                                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-[18px] text-neutral-gray">warning</span>
                                            Stock Mínimo
                                        </label>
                                        <input
                                            className="w-full bg-transparent border-0 border-b-2 border-border-light dark:border-border-dark focus:ring-0 focus:border-primary px-0 py-2 text-gray-900 dark:text-white placeholder-neutral-gray transition-colors"
                                            placeholder="0"
                                            type="number"
                                        />
                                    </div>

                                    {/* Ubicación */}
                                    <div className="flex flex-col gap-1">
                                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-400">
                                            <span className="material-symbols-outlined text-[18px] text-neutral-gray">location_on</span>
                                            Ubicación
                                        </label>
                                        <input
                                            className="w-full bg-transparent border-0 border-b-2 border-border-light dark:border-border-dark focus:ring-0 focus:border-primary px-0 py-2 text-gray-900 dark:text-white placeholder-neutral-gray transition-colors"
                                            placeholder="Pasillo A-01"
                                            type="text"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
