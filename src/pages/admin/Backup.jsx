import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config/api';

export default function Backup() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(null);
    const [error, setError] = useState('');

    const tablasDisponibles = [
        { id: 'productos', nombre: 'Productos', icon: 'inventory_2', color: 'bg-blue-500' },
        { id: 'ventas', nombre: 'Ventas', icon: 'point_of_sale', color: 'bg-emerald-500' },
        { id: 'clientes', nombre: 'Clientes', icon: 'group', color: 'bg-purple-500' },
        { id: 'inventario', nombre: 'Inventario', icon: 'warehouse', color: 'bg-amber-500' },
        { id: 'usuarios', nombre: 'Usuarios', icon: 'manage_accounts', color: 'bg-rose-500' },
        { id: 'proveedores', nombre: 'Proveedores', icon: 'local_shipping', color: 'bg-cyan-500' },
    ];

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/backup/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Error obteniendo estadísticas');
            }

            const data = await response.json();
            setStats(data);
        } catch (err) {
            setError('No se pudieron cargar las estadísticas. Verifica que tengas permisos de administrador.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const descargarBackup = async (tabla = null) => {
        const tablaId = tabla || 'completo';
        setDownloading(tablaId);
        setError('');

        const url = tabla
            ? `${API_URL}/backup/excel/${tabla}`
            : `${API_URL}/backup/excel`;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error descargando archivo');
            }

            // Obtener el nombre del archivo del header
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
                : `backup_${tabla || 'completo'}_${new Date().toISOString().split('T')[0]}.xlsx`;

            // Crear blob y descargar
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            setError(err.message || 'Error descargando el backup');
            console.error('Error:', err);
        } finally {
            setDownloading(null);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Backup de Datos
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Exporta los datos de tu sistema a Excel
                    </p>
                </div>
                <button
                    onClick={cargarEstadisticas}
                    disabled={loading}
                    className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    <span className={`material-symbols-outlined text-[20px] ${loading ? 'animate-spin' : ''}`}>
                        {loading ? 'progress_activity' : 'refresh'}
                    </span>
                    Actualizar
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-500">error</span>
                    <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                </div>
            )}

            {/* Backup Completo Card */}
            <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">cloud_download</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Backup Completo</h2>
                            <p className="text-blue-100 text-sm">
                                Descarga todas las tablas en un solo archivo Excel
                            </p>
                            {stats && (
                                <p className="text-blue-200 text-xs mt-1">
                                    {stats.totalRegistros?.toLocaleString()} registros totales
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => descargarBackup()}
                        disabled={downloading === 'completo'}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-all disabled:opacity-70"
                    >
                        {downloading === 'completo' ? (
                            <>
                                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                                Descargando...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[20px]">download</span>
                                Descargar Todo
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Estadísticas */}
            {stats && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">analytics</span>
                        Estadísticas de Datos
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {stats.tablas && Object.entries(stats.tablas).map(([tabla, count]) => (
                            <div key={tabla} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {tabla}
                                </p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    {count?.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Exportar por Tabla */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">table_chart</span>
                    Exportar por Tabla
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    Descarga tablas individuales en archivos Excel separados
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {tablasDisponibles.map((tabla) => (
                        <button
                            key={tabla.id}
                            onClick={() => descargarBackup(tabla.id)}
                            disabled={downloading === tabla.id}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all hover:shadow-lg group disabled:opacity-70`}
                        >
                            <div className={`w-12 h-12 rounded-xl ${tabla.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                {downloading === tabla.id ? (
                                    <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined text-xl">{tabla.icon}</span>
                                )}
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {tabla.nombre}
                            </span>
                            {stats?.tablas?.[tabla.id] !== undefined && (
                                <span className="text-xs text-gray-400">
                                    {stats.tablas[tabla.id]?.toLocaleString()} reg.
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-blue-500 mt-0.5">info</span>
                    <div>
                        <p className="text-blue-800 dark:text-blue-300 font-medium">Información</p>
                        <ul className="text-blue-700 dark:text-blue-400 text-sm mt-1 space-y-1">
                            <li>• Los archivos se descargan en formato Excel (.xlsx)</li>
                            <li>• El backup completo incluye todas las tablas en hojas separadas</li>
                            <li>• Los datos sensibles como contraseñas no se exportan</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
