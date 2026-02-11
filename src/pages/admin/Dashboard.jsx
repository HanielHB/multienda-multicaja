import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config/api';

export default function Dashboard() {
    const [activeFilter, setActiveFilter] = useState('todo');
    const [isLoading, setIsLoading] = useState(true);
    const [sucursales, setSucursales] = useState([]);
    const [selectedSucursal, setSelectedSucursal] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // State for real data
    const [stats, setStats] = useState({
        ventas: 0,
        productosVendidos: 0,
        ganancias: 0,
        cambioVentas: 0,
        cambioProductos: 0,
        cambioGanancias: 0
    });
    const [movimientosCaja, setMovimientosCaja] = useState([]);
    const [topProductos, setTopProductos] = useState([]);
    const [topProductosMonto, setTopProductosMonto] = useState([]);
    const [ventasMensuales, setVentasMensuales] = useState([]);
    const [chartLabels, setChartLabels] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const filters = [
        { id: 'todo', label: 'Todo' },
        { id: '7dias', label: 'Últimos 7 días' },
        { id: '30dias', label: 'Últimos 30 días' },
        { id: '12meses', label: 'Últimos 12 meses' },
        { id: 'hoy', label: 'Hoy' },
        { id: 'porDia', label: 'Por Día' },
    ];

    // Fetch branches on mount
    useEffect(() => {
        fetchSucursales();
    }, []);

    // Fetch all dashboard data
    useEffect(() => {
        fetchDashboardData();
    }, [activeFilter, currentPage, selectedSucursal, selectedDate]);

    const getFilterParams = () => {
        const now = new Date();
        let fechaInicio = null;
        let fechaFin = now.toISOString().split('T')[0];

        switch (activeFilter) {
            case 'hoy':
                fechaInicio = fechaFin;
                break;
            case '7dias':
                const week = new Date(now);
                week.setDate(week.getDate() - 7);
                fechaInicio = week.toISOString().split('T')[0];
                break;
            case '30dias':
                const month = new Date(now);
                month.setDate(month.getDate() - 30);
                fechaInicio = month.toISOString().split('T')[0];
                break;
            case '12meses':
                const year = new Date(now);
                year.setFullYear(year.getFullYear() - 1);
                fechaInicio = year.toISOString().split('T')[0];
                break;
            case 'porDia':
                fechaInicio = selectedDate;
                fechaFin = selectedDate;
                break;
            default:
                // 'todo' - no filter
                break;
        }

        return { fechaInicio, fechaFin };
    };

    // Calculate previous period params for comparison
    const getPreviousPeriodParams = () => {
        const now = new Date();
        let fechaInicio = null;
        let fechaFin = null;

        switch (activeFilter) {
            case 'hoy': {
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                fechaInicio = yesterday.toISOString().split('T')[0];
                fechaFin = fechaInicio;
                break;
            }
            case '7dias': {
                const prevEnd = new Date(now);
                prevEnd.setDate(prevEnd.getDate() - 7);
                const prevStart = new Date(prevEnd);
                prevStart.setDate(prevStart.getDate() - 7);
                fechaInicio = prevStart.toISOString().split('T')[0];
                fechaFin = prevEnd.toISOString().split('T')[0];
                break;
            }
            case '30dias': {
                const prevEnd = new Date(now);
                prevEnd.setDate(prevEnd.getDate() - 30);
                const prevStart = new Date(prevEnd);
                prevStart.setDate(prevStart.getDate() - 30);
                fechaInicio = prevStart.toISOString().split('T')[0];
                fechaFin = prevEnd.toISOString().split('T')[0];
                break;
            }
            case '12meses': {
                const prevEnd = new Date(now);
                prevEnd.setFullYear(prevEnd.getFullYear() - 1);
                const prevStart = new Date(prevEnd);
                prevStart.setFullYear(prevStart.getFullYear() - 1);
                fechaInicio = prevStart.toISOString().split('T')[0];
                fechaFin = prevEnd.toISOString().split('T')[0];
                break;
            }
            case 'porDia': {
                const prevDay = new Date(selectedDate);
                prevDay.setDate(prevDay.getDate() - 1);
                fechaInicio = prevDay.toISOString().split('T')[0];
                fechaFin = fechaInicio;
                break;
            }
            default:
                // 'todo' - no previous period
                return null;
        }

        return { fechaInicio, fechaFin };
    };

    const fetchSucursales = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/sucursales`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSucursales(data.data || data || []);
            }
        } catch (err) {
            console.error('Error fetching sucursales:', err);
        }
    };

    const fetchDashboardData = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        const { fechaInicio, fechaFin } = getFilterParams();

        try {
            // Build query params
            let queryParams = '';
            const params = [];
            if (fechaInicio) {
                params.push(`fechaInicio=${fechaInicio}`);
                params.push(`fechaFin=${fechaFin}`);
            }
            if (selectedSucursal !== 'all') {
                params.push(`sucursalId=${selectedSucursal}`);
            }
            if (params.length > 0) {
                queryParams = `?${params.join('&')}`;
            }

            // Fetch ventas
            let ventasData = [];
            let totalVentas = 0;
            let totalProductosVendidos = 0;
            const productSales = {};

            try {
                const ventasRes = await fetch(`${API_URL}/ventas${queryParams}`, { headers });
                if (ventasRes.ok) {
                    const data = await ventasRes.json();
                    ventasData = data.data || data || [];

                    // If data is not an array, try to extract it
                    if (!Array.isArray(ventasData)) {
                        ventasData = [];
                    }

                    // Calculate totals from ventas
                    ventasData.forEach(venta => {
                        totalVentas += parseFloat(venta.total) || 0;

                        // Get items from venta
                        const items = venta.items || venta.detalles || venta.ventaItems || [];
                        items.forEach(item => {
                            const cantidad = parseInt(item.cantidad) || 1;
                            totalProductosVendidos += cantidad;

                            // Track product sales
                            const prodId = item.productoId || item.producto_id || item.id;
                            const prodNombre = item.nombre || item.producto?.nombre || `Producto ${prodId}`;
                            const subtotal = parseFloat(item.subtotal) || (parseFloat(item.precioUnitario || item.precio) * cantidad) || 0;

                            if (prodId) {
                                if (!productSales[prodId]) {
                                    productSales[prodId] = {
                                        id: prodId,
                                        nombre: prodNombre,
                                        cantidad: 0,
                                        monto: 0
                                    };
                                }
                                productSales[prodId].cantidad += cantidad;
                                productSales[prodId].monto += subtotal;
                            }
                        });
                    });
                }
            } catch (err) {
                console.error('Error fetching ventas:', err);
            }

            // Fetch previous period ventas for comparison
            let prevTotalVentas = 0;
            let prevTotalProductos = 0;
            const prevPeriod = getPreviousPeriodParams();
            if (prevPeriod) {
                try {
                    const prevParams = [];
                    prevParams.push(`fechaInicio=${prevPeriod.fechaInicio}`);
                    prevParams.push(`fechaFin=${prevPeriod.fechaFin}`);
                    if (selectedSucursal !== 'all') {
                        prevParams.push(`sucursalId=${selectedSucursal}`);
                    }
                    const prevQueryParams = `?${prevParams.join('&')}`;
                    const prevRes = await fetch(`${API_URL}/ventas${prevQueryParams}`, { headers });
                    if (prevRes.ok) {
                        const prevData = await prevRes.json();
                        let prevVentas = prevData.data || prevData || [];
                        if (!Array.isArray(prevVentas)) prevVentas = [];
                        prevVentas.forEach(venta => {
                            prevTotalVentas += parseFloat(venta.total) || 0;
                            const items = venta.items || venta.detalles || venta.ventaItems || [];
                            items.forEach(item => {
                                prevTotalProductos += parseInt(item.cantidad) || 1;
                            });
                        });
                    }
                } catch (err) {
                    console.error('Error fetching previous period:', err);
                }
            }

            // Fetch movimientos de caja (with date and sucursal filters)
            let movimientosData = [];
            try {
                const movParams = [`limit=10`, `page=${currentPage}`];
                if (fechaInicio) {
                    movParams.push(`fechaInicio=${fechaInicio}`);
                    movParams.push(`fechaFin=${fechaFin}`);
                }
                if (selectedSucursal !== 'all') {
                    movParams.push(`sucursalId=${selectedSucursal}`);
                }
                const movQueryParams = `?${movParams.join('&')}`;
                let movimientosRes = await fetch(`${API_URL}/movimientos-caja${movQueryParams}`, { headers });

                if (movimientosRes.ok) {
                    const data = await movimientosRes.json();

                    // Try different data structures
                    if (Array.isArray(data)) {
                        movimientosData = data;
                    } else if (data.data && Array.isArray(data.data)) {
                        movimientosData = data.data;
                    } else if (data.movimientos && Array.isArray(data.movimientos)) {
                        movimientosData = data.movimientos;
                    } else if (data.rows && Array.isArray(data.rows)) {
                        movimientosData = data.rows;
                    } else {
                        movimientosData = [];
                    }

                    setTotalPages(data.totalPages || data.meta?.totalPages || data.pagination?.totalPages || 1);
                }
            } catch (err) {
                console.error('Error fetching movimientos:', err);
            }

            // Sort by cantidad for top 5
            const sortedByCantidad = Object.values(productSales)
                .sort((a, b) => b.cantidad - a.cantidad)
                .slice(0, 5);

            // Sort by monto for top 10
            const sortedByMonto = Object.values(productSales)
                .sort((a, b) => b.monto - a.monto)
                .slice(0, 10);

            // Calculate percentages for monto chart
            const maxMonto = sortedByMonto.length > 0 ? sortedByMonto[0].monto : 1;
            const topMontoWithPercentage = sortedByMonto.map(p => ({
                ...p,
                porcentaje: Math.round((p.monto / maxMonto) * 100)
            }));

            // Build chart data based on active filter
            let chartData = [];
            let labels = [];

            if (activeFilter === 'hoy' || activeFilter === 'porDia') {
                // Group by hours (0-23)
                chartData = Array(24).fill(0);
                ventasData.forEach(venta => {
                    const fecha = new Date(venta.fecha || venta.createdAt || venta.created_at);
                    if (!isNaN(fecha.getTime())) {
                        const hour = fecha.getHours();
                        chartData[hour] += parseFloat(venta.total) || 0;
                    }
                });
                labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
            } else if (activeFilter === '7dias') {
                // Group by last 7 days
                const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
                chartData = Array(7).fill(0);
                labels = [];
                const now = new Date();
                for (let i = 6; i >= 0; i--) {
                    const d = new Date(now);
                    d.setDate(d.getDate() - i);
                    labels.push(diasSemana[d.getDay()]);
                }
                ventasData.forEach(venta => {
                    const fecha = new Date(venta.fecha || venta.createdAt || venta.created_at);
                    if (!isNaN(fecha.getTime())) {
                        const diffDays = Math.floor((now - fecha) / (1000 * 60 * 60 * 24));
                        if (diffDays >= 0 && diffDays < 7) {
                            chartData[6 - diffDays] += parseFloat(venta.total) || 0;
                        }
                    }
                });
            } else if (activeFilter === '30dias') {
                // Group by last 30 days
                chartData = Array(30).fill(0);
                labels = [];
                const now = new Date();
                for (let i = 29; i >= 0; i--) {
                    const d = new Date(now);
                    d.setDate(d.getDate() - i);
                    labels.push(`${d.getDate()}/${d.getMonth() + 1}`);
                }
                ventasData.forEach(venta => {
                    const fecha = new Date(venta.fecha || venta.createdAt || venta.created_at);
                    if (!isNaN(fecha.getTime())) {
                        const diffDays = Math.floor((now - fecha) / (1000 * 60 * 60 * 24));
                        if (diffDays >= 0 && diffDays < 30) {
                            chartData[29 - diffDays] += parseFloat(venta.total) || 0;
                        }
                    }
                });
            } else {
                // 'todo' and '12meses' - Group by months
                chartData = Array(12).fill(0);
                labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                ventasData.forEach(venta => {
                    const fecha = new Date(venta.fecha || venta.createdAt || venta.created_at);
                    if (!isNaN(fecha.getTime())) {
                        const month = fecha.getMonth();
                        chartData[month] += parseFloat(venta.total) || 0;
                    }
                });
            }

            // Normalize for chart display (0-100%)
            const maxVal = Math.max(...chartData, 1);
            const normalizedChart = chartData.map(val => Math.round((val / maxVal) * 100));

            // Format movimientos for display
            const formattedMovimientos = movimientosData.map(mov => {
                const tipo = mov.tipo || mov.tipoMovimiento || 'Movimiento';
                const isNegative = tipo.toUpperCase().includes('EGRESO') ||
                    tipo.toUpperCase().includes('RETIRO') ||
                    tipo.toUpperCase().includes('SALIDA');

                return {
                    id: mov.id,
                    fecha: new Date(mov.fecha || mov.createdAt || mov.created_at).toLocaleDateString('es-ES'),
                    caja: mov.caja?.nombre || mov.sesionCaja?.caja?.nombre || mov.cajaNombre || 'Caja',
                    tipo: tipo,
                    usuario: mov.usuario?.nombres || mov.usuario?.nombre || mov.usuario?.email || mov.usuarioNombre || 'Usuario',
                    monto: isNegative ? -(parseFloat(mov.monto) || 0) : (parseFloat(mov.monto) || 0)
                };
            });

            // Estimate ganancias (20% margin)
            const estimatedGanancias = totalVentas * 0.20;

            // Calculate period-over-period change
            const calcChange = (current, previous) => {
                if (previous === 0) return current > 0 ? 100 : 0;
                return Math.round(((current - previous) / previous) * 100);
            };
            const prevEstimatedGanancias = prevTotalVentas * 0.20;

            // Update state
            setStats({
                ventas: totalVentas,
                productosVendidos: totalProductosVendidos,
                ganancias: estimatedGanancias,
                cambioVentas: prevPeriod ? calcChange(totalVentas, prevTotalVentas) : 0,
                cambioProductos: prevPeriod ? calcChange(totalProductosVendidos, prevTotalProductos) : 0,
                cambioGanancias: prevPeriod ? calcChange(estimatedGanancias, prevEstimatedGanancias) : 0
            });
            setMovimientosCaja(formattedMovimientos);
            setTopProductos(sortedByCantidad);
            setTopProductosMonto(topMontoWithPercentage);
            setVentasMensuales(normalizedChart);
            setChartLabels(labels);

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 }).format(amount);
    };

    const handleClearFilter = () => {
        setActiveFilter('todo');
        setSelectedDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <div className="space-y-6">
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
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .page-animate { animation: fadeIn 0.4s ease-out; }
        .card-animate { animation: slideUp 0.5s ease-out backwards; }
        .stat-value { animation: countUp 0.6s ease-out backwards; }
        .skeleton { 
          background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .hover-lift { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 40px -10px rgba(0,0,0,0.15); }
        .filter-btn { transition: all 0.2s ease; }
        .filter-btn:hover { transform: translateY(-1px); }
        .filter-active { 
          background: white; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
        }
        .realtime-dot {
          animation: pulse 2s ease-in-out infinite;
        }
        .progress-bar {
          transition: width 1s ease-out;
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        .table-row {
          animation: slideIn 0.3s ease-out backwards;
        }
      `}</style>

            {/* Header */}
            <div className="flex flex-col gap-4 page-animate">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        Dashboard
                    </h1>

                    {/* Branch Selector */}
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sucursal:</label>
                        <select
                            value={selectedSucursal}
                            onChange={(e) => setSelectedSucursal(e.target.value)}
                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        >
                            <option value="all">Todas las Sucursales</option>
                            {sucursales.map((sucursal) => (
                                <option key={sucursal.id} value={sucursal.id}>
                                    {sucursal.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-gray-800 rounded-xl">
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeFilter === filter.id
                                ? 'filter-active text-gray-900 dark:text-white dark:bg-gray-700'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                    {activeFilter === 'porDia' && (
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                    )}
                    <button
                        onClick={handleClearFilter}
                        className="filter-btn px-4 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-all"
                    >
                        Limpiar filtro
                    </button>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Ventas Card */}
                <div
                    className="card-animate hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
                    style={{ animationDelay: '0.1s' }}
                >
                    <div className="flex items-start justify-between mb-4">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Ventas</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">Bs.</span>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="skeleton h-8 w-32 rounded-lg mb-2"></div>
                    ) : (
                        <p className="stat-value text-2xl font-black text-gray-900 dark:text-white" style={{ animationDelay: '0.3s' }}>
                            Bs. {formatCurrency(stats.ventas)}
                        </p>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                        <span className={`text-xs font-semibold ${stats.cambioVentas >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {stats.cambioVentas >= 0 ? '↑' : '↓'} {Math.abs(stats.cambioVentas)}%
                        </span>
                        <span className="text-xs text-gray-400">al periodo anterior</span>
                    </div>
                </div>

                {/* Productos Vendidos Card */}
                <div
                    className="card-animate hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
                    style={{ animationDelay: '0.2s' }}
                >
                    <div className="flex items-start justify-between mb-4">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Cant. Productos vendidos</span>
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">shopping_bag</span>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="skeleton h-8 w-24 rounded-lg mb-2"></div>
                    ) : (
                        <p className="stat-value text-2xl font-black text-gray-900 dark:text-white" style={{ animationDelay: '0.4s' }}>
                            {stats.productosVendidos}
                        </p>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                        <span className={`text-xs font-semibold ${stats.cambioProductos >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {stats.cambioProductos >= 0 ? '↑' : '↓'} {Math.abs(stats.cambioProductos)}%
                        </span>
                        <span className="text-xs text-gray-400">al periodo anterior</span>
                    </div>
                </div>

                {/* Ganancias Card */}
                <div
                    className="card-animate hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
                    style={{ animationDelay: '0.3s' }}
                >
                    <div className="flex items-start justify-between mb-4">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Ganancias (est.)</span>
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">trending_up</span>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="skeleton h-8 w-28 rounded-lg mb-2"></div>
                    ) : (
                        <p className="stat-value text-2xl font-black text-gray-900 dark:text-white" style={{ animationDelay: '0.5s' }}>
                            Bs. {formatCurrency(stats.ganancias)}
                        </p>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                        <span className={`text-xs font-semibold ${stats.cambioGanancias >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {stats.cambioGanancias >= 0 ? '↑' : '↓'} {Math.abs(stats.cambioGanancias)}%
                        </span>
                        <span className="text-xs text-gray-400">al periodo anterior</span>
                    </div>
                </div>

                {/* TOP 5 Products by Quantity Card */}
                <div
                    className="card-animate hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm row-span-2"
                    style={{ animationDelay: '0.4s' }}
                >
                    <h3 className="text-lg font-black text-gray-900 dark:text-white text-center mb-1">TOP 5</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">Productos por cantidad vendida</p>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-32">
                            <div className="skeleton w-16 h-16 rounded-xl mb-4"></div>
                            <div className="skeleton h-4 w-24 rounded-lg"></div>
                        </div>
                    ) : topProductos.length > 0 ? (
                        <div className="space-y-3">
                            {topProductos.map((producto, index) => (
                                <div
                                    key={producto.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                                        index === 1 ? 'bg-gray-400' :
                                            index === 2 ? 'bg-amber-600' : 'bg-gray-300 text-gray-600'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{producto.nombre}</p>
                                        <p className="text-xs text-gray-400">{producto.cantidad} unidades</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                            <div className="float-animation">
                                <span className="material-symbols-outlined text-5xl mb-2">inventory_2</span>
                            </div>
                            <p className="text-sm">Sin datos de ventas</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Total Ventas Chart Card */}
            <div className="grid grid-cols-1 gap-4">
                <div
                    className="card-animate hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
                    style={{ animationDelay: '0.5s' }}
                >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Total ventas</h3>
                    {isLoading ? (
                        <div className="skeleton h-12 w-40 rounded-lg mb-4"></div>
                    ) : (
                        <p className="stat-value text-4xl font-black text-gray-900 dark:text-white mb-2" style={{ animationDelay: '0.6s' }}>
                            Bs. {formatCurrency(stats.ventas)}
                        </p>
                    )}
                    <div className="flex items-center gap-2 mb-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stats.cambioVentas >= 0
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            {stats.cambioVentas >= 0 ? '+' : ''}{stats.cambioVentas}% al periodo anterior
                        </span>
                    </div>

                    {/* Simple Chart Visualization */}
                    <div className="h-32 flex items-end gap-[2px] sm:gap-1 lg:gap-2">
                        {ventasMensuales.map((height, index) => (
                            <div
                                key={index}
                                className="flex-1 bg-gradient-to-t from-primary/80 to-primary/40 rounded-t-lg transition-all duration-500 hover:from-primary hover:to-primary/60 min-w-[3px]"
                                style={{
                                    height: `${Math.max(height, 5)}%`,
                                    animationDelay: `${0.7 + index * 0.02}s`
                                }}
                            ></div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] sm:text-xs text-gray-400 overflow-x-auto">
                        {chartLabels.map((label, i) => (
                            <span key={i} className="flex-shrink-0">{label}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Movimientos de Caja */}
                <div
                    className="card-animate hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
                    style={{ animationDelay: '0.7s' }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Movimientos de caja</h3>
                        <div className="flex items-center gap-2">
                            <span className="realtime-dot w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-xs text-gray-400">realtime</span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-700">
                                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Fecha ↕
                                    </th>
                                    <th className="hidden sm:table-cell text-left py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Caja ↕
                                    </th>
                                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Tipo ↕
                                    </th>
                                    <th className="hidden md:table-cell text-left py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Usuario ↕
                                    </th>
                                    <th className="text-right py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Monto ↕
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center">
                                            <div className="skeleton h-4 w-full rounded mb-2"></div>
                                            <div className="skeleton h-4 w-full rounded mb-2"></div>
                                            <div className="skeleton h-4 w-full rounded"></div>
                                        </td>
                                    </tr>
                                ) : movimientosCaja.length > 0 ? (
                                    movimientosCaja.map((mov, index) => (
                                        <tr
                                            key={mov.id || index}
                                            className="table-row border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                            style={{ animationDelay: `${0.8 + index * 0.05}s` }}
                                        >
                                            <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-300">{mov.fecha}</td>
                                            <td className="hidden sm:table-cell py-3 px-2 text-sm text-gray-600 dark:text-gray-300">{mov.caja}</td>
                                            <td className="py-3 px-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${mov.tipo.toUpperCase().includes('INGRESO') || mov.tipo.toUpperCase().includes('APERTURA')
                                                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    mov.tipo.toUpperCase().includes('EGRESO') || mov.tipo.toUpperCase().includes('RETIRO') || mov.tipo.toUpperCase().includes('CIERRE')
                                                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                                                        'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                    }`}>
                                                    {mov.tipo}
                                                </span>
                                            </td>
                                            <td className="hidden md:table-cell py-3 px-2 text-sm text-gray-600 dark:text-gray-300">{mov.usuario}</td>
                                            <td className={`py-3 px-2 text-sm font-semibold text-right ${mov.monto >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {mov.monto >= 0 ? '+' : ''}Bs. {formatCurrency(Math.abs(mov.monto))}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-gray-400">
                                            <span className="material-symbols-outlined text-4xl mb-2 block">receipt_long</span>
                                            No hay movimientos registrados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            <span className="text-sm text-gray-500">{currentPage} de {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* TOP 10 Productos por Monto */}
                <div
                    className="card-animate hover-lift bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
                    style={{ animationDelay: '0.8s' }}
                >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">TOP 10 (productos por monto)</h3>

                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="skeleton w-8 h-8 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="skeleton h-4 w-32 rounded mb-2"></div>
                                        <div className="skeleton h-2 w-full rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : topProductosMonto.length > 0 ? (
                        <div className="space-y-4">
                            {topProductosMonto.map((producto, index) => (
                                <div
                                    key={producto.id}
                                    className="group"
                                    style={{ animationDelay: `${0.9 + index * 0.1}s` }}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${index === 0 ? 'bg-yellow-500' :
                                                index === 1 ? 'bg-gray-400' :
                                                    index === 2 ? 'bg-amber-600' : 'bg-gray-300 text-gray-600'
                                                }`}>
                                                {index + 1}
                                            </div>
                                            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                                {producto.nombre}
                                            </span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                            Bs. {formatCurrency(producto.monto)}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="progress-bar h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
                                            style={{ width: `${producto.porcentaje}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <div className="float-animation">
                                <span className="material-symbols-outlined text-6xl mb-3">inventory_2</span>
                            </div>
                            <p className="text-sm">Sin datos de ventas</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
