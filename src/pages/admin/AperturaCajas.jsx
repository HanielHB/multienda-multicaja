import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AperturaCajas() {
    const navigate = useNavigate();
    const [selectedCaja, setSelectedCaja] = useState(null);
    const [montoInicial, setMontoInicial] = useState('0.00');

    // Sample cash registers data
    const cajas = [
        {
            id: 1,
            nombre: 'CAJA PRINCIPAL',
            sucursal: 'Generica',
            estado: 'LIBRE',
            ultimoUsuario: null
        },
        {
            id: 2,
            nombre: 'CAJA 1',
            sucursal: 'Generica',
            estado: 'LIBRE',
            ultimoUsuario: null
        },
        {
            id: 3,
            nombre: 'CAJA 2',
            sucursal: 'Centro',
            estado: 'OCUPADA',
            ultimoUsuario: 'vendedor1'
        },
        {
            id: 4,
            nombre: 'CAJA SECUNDARIA',
            sucursal: 'Norte',
            estado: 'LIBRE',
            ultimoUsuario: null
        }
    ];

    const handleApertura = (cajaId) => {
        console.log('Aperturando caja:', cajaId, 'con monto:', montoInicial);
        // Navigate to POS
        navigate('/admin/punto-venta');
    };

    const handleOmitir = (cajaId) => {
        console.log('Aperturando caja sin monto:', cajaId);
        // Navigate to POS without initial amount
        navigate('/admin/punto-venta');
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {/* CSS Animations */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.5); }
        }
        .card-animate { animation: slideUp 0.4s ease-out; }
        .card-animate:nth-child(2) { animation-delay: 0.1s; }
        .card-animate:nth-child(3) { animation-delay: 0.2s; }
        .card-animate:nth-child(4) { animation-delay: 0.3s; }
        .input-animated { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .input-animated:focus { transform: scale(1.02); box-shadow: 0 0 0 3px rgba(19, 91, 236, 0.1); }
        .btn-bounce:active { transform: scale(0.97); }
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 40px -10px rgba(0,0,0,0.15); }
        .libre-glow { animation: glow 2s ease-in-out infinite; }
        .status-pulse { animation: pulse 2s ease-in-out infinite; }
      `}</style>

            {/* Header Section */}
            <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 text-neutral-gray mb-2">
                    <Link className="text-sm hover:text-primary transition-colors" to="/admin">Administración</Link>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Apertura de Cajas</span>
                </div>
                <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                    Seleccione una caja a aperturar
                </h1>
                <p className="text-neutral-gray dark:text-gray-400 mt-2">
                    Elija la caja que desea abrir para comenzar a operar
                </p>
            </div>

            {/* Cash Registers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cajas.map((caja, index) => (
                    <div
                        key={caja.id}
                        className={`card-animate bg-white dark:bg-background-dark rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${caja.estado === 'LIBRE'
                            ? 'border-emerald-200 dark:border-emerald-800 hover-lift cursor-pointer'
                            : 'border-border-light dark:border-border-dark opacity-60 cursor-not-allowed'
                            }`}
                        style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                    >
                        {/* Card Header */}
                        <div className="px-6 pt-5 pb-4">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className={`text-lg font-bold tracking-tight ${caja.estado === 'LIBRE'
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-gray-400 dark:text-gray-500'
                                    }`}>
                                    {caja.nombre} <span className="font-normal">({caja.estado})</span>
                                </h3>
                                {caja.estado === 'LIBRE' && (
                                    <div className="flex items-center gap-1.5 status-pulse">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Disponible</span>
                                    </div>
                                )}
                                {caja.estado === 'OCUPADA' && (
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                        <span className="text-xs font-medium text-red-600 dark:text-red-400">En uso</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-neutral-gray dark:text-gray-400">
                                Sucursal: <span className="font-medium text-gray-700 dark:text-gray-300">{caja.sucursal}</span>
                            </p>
                            {caja.estado === 'OCUPADA' && caja.ultimoUsuario && (
                                <p className="text-xs text-neutral-gray mt-1">
                                    Usuario: <span className="font-medium">{caja.ultimoUsuario}</span>
                                </p>
                            )}
                        </div>

                        {/* Form Section - Only for available cash registers */}
                        {caja.estado === 'LIBRE' && (
                            <div className="px-6 pb-6 border-t border-border-light dark:border-border-dark pt-4">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Aperturar caja con:
                                </label>
                                <div className="relative mb-4">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-gray font-medium">Bs.</span>
                                    <input
                                        type="text"
                                        value={selectedCaja === caja.id ? montoInicial : '0.00'}
                                        onChange={(e) => {
                                            setSelectedCaja(caja.id);
                                            setMontoInicial(e.target.value);
                                        }}
                                        onFocus={() => setSelectedCaja(caja.id)}
                                        className="input-animated w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary text-base font-medium"
                                        placeholder="0.00"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleOmitir(caja.id)}
                                        className="flex-1 px-4 py-3 rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-sm uppercase tracking-wide hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 btn-bounce"
                                    >
                                        Omitir
                                    </button>
                                    <button
                                        onClick={() => handleApertura(caja.id)}
                                        className="flex-1 px-4 py-3 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm uppercase tracking-wide hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-gray-900/20 hover:shadow-gray-900/40 btn-bounce"
                                    >
                                        Aperturar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Locked Message for occupied registers */}
                        {caja.estado === 'OCUPADA' && (
                            <div className="px-6 pb-6 border-t border-border-light dark:border-border-dark pt-4">
                                <div className="flex items-center gap-2 text-neutral-gray">
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                    <span className="text-sm">Esta caja se encuentra en uso</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Help Text */}
            <div className="text-center mt-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="material-symbols-outlined text-primary text-[20px]">info</span>
                    <span className="text-sm text-primary dark:text-blue-400">
                        Puede aperturar la caja sin monto inicial haciendo clic en "Omitir"
                    </span>
                </div>
            </div>
        </div>
    );
}
