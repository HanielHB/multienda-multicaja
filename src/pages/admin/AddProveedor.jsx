import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AddProveedor() {
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        celular: ''
    });

    const [focusedField, setFocusedField] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Proveedor data:', formData);
        // Add save logic here
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto animate-fadeIn">
            {/* CSS Animations */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 25px -5px rgba(0,0,0,0.1); }
      `}</style>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-neutral-gray animate-slideIn">
                <Link className="text-sm hover:text-primary transition-colors duration-200" to="/admin">Administración</Link>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <Link className="text-sm hover:text-primary transition-colors duration-200" to="/admin/proveedores">Proveedores</Link>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Nuevo Proveedor</span>
            </div>

            {/* Page Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/30 animate-slideIn">
                        <span className="material-symbols-outlined text-2xl">add_business</span>
                    </div>
                    <div>
                        <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Nuevo Proveedor</h1>
                        <p className="text-neutral-gray dark:text-gray-400 text-sm">Registra un nuevo proveedor en el sistema</p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-background-dark dark:border dark:border-border-dark rounded-xl shadow-sm border border-border-light overflow-hidden hover-lift">
                <div className="px-6 py-4 border-b border-border-light dark:border-border-dark bg-gradient-to-r from-background-light to-white dark:from-gray-800/50 dark:to-background-dark">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">business</span>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Información del Proveedor</h2>
                    </div>
                </div>
                <div className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="nombre">
                                Nombre del Proveedor <span className="text-destructive-red">*</span>
                            </label>
                            <div className={`relative transition-all duration-300 ${focusedField === 'nombre' ? 'scale-[1.01]' : ''}`}>
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-gray material-symbols-outlined text-[20px]">
                                    store
                                </span>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('nombre')}
                                    onBlur={() => setFocusedField(null)}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all duration-300 placeholder:text-neutral-gray"
                                    placeholder="Ej. Distribuidora CalzadoPRO"
                                    required
                                />
                            </div>
                            <p className="text-xs text-neutral-gray mt-1.5">Nombre comercial o razón social del proveedor</p>
                        </div>

                        {/* Dirección */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="direccion">
                                Dirección <span className="text-destructive-red">*</span>
                            </label>
                            <div className={`relative transition-all duration-300 ${focusedField === 'direccion' ? 'scale-[1.01]' : ''}`}>
                                <span className="absolute left-4 top-3 text-neutral-gray material-symbols-outlined text-[20px]">
                                    pin_drop
                                </span>
                                <textarea
                                    id="direccion"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('direccion')}
                                    onBlur={() => setFocusedField(null)}
                                    rows="2"
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all duration-300 placeholder:text-neutral-gray resize-none"
                                    placeholder="Av. Industrial 500, Bodega 4"
                                    required
                                />
                            </div>
                            <p className="text-xs text-neutral-gray mt-1.5">Dirección física del proveedor</p>
                        </div>

                        {/* Número de Celular */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="celular">
                                Número de Celular <span className="text-destructive-red">*</span>
                            </label>
                            <div className={`relative transition-all duration-300 ${focusedField === 'celular' ? 'scale-[1.01]' : ''}`}>
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-gray material-symbols-outlined text-[20px]">
                                    smartphone
                                </span>
                                <input
                                    type="tel"
                                    id="celular"
                                    name="celular"
                                    value={formData.celular}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('celular')}
                                    onBlur={() => setFocusedField(null)}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all duration-300 placeholder:text-neutral-gray"
                                    placeholder="+591 70000000"
                                    required
                                />
                            </div>
                            <p className="text-xs text-neutral-gray mt-1.5">Número de contacto principal</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-4 pt-6 mt-2 border-t border-border-light dark:border-border-dark">
                            <Link
                                to="/admin/proveedores"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-[1.02]"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-blue-600 text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                Guardar Proveedor
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
