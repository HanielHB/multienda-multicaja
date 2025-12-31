import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Usuarios() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        contrasena: '',
        nombres: '',
        nroDoc: '',
        telefono: '',
        sucursal: '',
        tipo: 'cajero',
        permisos: []
    });
    const [focusedField, setFocusedField] = useState(null);

    // Sample users data
    const usuarios = [
        {
            id: 1,
            usuario: 'admin',
            email: 'admin@zapateria.com',
            sucursal: 'GENERICA',
            caja: 'Caja Principal',
            rol: 'Administrador',
            estado: true,
            colorClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        },
        {
            id: 2,
            usuario: 'vendedor1',
            email: 'vendedor1@zapateria.com',
            sucursal: 'CENTRO',
            caja: 'Caja 1',
            rol: 'Vendedor',
            estado: true,
            colorClass: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
        },
        {
            id: 3,
            usuario: 'vendedor2',
            email: 'vendedor2@zapateria.com',
            sucursal: 'CENTRO',
            caja: 'Caja 2',
            rol: 'Vendedor',
            estado: false,
            colorClass: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
        },
        {
            id: 4,
            usuario: 'cajero1',
            email: 'cajero1@zapateria.com',
            sucursal: 'NORTE',
            caja: 'Caja Principal',
            rol: 'Cajero',
            estado: true,
            colorClass: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
        },
        {
            id: 5,
            usuario: 'supervisor',
            email: 'supervisor@zapateria.com',
            sucursal: 'GENERICA',
            caja: '-',
            rol: 'Supervisor',
            estado: true,
            colorClass: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
        },
    ];

    const sucursales = ['Generica', 'Centro', 'Norte', 'Sur'];
    const tipos = ['cajero', 'vendedor', 'supervisor', 'administrador'];

    const permisosDisponibles = [
        'Ventas',
        'Configuracion',
        'Cobrar venta',
        'Impresoras',
        'Empresa',
        'Categorias de productos',
        'Productos',
        'Clientes',
        'Proveedores',
        'Métodos de pago',
        'Sucursales y cajas',
        'Usuarios',
        'Empresa basicos',
        'Empresa moneda',
        'Almacenes',
        'Dashboard',
        'Inventarios',
        'Configuración de ticket',
        'Serialización de comprobantes'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePermisoChange = (permiso) => {
        setFormData(prev => ({
            ...prev,
            permisos: prev.permisos.includes(permiso)
                ? prev.permisos.filter(p => p !== permiso)
                : [...prev.permisos, permiso]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Usuario data:', formData);
        setIsModalOpen(false);
        setFormData({ email: '', contrasena: '', nombres: '', nroDoc: '', telefono: '', sucursal: '', tipo: 'cajero', permisos: [] });
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ email: '', contrasena: '', nombres: '', nroDoc: '', telefono: '', sucursal: '', tipo: 'cajero', permisos: [] });
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
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Usuarios</span>
                    </div>
                    <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Lista de Usuarios</h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={openModal}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] btn-bounce"
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
                            placeholder="...buscar"
                            type="text"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background-light dark:bg-gray-900/50 border-b border-border-light dark:border-border-dark text-xs uppercase text-neutral-gray font-semibold tracking-wide">
                                <th className="p-4 pl-6">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                                        Usuario
                                        <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                                        Email
                                        <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                                        Sucursal
                                        <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                                        Caja
                                        <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                                        Rol
                                        <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4">
                                    <div className="flex items-center gap-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                                        Estado
                                        <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                                    </div>
                                </th>
                                <th className="p-4 pr-6 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id} className="hover:bg-background-light dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${usuario.colorClass}`}>
                                                <span className="material-symbols-outlined text-[18px]">person</span>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{usuario.usuario}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-neutral-gray dark:text-gray-400">{usuario.email}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{usuario.sucursal}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-neutral-gray dark:text-gray-400">{usuario.caja}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${usuario.rol === 'Administrador' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                            usuario.rol === 'Supervisor' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                                                usuario.rol === 'Vendedor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                            }`}>
                                            {usuario.rol}
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
                        Mostrando <span className="font-medium text-gray-900 dark:text-white">1-5</span> de <span className="font-medium text-gray-900 dark:text-white">12</span> usuarios
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

            {/* Modal Flotante - Registrar Usuario */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    <div className="modal-content relative w-full max-w-4xl bg-white dark:bg-background-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden">
                        {/* Modal Header */}
                        <div className="relative px-6 py-5 border-b border-border-light dark:border-border-dark text-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Registrar usuario</h2>
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column - User Info */}
                                <div className="flex flex-col gap-4">
                                    {/* Email */}
                                    <div className="flex items-center gap-3 border-b border-border-light dark:border-border-dark pb-3">
                                        <span className="material-symbols-outlined text-neutral-gray text-[20px]">mail</span>
                                        <div className="flex-1">
                                            <label className="block text-xs text-neutral-gray mb-1">email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-transparent border-none p-0 text-sm text-gray-900 dark:text-white focus:ring-0 placeholder:text-neutral-gray"
                                                placeholder="correo@ejemplo.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Contraseña */}
                                    <div className="flex items-center gap-3 border-b border-border-light dark:border-border-dark pb-3">
                                        <span className="material-symbols-outlined text-neutral-gray text-[20px]">mail</span>
                                        <div className="flex-1">
                                            <label className="block text-xs text-neutral-gray mb-1">contraseña</label>
                                            <input
                                                type="password"
                                                name="contrasena"
                                                value={formData.contrasena}
                                                onChange={handleChange}
                                                className="w-full bg-transparent border-none p-0 text-sm text-gray-900 dark:text-white focus:ring-0"
                                                placeholder="••••••"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Nombres */}
                                    <div className="flex items-center gap-3 border-b border-border-light dark:border-border-dark pb-3">
                                        <span className="material-symbols-outlined text-neutral-gray text-[20px]">person</span>
                                        <div className="flex-1">
                                            <label className="block text-xs text-neutral-gray mb-1">Nombres</label>
                                            <input
                                                type="text"
                                                name="nombres"
                                                value={formData.nombres}
                                                onChange={handleChange}
                                                className="w-full bg-transparent border-none p-0 text-sm text-gray-900 dark:text-white focus:ring-0 placeholder:text-neutral-gray"
                                                placeholder="Nombre completo"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Nro. doc */}
                                    <div className="flex items-center gap-3 border-b border-border-light dark:border-border-dark pb-3">
                                        <span className="material-symbols-outlined text-neutral-gray text-[20px]">badge</span>
                                        <div className="flex-1">
                                            <label className="block text-xs text-neutral-gray mb-1">Nro. doc</label>
                                            <input
                                                type="text"
                                                name="nroDoc"
                                                value={formData.nroDoc}
                                                onChange={handleChange}
                                                className="w-full bg-transparent border-none p-0 text-sm text-gray-900 dark:text-white focus:ring-0 placeholder:text-neutral-gray"
                                                placeholder="12345678"
                                            />
                                        </div>
                                    </div>

                                    {/* Teléfono */}
                                    <div className="flex items-center gap-3 border-b border-border-light dark:border-border-dark pb-3">
                                        <span className="material-symbols-outlined text-neutral-gray text-[20px]">badge</span>
                                        <div className="flex-1">
                                            <label className="block text-xs text-neutral-gray mb-1">Teléfono</label>
                                            <input
                                                type="tel"
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handleChange}
                                                className="w-full bg-transparent border-none p-0 text-sm text-gray-900 dark:text-white focus:ring-0 placeholder:text-neutral-gray"
                                                placeholder="+591 70000000"
                                            />
                                        </div>
                                    </div>

                                    {/* Asignación de sucursal */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Asignación de sucursal</label>
                                        <div>
                                            <label className="block text-xs text-neutral-gray mb-1">Sucursal:</label>
                                            <select
                                                name="sucursal"
                                                value={formData.sucursal}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary text-sm"
                                                required
                                            >
                                                <option value="">Seleccionar...</option>
                                                {sucursales.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Guardar Button */}
                                    <div className="mt-6">
                                        <button
                                            type="submit"
                                            className="w-full px-6 py-3 rounded-full bg-primary text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] btn-bounce"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </div>

                                {/* Right Column - Permisos */}
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">permisos</h3>

                                    {/* Tipo selector */}
                                    <div className="mb-4">
                                        <label className="block text-xs text-neutral-gray mb-1">Tipo:</label>
                                        <select
                                            name="tipo"
                                            value={formData.tipo}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary text-sm"
                                        >
                                            {tipos.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>

                                    {/* Permisos checkboxes */}
                                    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2">
                                        {permisosDisponibles.map((permiso) => (
                                            <label key={permiso} className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.permisos.includes(permiso)}
                                                        onChange={() => handlePermisoChange(permiso)}
                                                        className="peer sr-only"
                                                    />
                                                    <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${formData.permisos.includes(permiso)
                                                            ? 'bg-gray-800 border-gray-800 dark:bg-white dark:border-white'
                                                            : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'
                                                        }`}>
                                                        {formData.permisos.includes(permiso) && (
                                                            <span className="material-symbols-outlined text-white dark:text-gray-800 text-[16px]">check</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{permiso}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
