import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MetodosPago() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });
    const [focusedField, setFocusedField] = useState(null);

    // Sample payment methods data
    const metodosPago = [
        {
            id: 1,
            nombre: 'Efectivo',
            descripcion: 'Pagos realizados en moneda local en el mostrador.',
            icon: 'payments',
            colorClass: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
        },
        {
            id: 2,
            nombre: 'Tarjeta de Crédito',
            descripcion: 'Visa, MasterCard, American Express. Procesado vía terminal POS.',
            icon: 'credit_card',
            colorClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        },
        {
            id: 3,
            nombre: 'Tarjeta de Débito',
            descripcion: 'Redcompra y tarjetas de débito bancarias nacionales.',
            icon: 'atm',
            colorClass: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
        },
        {
            id: 4,
            nombre: 'Transferencia QR',
            descripcion: 'Pagos rápidos mediante escaneo de código QR desde apps bancarias.',
            icon: 'qr_code_scanner',
            colorClass: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
        },
        {
            id: 5,
            nombre: 'Gift Card',
            descripcion: 'Tarjetas de regalo emitidas por la tienda, canjeables por productos.',
            icon: 'card_giftcard',
            colorClass: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
        },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Método de pago:', formData);
        setIsModalOpen(false);
        setFormData({ nombre: '', descripcion: '' });
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ nombre: '', descripcion: '' });
    };

    return (
        <div className="flex flex-col gap-6">
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
        .modal-backdrop { animation: fadeIn 0.2s ease-out; }
        .modal-content { animation: slideUp 0.3s ease-out; }
        .input-animated { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .input-animated:focus { transform: scale(1.01); }
        .btn-bounce:active { transform: scale(0.97); }
      `}</style>

            {/* Header Section */}
            <div className="flex flex-wrap justify-between gap-3 items-center">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-neutral-gray mb-1">
                        <Link className="text-sm hover:text-primary transition-colors" to="/admin">Administración</Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Métodos de Pago</span>
                    </div>
                    <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Lista de Métodos de Pago</h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={openModal}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] btn-bounce"
                    >
                        <span className="material-symbols-outlined text-[20px]">add_card</span>
                        Nuevo Método
                    </button>
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
                            placeholder="Buscar método de pago..."
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
                                <th className="p-4 pl-6 w-1/3">Nombre</th>
                                <th className="p-4 w-1/2">Descripción</th>
                                <th className="p-4 pr-6 text-right w-40">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {metodosPago.map((metodo) => (
                                <tr key={metodo.id} className="hover:bg-background-light dark:hover:bg-gray-800/50 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${metodo.colorClass} overflow-hidden`}>
                                                <span className="material-symbols-outlined">{metodo.icon}</span>
                                            </div>
                                            <div className="text-sm font-bold text-gray-900 dark:text-white">{metodo.nombre}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-neutral-gray dark:text-gray-400">{metodo.descripcion}</span>
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
                        Mostrando <span className="font-medium text-gray-900 dark:text-white">1-5</span> de <span className="font-medium text-gray-900 dark:text-white">8</span> métodos
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

            {/* Modal Flotante */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    {/* Modal Content */}
                    <div className="modal-content relative w-full max-w-lg bg-white dark:bg-background-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden">
                        {/* Modal Header */}
                        <div className="relative px-6 py-5 border-b border-border-light dark:border-border-dark bg-gradient-to-r from-primary/5 to-blue-500/5 dark:from-primary/10 dark:to-blue-500/10">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/30">
                                    <span className="material-symbols-outlined text-2xl">add_card</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nuevo Método de Pago</h2>
                                    <p className="text-sm text-neutral-gray">Registra una nueva forma de pago</p>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="flex flex-col gap-5">
                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="nombre">
                                        Nombre del Método <span className="text-destructive-red">*</span>
                                    </label>
                                    <div className={`relative transition-all duration-300 ${focusedField === 'nombre' ? 'scale-[1.01]' : ''}`}>
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-gray material-symbols-outlined text-[20px]">
                                            payments
                                        </span>
                                        <input
                                            type="text"
                                            id="nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('nombre')}
                                            onBlur={() => setFocusedField(null)}
                                            className="input-animated w-full pl-12 pr-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-neutral-gray"
                                            placeholder="Ej. Efectivo, Tarjeta de Crédito, QR..."
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Descripción */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="descripcion">
                                        Descripción <span className="text-destructive-red">*</span>
                                    </label>
                                    <div className={`relative transition-all duration-300 ${focusedField === 'descripcion' ? 'scale-[1.01]' : ''}`}>
                                        <textarea
                                            id="descripcion"
                                            name="descripcion"
                                            value={formData.descripcion}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('descripcion')}
                                            onBlur={() => setFocusedField(null)}
                                            rows="3"
                                            className="input-animated w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-neutral-gray resize-none"
                                            placeholder="Describe brevemente este método de pago..."
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-border-light dark:border-border-dark">
                                <button
                                    type="button"
                                    onClick={closeModal}
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
        </div>
    );
}
