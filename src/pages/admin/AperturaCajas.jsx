import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = '/api';

export default function AperturaCajas() {
    const navigate = useNavigate();
    const [selectedCaja, setSelectedCaja] = useState(null);
    const [montoInicial, setMontoInicial] = useState('0.00');
    const [cajas, setCajas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('error'); // 'error' | 'warning' | 'info'

    useEffect(() => {
        fetchCajas();
    }, []);

    const fetchCajas = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/cajas`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCajas(data.data || data || []);
            } else {
                setError('Error al cargar las cajas');
            }
        } catch (err) {
            console.error('Error fetching cajas:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApertura = async (cajaId) => {
        const monto = parseFloat(montoInicial) || 0;

        // Validar que el monto sea mayor a 0
        if (monto <= 0) {
            setModalMessage('Debe ingresar un monto mayor a 0 para aperturar la caja. Si desea aperturar sin monto, use el botón "OMITIR".');
            setModalType('warning');
            setShowModal(true);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const usuarioId = user.id;

            const response = await fetch(`${API_URL}/cajas/${cajaId}/abrir`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ montoInicial: monto, usuarioId })
            });

            if (response.ok) {
                // Save selected caja ID for the POS
                localStorage.setItem('cajaActiva', cajaId);
                navigate('/admin/punto-venta');
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message || errorData.error || 'No se pudo abrir la caja');
                setModalType('error');
                setShowModal(true);
            }
        } catch (err) {
            console.error('Error:', err);
            setModalMessage('Error al aperturar la caja');
            setModalType('error');
            setShowModal(true);
        }
    };

    const handleOmitir = async (cajaId) => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const usuarioId = user.id;

            const response = await fetch(`${API_URL}/cajas/${cajaId}/abrir`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ montoInicial: 0, usuarioId })
            });

            if (response.ok) {
                localStorage.setItem('cajaActiva', cajaId);
                navigate('/admin/punto-venta');
            } else {
                const errorData = await response.json();
                setModalMessage(errorData.message || errorData.error || 'No se pudo abrir la caja');
                setModalType('error');
                setShowModal(true);
            }
        } catch (err) {
            console.error('Error:', err);
            setModalMessage('Error al aperturar la caja');
            setModalType('error');
            setShowModal(true);
        }
    };

    // Map API estado to display status
    const getEstadoDisplay = (estado) => {
        const estadoUpper = estado?.toUpperCase();
        if (estadoUpper === 'CERRADA' || estadoUpper === 'LIBRE') return 'LIBRE';
        if (estadoUpper === 'ABIERTA' || estadoUpper === 'OCUPADA') return 'OCUPADA';
        return estado;
    };

    const isLibre = (caja) => {
        const estado = caja.estado?.toUpperCase();
        return estado === 'CERRADA' || estado === 'LIBRE';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

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

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 text-center">
                    {error}
                </div>
            )}

            {/* Empty State */}
            {cajas.length === 0 && !error && (
                <div className="text-center py-12">
                    <span className="material-symbols-outlined text-6xl text-neutral-gray mb-4 block">point_of_sale</span>
                    <p className="text-neutral-gray text-lg">No hay cajas registradas</p>
                </div>
            )}

            {/* Cash Registers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cajas.map((caja, index) => (
                    <div
                        key={caja.id}
                        className={`card-animate bg-white dark:bg-background-dark rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${isLibre(caja)
                            ? 'border-emerald-200 dark:border-emerald-800 hover-lift cursor-pointer'
                            : 'border-border-light dark:border-border-dark opacity-60 cursor-not-allowed'
                            }`}
                        style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                    >
                        {/* Card Header */}
                        <div className="px-6 pt-5 pb-4">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className={`text-lg font-bold tracking-tight ${isLibre(caja)
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-gray-400 dark:text-gray-500'
                                    }`}>
                                    {caja.nombre} <span className="font-normal">({getEstadoDisplay(caja.estado)})</span>
                                </h3>
                                {isLibre(caja) && (
                                    <div className="flex items-center gap-1.5 status-pulse">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Disponible</span>
                                    </div>
                                )}
                                {!isLibre(caja) && (
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                        <span className="text-xs font-medium text-red-600 dark:text-red-400">En uso</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-neutral-gray dark:text-gray-400">
                                Sucursal: <span className="font-medium text-gray-700 dark:text-gray-300">{caja.sucursal?.nombre || 'N/A'}</span>
                            </p>
                        </div>

                        {/* Form Section - Only for available cash registers */}
                        {isLibre(caja) && (
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
                        {!isLibre(caja) && (
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

            {/* Modal de mensajes */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-[scaleIn_0.2s_ease-out]">
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${modalType === 'error' ? 'bg-red-100 dark:bg-red-900/30' :
                                    modalType === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' :
                                        'bg-blue-100 dark:bg-blue-900/30'
                                }`}>
                                <span className={`material-symbols-outlined text-3xl ${modalType === 'error' ? 'text-red-500' :
                                        modalType === 'warning' ? 'text-amber-500' :
                                            'text-blue-500'
                                    }`}>
                                    {modalType === 'error' ? 'error' :
                                        modalType === 'warning' ? 'warning' : 'info'}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                {modalType === 'error' ? 'Error' :
                                    modalType === 'warning' ? 'Atención' : 'Información'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">{modalMessage}</p>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-bold hover:from-primary/90 hover:to-blue-700 transition-all"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
