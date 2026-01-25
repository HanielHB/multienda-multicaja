import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = '/api';

export default function PuntoVenta() {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [searchCode, setSearchCode] = useState('');
    const [searchProduct, setSearchProduct] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showIngresoModal, setShowIngresoModal] = useState(false);
    const [showRetiroModal, setShowRetiroModal] = useState(false);
    const [tipoDocumento, setTipoDocumento] = useState('factura');
    const [numeroFactura, setNumeroFactura] = useState('F001-0');
    const [clienteNombre, setClienteNombre] = useState('cliente');
    const [montoEfectivo, setMontoEfectivo] = useState('');
    const [ingresoTipo, setIngresoTipo] = useState('efectivo');
    const [ingresoMonto, setIngresoMonto] = useState('');
    const [ingresoMotivo, setIngresoMotivo] = useState('');
    const [retiroMonto, setRetiroMonto] = useState('');
    const [retiroMotivo, setRetiroMotivo] = useState('');
    const [retiroTipo, setRetiroTipo] = useState('efectivo');
    const [showCerrarCajaModal, setShowCerrarCajaModal] = useState(false);
    const [showCerrarTurnoModal, setShowCerrarTurnoModal] = useState(false);
    const [efectivoEnCaja, setEfectivoEnCaja] = useState('');
    const [cart, setCart] = useState([]);

    // State for cliente selection
    const [clientes, setClientes] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [searchCliente, setSearchCliente] = useState('');
    const [showClienteDropdown, setShowClienteDropdown] = useState(false);

    // State for stock alert modal
    const [showStockModal, setShowStockModal] = useState(false);
    const [stockAlertMessage, setStockAlertMessage] = useState('');

    // State for ticket modal
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [showVentaExitosaModal, setShowVentaExitosaModal] = useState(false);
    const [ventaCompletada, setVentaCompletada] = useState(null);

    // State for API data
    const [productos, setProductos] = useState([]);
    const [cajaInfo, setCajaInfo] = useState({
        sucursal: 'Cargando...',
        caja: 'Cargando...',
        usuario: 'usuario'
    });
    const [saldoCaja, setSaldoCaja] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch products, clientes and caja info on mount
    useEffect(() => {
        fetchProductos();
        fetchClientes();
        loadCajaInfo();
    }, []);

    const fetchClientes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/clientes?limit=1000`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const clientesData = data.data || (Array.isArray(data) ? data : []);
                setClientes(clientesData);
            }
        } catch (err) {
            console.error('Error fetching clientes:', err);
        }
    };

    const fetchProductos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/productos?limit=1000`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                const productosData = data.data || (Array.isArray(data) ? data : []);
                // Map products to expected format with icons
                const mapped = productosData.map(p => ({
                    id: p.id,
                    nombre: p.nombre,
                    precio: parseFloat(p.precioVenta) || parseFloat(p.precio) || 0,
                    stock: parseInt(p.stockActual) || parseInt(p.stock) || 0,
                    icon: getProductIcon(p.categoriaId),
                    color: getProductColor(p.categoriaId)
                }));
                setProductos(mapped);
            }
        } catch (err) {
            console.error('Error fetching productos:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadCajaInfo = async () => {
        try {
            const cajaActivaId = localStorage.getItem('cajaActiva');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            if (cajaActivaId) {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/cajas/${cajaActivaId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const caja = await response.json();
                    setCajaInfo({
                        sucursal: caja.sucursal?.nombre || 'N/A',
                        caja: caja.nombre || 'N/A',
                        usuario: user.nombres || user.email || 'usuario'
                    });
                    // Obtener saldo de caja
                    setSaldoCaja(parseFloat(caja.saldo) || parseFloat(caja.saldoActual) || parseFloat(caja.efectivo) || 0);
                } else {
                    // Fallback if caja fetch fails
                    setCajaInfo({
                        sucursal: 'Sucursal',
                        caja: 'Caja',
                        usuario: user.nombres || user.email || 'usuario'
                    });
                }
            } else {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                setCajaInfo({
                    sucursal: 'Sin Caja',
                    caja: 'Sin Caja Activa',
                    usuario: user.nombres || user.email || 'usuario'
                });
            }
        } catch (err) {
            console.error('Error loading caja info:', err);
        }
    };

    // Helper functions for product display
    const getProductIcon = (categoriaId) => {
        const icons = ['category', 'shopping_bag', 'inventory_2', 'store', 'sell', 'local_offer'];
        return icons[categoriaId % icons.length] || 'category';
    };

    const getProductColor = (categoriaId) => {
        const colors = ['bg-blue-500', 'bg-amber-600', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-cyan-500', 'bg-orange-500', 'bg-indigo-500'];
        return colors[categoriaId % colors.length] || 'bg-gray-500';
    };

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Format time
    const formatTime = (date) => {
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    // Format date
    const formatDate = (date) => {
        return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.precioUnit * item.cantidad), 0);

    // Calculate change
    const efectivoNum = parseFloat(montoEfectivo) || 0;
    const vuelto = Math.max(0, efectivoNum - total);
    const restante = Math.max(0, total - efectivoNum);

    // Cart handlers
    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        const currentQty = existingItem ? existingItem.cantidad : 0;

        // Validar stock disponible
        if (currentQty >= product.stock) {
            setStockAlertMessage(`Stock insuficiente. Solo hay ${product.stock} unidades de "${product.nombre}".`);
            setShowStockModal(true);
            return;
        }

        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                id: product.id,
                nombre: product.nombre,
                precioUnit: product.precio,
                stock: product.stock,
                cantidad: 1
            }]);
        }
    };

    const updateQuantity = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.cantidad + delta;
                // No permitir menos de 1
                if (newQty < 1) return item;
                // No permitir más del stock disponible
                if (newQty > item.stock) {
                    setStockAlertMessage(`Stock insuficiente. Solo hay ${item.stock} unidades de "${item.nombre}".`);
                    setShowStockModal(true);
                    return item;
                }
                return { ...item, cantidad: newQty };
            }
            return item;
        }));
    };

    const removeItem = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
        setMontoEfectivo('');
        setSelectedCliente(null);
        setVuelto(0);
        setRestante(0);
    };

    const handleCerrarCaja = async () => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const cajaId = localStorage.getItem('cajaActiva');
            const usuarioId = user.id;

            // Enviar saldoCaja como montoFinal, o permitir input del usuario
            // Por defecto usaremos el saldo calculado por el sistema
            const response = await fetch(`${API_URL}/cajas/${cajaId}/cerrar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    montoFinal: saldoCaja, // O el monto contado por el usuario
                    usuarioId: usuarioId
                })
            });

            if (response.ok) {
                // Limpiar storage y redirigir
                localStorage.removeItem('cajaActiva');
                navigate('/admin/apertura-cajas');
            } else {
                const errorData = await response.json();
                alert('Error: ' + (errorData.message || 'No se pudo cerrar la caja'));
            }
        } catch (err) {
            console.error('Error al cerrar caja:', err);
            alert('Error al cerrar la caja');
        }
    };

    const paymentMethods = [
        { id: 'qr', label: 'Qr', icon: 'credit_score', color: 'bg-purple-500' },
        { id: 'efectivo', label: 'Efectivo', icon: 'payments', color: 'bg-pink-500' },
    ];

    // Handle payment method selection
    const handlePaymentSelect = (methodId) => {
        setSelectedPayment(methodId);
        setShowPaymentModal(true);
        setMontoEfectivo('');
    };

    // Handle complete payment
    const handleCobrar = async () => {
        try {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const cajaId = parseInt(localStorage.getItem('cajaActiva')) || null;

            // Construir items para el backend
            const items = cart.map(item => ({
                productoId: item.id,
                nombre: item.nombre,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnit,
                subtotal: item.precioUnit * item.cantidad
            }));

            const ventaData = {
                tipoDocumento: tipoDocumento,
                numeroDocumento: numeroFactura,
                clienteId: selectedCliente?.id || null,
                clienteNombre: selectedCliente?.nombre || clienteNombre,
                cajaId: cajaId,
                usuarioId: user.id,
                metodoPago: selectedPayment,
                montoRecibido: efectivoNum,
                vuelto: vuelto,
                subtotal: total,
                descuento: 0,
                total: total,
                items: items
            };

            const response = await fetch(`${API_URL}/ventas`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ventaData)
            });

            if (response.ok) {
                const result = await response.json();

                // Guardar datos de la venta para el ticket
                setVentaCompletada({
                    numeroDocumento: numeroFactura,
                    tipoDocumento: tipoDocumento,
                    fecha: new Date(),
                    cliente: selectedCliente?.nombre || clienteNombre,
                    vendedor: user.nombres || user.email || 'Vendedor',
                    sucursal: cajaInfo.sucursal,
                    caja: cajaInfo.caja,
                    items: cart.map(item => ({
                        nombre: item.nombre,
                        cantidad: item.cantidad,
                        precioUnit: item.precioUnit,
                        subtotal: item.precioUnit * item.cantidad
                    })),
                    subtotal: total,
                    descuento: 0,
                    total: total,
                    metodoPago: selectedPayment,
                    montoRecibido: efectivoNum,
                    vuelto: vuelto
                });

                setShowPaymentModal(false);
                setShowVentaExitosaModal(true);
                // Actualizar saldo de caja con el total de la venta
                setSaldoCaja(prev => prev + total);
                setCart([]);
                setMontoEfectivo('');
                setSelectedCliente(null);
                // Incrementar número de factura (simple)
                const numParts = numeroFactura.split('-');
                const nextNum = parseInt(numParts[1] || 0) + 1;
                setNumeroFactura(`${numParts[0]}-${nextNum}`);
            } else {
                const errorData = await response.json();
                alert('Error: ' + (errorData.message || 'No se pudo registrar la venta'));
            }
        } catch (err) {
            console.error('Error al cobrar:', err);
            alert('Error al procesar la venta');
        }
    };

    // Filter products based on search
    const filteredProducts = productos.filter(p =>
        p.nombre.toLowerCase().includes(searchProduct.toLowerCase())
    );

    // Get selected payment method info
    const selectedPaymentInfo = paymentMethods.find(m => m.id === selectedPayment);

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] -m-6 lg:-m-10 bg-slate-100 dark:bg-gray-950">
            {/* CSS Animations */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(1.1); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.6); }
        }
        @keyframes borderPulse {
          0%, 100% { border-color: rgba(236, 72, 153, 0.3); }
          50% { border-color: rgba(236, 72, 153, 0.8); }
        }
        .page-animate { animation: fadeIn 0.3s ease-out; }
        .slide-in { animation: slideIn 0.4s ease-out; }
        .slide-up { animation: slideUp 0.4s ease-out; }
        .slide-right { animation: slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .scale-in { animation: scaleIn 0.3s ease-out; }
        .btn-bounce:active { transform: scale(0.95); transition: transform 0.1s; }
        .input-focus { transition: all 0.2s ease; }
        .input-focus:focus { transform: scale(1.01); box-shadow: 0 0 0 3px rgba(19, 91, 236, 0.15); }
        .cart-item { animation: slideIn 0.3s ease-out; }
        .cart-item:hover { background: rgba(0,0,0,0.02); }
        .payment-btn { transition: all 0.2s ease; }
        .payment-btn:hover { transform: translateY(-2px); }
        .payment-btn.selected { transform: scale(1.02); }
        .total-btn { animation: glow 2s ease-in-out infinite; }
        .total-btn:hover .heart { animation: heartbeat 0.6s ease-in-out; }
        .clock-pulse { animation: pulse 2s ease-in-out infinite; }
        .product-card { transition: all 0.2s ease; }
        .product-card:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 30px -8px rgba(0,0,0,0.15); }
        .product-card:active { transform: scale(0.98); }
        .payment-modal { animation: slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .modal-border { animation: borderPulse 2s ease-in-out infinite; }
        .amount-input { font-size: 3rem; font-weight: 900; text-align: center; }
      `}</style>

            {/* Top Header Bar */}
            <header className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 border-b border-cyan-100 dark:border-gray-700 px-4 py-3 flex items-center justify-between page-animate">
                <div className="flex items-center gap-2">
                    <Link to="/admin/apertura-cajas" className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-gray hover:bg-white/50 dark:hover:bg-gray-700 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">SUCURSAL:</span>
                    <span className="font-bold text-primary">{cajaInfo.sucursal}</span>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <span className="font-medium text-gray-600 dark:text-gray-400">CAJA:</span>
                    <span className="font-bold text-primary">{cajaInfo.caja}</span>
                </div>
                <div className="flex items-center gap-2 clock-pulse">
                    <span className="material-symbols-outlined text-emerald-500">schedule</span>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{formatTime(currentTime)}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(currentTime)}</span>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Panel - User Info & Cart */}
                <aside className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col slide-in">
                    {/* User Info */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/30">
                                {cajaInfo.usuario.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">{cajaInfo.sucursal}</p>
                                <p className="text-sm text-primary">@{cajaInfo.usuario}</p>
                            </div>
                        </div>
                    </div>

                    {/* Search Fields */}
                    <div className="p-4 space-y-3 border-b border-gray-100 dark:border-gray-800 relative">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                                className="input-focus w-16 px-3 py-2.5 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:border-primary"
                                placeholder="Cod"
                            />
                            <input
                                type="text"
                                value={searchProduct}
                                onChange={(e) => setSearchProduct(e.target.value)}
                                className="input-focus flex-1 px-4 py-2.5 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:border-primary"
                                placeholder="Buscar producto..."
                            />
                        </div>

                        {/* Search Results Dropdown - Solo aparece al escribir */}
                        {searchProduct.length > 0 && (
                            <div className="absolute left-4 right-4 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-64 overflow-y-auto z-20">
                                {filteredProducts.length === 0 ? (
                                    <div className="p-3 text-center text-gray-500 text-sm">
                                        No se encontraron productos
                                    </div>
                                ) : (
                                    filteredProducts.map(product => (
                                        <button
                                            key={product.id}
                                            onClick={() => {
                                                addToCart(product);
                                                setSearchProduct('');
                                            }}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                        >
                                            <div className={`w-8 h-8 ${product.color} rounded-lg flex items-center justify-center text-white`}>
                                                <span className="material-symbols-outlined text-sm">{product.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.nombre}</p>
                                                <p className="text-xs text-emerald-600 font-bold">Bs. {product.precio.toFixed(2)}</p>
                                            </div>
                                            <span className="material-symbols-outlined text-emerald-500 text-lg">add_circle</span>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto">
                        {cart.map((item, index) => (
                            <div
                                key={item.id}
                                className="cart-item border-b border-gray-100 dark:border-gray-800 p-4 transition-colors"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{item.nombre}</h3>
                                        <p className="text-xs text-gray-500">
                                            precio unit: <span className="text-emerald-600 font-semibold">Bs. {item.precioUnit.toFixed(2)}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Quantity Controls & Total */}
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="w-7 h-7 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors btn-bounce"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">add</span>
                                        </button>
                                        <span className="w-6 text-center font-bold text-gray-900 dark:text-white text-sm">{item.cantidad}</span>
                                        <button className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                                            <span className="material-symbols-outlined text-[12px]">check</span>
                                        </button>
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="w-7 h-7 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors btn-bounce"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">remove</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                                            Bs. {(item.precioUnit * item.cantidad).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors btn-bounce"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {cart.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                                <span className="material-symbols-outlined text-5xl mb-2">shopping_cart</span>
                                <p className="text-sm">No hay productos en el carrito</p>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Center - Products Grid */}
                <main className="flex-1 bg-slate-50 dark:bg-gray-900/50 p-4 overflow-y-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map((product, index) => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="product-card scale-in bg-white dark:bg-gray-800 rounded-xl p-4 text-left shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer"
                                style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
                            >
                                <div className={`w-12 h-12 ${product.color} rounded-xl flex items-center justify-center text-white mb-3 shadow-lg`}>
                                    <span className="material-symbols-outlined text-2xl">{product.icon}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">{product.nombre}</h3>
                                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                                    Bs. {product.precio.toFixed(2)}
                                </p>
                            </button>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <span className="material-symbols-outlined text-6xl mb-3">search_off</span>
                            <p className="text-lg font-medium">No se encontraron productos</p>
                            <p className="text-sm">Intenta con otra búsqueda</p>
                        </div>
                    )}
                </main>

                {/* Right Panel - Payment Methods & Total */}
                <aside className="w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col slide-up">
                    {/* Payment Method Buttons */}
                    <div className="p-3 grid grid-cols-2 gap-2">
                        {paymentMethods.map((method) => (
                            <button
                                key={method.id}
                                onClick={() => handlePaymentSelect(method.id)}
                                className={`payment-btn p-3 rounded-xl border-2 flex flex-col items-center gap-1 font-medium text-xs transition-all ${selectedPayment === method.id
                                    ? 'border-primary bg-primary/5 text-primary selected shadow-lg shadow-primary/10'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-xl">{method.icon}</span>
                                {method.label}
                            </button>
                        ))}
                    </div>

                    {/* Spacer */}
                    <div className="flex-1"></div>

                    {/* Total Button */}
                    <div className="p-3">
                        <button
                            onClick={() => cart.length > 0 && handlePaymentSelect('efectivo')}
                            className="total-btn w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/30 hover:from-emerald-600 hover:to-green-600 transition-all btn-bounce"
                        >
                            <span className="heart text-2xl">💚</span>
                            <span>Bs. {total.toFixed(2)}</span>
                        </button>
                    </div>
                </aside>

                {/* Payment Modal Overlay */}
                {showPaymentModal && (
                    <div className="absolute inset-0 z-50 flex items-stretch">
                        {/* Backdrop */}
                        <div
                            className="flex-1 bg-black/20 backdrop-blur-sm page-animate"
                            onClick={() => setShowPaymentModal(false)}
                        />

                        {/* Payment Panel */}
                        <div className="payment-modal w-96 bg-white dark:bg-gray-900 border-l-4 modal-border border-pink-400 flex flex-col shadow-2xl">
                            {/* Payment Type Badge */}
                            <div className="flex justify-end p-4">
                                <span className={`px-4 py-1.5 rounded-full text-white text-sm font-bold ${selectedPaymentInfo?.color || 'bg-pink-500'}`}>
                                    {selectedPaymentInfo?.label || 'Efectivo'}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 px-8 py-4 flex flex-col">
                                {/* Invoice Number */}
                                <div className="text-center mb-6">
                                    <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                                        Factura: <span className="font-black text-gray-900 dark:text-white">{numeroFactura}</span>
                                    </h2>
                                </div>

                                {/* Document Type Toggle */}
                                <div className="flex justify-center gap-3 mb-4">
                                    <button
                                        onClick={() => setTipoDocumento('factura')}
                                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${tipoDocumento === 'factura'
                                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                                            : 'bg-white dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Factura
                                    </button>
                                    <button
                                        onClick={() => setTipoDocumento('boleta')}
                                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${tipoDocumento === 'boleta'
                                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                                            : 'bg-white dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Boleta
                                    </button>
                                </div>

                                {/* Ticket Button */}
                                <div className="flex justify-center mb-6">
                                    <button
                                        onClick={() => setTipoDocumento('ticket')}
                                        className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${tipoDocumento === 'ticket'
                                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                                            : 'bg-white dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Ticket
                                    </button>
                                </div>

                                {/* Client Selector */}
                                <div className="relative mb-6">
                                    <label className="block text-sm text-gray-500 mb-2 text-center">Cliente</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={selectedCliente ? selectedCliente.nombre : searchCliente}
                                            onChange={(e) => {
                                                setSearchCliente(e.target.value);
                                                setSelectedCliente(null);
                                                setShowClienteDropdown(true);
                                            }}
                                            onFocus={() => setShowClienteDropdown(true)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary text-center font-medium"
                                            placeholder="Buscar cliente..."
                                        />
                                        {selectedCliente && (
                                            <button
                                                onClick={() => {
                                                    setSelectedCliente(null);
                                                    setSearchCliente('');
                                                }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Dropdown de clientes */}
                                    {showClienteDropdown && !selectedCliente && (
                                        <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-48 overflow-y-auto z-30">
                                            {clientes
                                                .filter(c =>
                                                    !searchCliente ||
                                                    c.nombre?.toLowerCase().includes(searchCliente.toLowerCase()) ||
                                                    c.telefono?.includes(searchCliente) ||
                                                    c.nit?.includes(searchCliente)
                                                )
                                                .slice(0, 10)
                                                .map(cliente => (
                                                    <button
                                                        key={cliente.id}
                                                        onClick={() => {
                                                            setSelectedCliente(cliente);
                                                            setSearchCliente('');
                                                            setShowClienteDropdown(false);
                                                        }}
                                                        className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                            {cliente.nombre?.charAt(0)?.toUpperCase() || 'C'}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{cliente.nombre}</p>
                                                            <p className="text-xs text-gray-500">{cliente.telefono || cliente.nit || ''}</p>
                                                        </div>
                                                    </button>
                                                ))
                                            }
                                            {clientes.filter(c =>
                                                !searchCliente ||
                                                c.nombre?.toLowerCase().includes(searchCliente.toLowerCase())
                                            ).length === 0 && (
                                                    <div className="p-3 text-center text-gray-500 text-sm">
                                                        No se encontraron clientes
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </div>

                                {/* Payment Amount */}
                                <div className="mb-6">
                                    <p className="text-center text-gray-400 text-sm mb-2">{selectedPaymentInfo?.label || 'Efectivo'}</p>
                                    <input
                                        type="number"
                                        min="0"
                                        value={montoEfectivo}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            if (val >= 0 || e.target.value === '') {
                                                setMontoEfectivo(e.target.value);
                                            }
                                        }}
                                        placeholder={total.toFixed(0)}
                                        className="amount-input w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-300"
                                        autoFocus
                                    />
                                </div>

                                {/* Divider */}
                                <div className="border-t border-dashed border-gray-200 dark:border-gray-700 my-4"></div>

                                {/* Summary */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-900 dark:text-white">Total:</span>
                                        <span className="font-black text-lg text-gray-900 dark:text-white">Bs. {total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Vuelto:</span>
                                        <span className="font-bold text-emerald-600">Bs. {vuelto.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Restante:</span>
                                        <span className={`font-bold ${restante > 0 ? 'text-red-500' : 'text-gray-400'}`}>Bs. {restante.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Cobrar Button */}
                                {/* Cobrar Button */}
                                <button
                                    onClick={handleCobrar}
                                    disabled={loading || restante > 0 || cart.length === 0}
                                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${restante <= 0 && cart.length > 0 && !loading
                                        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {loading ? 'Procesando...' : `COBRAR (enter)`}
                                </button>
                            </div>

                            {/* Back Button */}
                            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                    <span className="font-medium">volver</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Ingresar Dinero */}
            {
                showIngresoModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="modal-backdrop absolute inset-0 bg-slate-200/80 dark:bg-gray-950/80 backdrop-blur-sm"
                            onClick={() => setShowIngresoModal(false)}
                        />
                        <div className="modal-content relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="p-4 flex items-center justify-start">
                                <button
                                    onClick={() => setShowIngresoModal(false)}
                                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                    <span className="font-medium">Volver</span>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="px-8 pb-8">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-6">
                                    INGRESAR DINERO A CAJA
                                </h2>

                                {/* Payment Type - Solo Efectivo */}
                                <div className="flex justify-center mb-6">
                                    <button
                                        className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all bg-yellow-400 text-gray-900 shadow-md cursor-default"
                                    >
                                        Efectivo
                                    </button>
                                </div>

                                {/* Monto */}
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Monto:</label>
                                    <input
                                        type="number"
                                        value={ingresoMonto}
                                        onChange={(e) => setIngresoMonto(e.target.value)}
                                        placeholder="0.00"
                                        className="input-animated w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary text-lg"
                                    />
                                </div>

                                {/* Motivo */}
                                <div className="mb-6">
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Motivo (puede estar en blanco)</label>
                                    <textarea
                                        value={ingresoMotivo}
                                        onChange={(e) => setIngresoMotivo(e.target.value)}
                                        placeholder="motivo"
                                        rows="3"
                                        className="input-animated w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={async () => {
                                        const monto = parseFloat(ingresoMonto) || 0;
                                        if (monto > 0) {
                                            try {
                                                const token = localStorage.getItem('token');
                                                const cajaId = localStorage.getItem('cajaActiva');

                                                const response = await fetch(`${API_URL}/cajas/${cajaId}/ingreso`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Authorization': `Bearer ${token}`,
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify({
                                                        monto: monto,
                                                        tipo: 'efectivo',
                                                        motivo: ingresoMotivo,
                                                        usuarioId: JSON.parse(localStorage.getItem('user') || '{}').id
                                                    })
                                                });

                                                if (response.ok) {
                                                    const data = await response.json();
                                                    // Actualizar saldo con el valor del backend
                                                    setSaldoCaja(parseFloat(data.saldoActual) || (saldoCaja + monto));
                                                } else {
                                                    // Fallback: actualizar localmente
                                                    setSaldoCaja(prev => prev + monto);
                                                    console.error('Error al registrar ingreso en backend');
                                                }
                                            } catch (err) {
                                                // Fallback: actualizar localmente
                                                setSaldoCaja(prev => prev + monto);
                                                console.error('Error al registrar ingreso:', err);
                                            }
                                        }
                                        setShowIngresoModal(false);
                                        setIngresoMonto('');
                                        setIngresoMotivo('');
                                    }}
                                    className="w-full py-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold text-sm uppercase tracking-wide hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg shadow-emerald-500/30 btn-bounce"
                                >
                                    REGISTRAR
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Modal Retirar Dinero */}
            {
                showRetiroModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="modal-backdrop absolute inset-0 bg-slate-200/80 dark:bg-gray-950/80 backdrop-blur-sm"
                            onClick={() => setShowRetiroModal(false)}
                        />
                        <div className="modal-content relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="p-4 flex items-center justify-start">
                                <button
                                    onClick={() => setShowRetiroModal(false)}
                                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                    <span className="font-medium">Volver</span>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="px-8 pb-8">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-6">
                                    RETIRAR DINERO DE CAJA
                                </h2>

                                {/* Payment Type - Solo Efectivo */}
                                <div className="flex justify-center mb-6">
                                    <button
                                        className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all bg-yellow-400 text-gray-900 shadow-md cursor-default"
                                    >
                                        Efectivo
                                    </button>
                                </div>

                                {/* Monto */}
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Monto:</label>
                                    <input
                                        type="number"
                                        value={retiroMonto}
                                        onChange={(e) => setRetiroMonto(e.target.value)}
                                        placeholder="0.00"
                                        className="input-animated w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary text-lg"
                                    />
                                </div>

                                {/* Motivo */}
                                <div className="mb-6">
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Motivo (puede estar en blanco)</label>
                                    <textarea
                                        value={retiroMotivo}
                                        onChange={(e) => setRetiroMotivo(e.target.value)}
                                        placeholder="motivo"
                                        rows="3"
                                        className="input-animated w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={async () => {
                                        const monto = parseFloat(retiroMonto) || 0;
                                        if (monto > 0) {
                                            try {
                                                const token = localStorage.getItem('token');
                                                const cajaId = localStorage.getItem('cajaActiva');

                                                const response = await fetch(`${API_URL}/cajas/${cajaId}/retiro`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Authorization': `Bearer ${token}`,
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify({
                                                        monto: monto,
                                                        tipo: 'efectivo',
                                                        motivo: retiroMotivo,
                                                        usuarioId: JSON.parse(localStorage.getItem('user') || '{}').id
                                                    })
                                                });

                                                if (response.ok) {
                                                    const data = await response.json();
                                                    // Actualizar saldo con el valor del backend
                                                    setSaldoCaja(parseFloat(data.saldoActual) || Math.max(0, saldoCaja - monto));
                                                } else {
                                                    // Fallback: actualizar localmente
                                                    setSaldoCaja(prev => Math.max(0, prev - monto));
                                                    console.error('Error al registrar retiro en backend');
                                                }
                                            } catch (err) {
                                                // Fallback: actualizar localmente
                                                setSaldoCaja(prev => Math.max(0, prev - monto));
                                                console.error('Error al registrar retiro:', err);
                                            }
                                        }
                                        setShowRetiroModal(false);
                                        setRetiroMonto('');
                                        setRetiroMotivo('');
                                    }}
                                    className="w-full py-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold text-sm uppercase tracking-wide hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg shadow-emerald-500/30 btn-bounce"
                                >
                                    REGISTRAR
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Modal Cerrar Caja */}
            {
                showCerrarCajaModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="modal-backdrop absolute inset-0 bg-slate-200/90 dark:bg-gray-950/90 backdrop-blur-sm"
                            onClick={() => setShowCerrarCajaModal(false)}
                        />
                        <div className="modal-content relative w-full max-w-3xl bg-slate-100 dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="p-6 flex items-center justify-center">
                                <button
                                    onClick={() => setShowCerrarCajaModal(false)}
                                    className="absolute left-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                    <span className="font-medium">Volver</span>
                                </button>
                            </div>

                            {/* Date Range */}
                            <div className="text-center pb-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Corte de caja desde: <span className="font-medium text-gray-700 dark:text-gray-300">31/12/2025 14:44:09</span> Hasta: <span className="font-medium text-gray-700 dark:text-gray-300">2025-12-31 15:03:52</span>
                                </p>
                            </div>

                            {/* Summary Header */}
                            <div className="flex justify-between items-center px-8 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Ventas Totales: </span>
                                    <span className="font-bold text-gray-900 dark:text-white">Bs. 30.00</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Efectivo en CAJA: </span>
                                    <span className="font-bold text-gray-900 dark:text-white">Bs. 130.00</span>
                                </div>
                            </div>

                            {/* Main Content Card */}
                            <div className="p-8 flex justify-center">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 max-w-md w-full">
                                    <div className="flex gap-8">
                                        {/* Left Column - Dinero en CAJA */}
                                        <div className="flex-1 border-r border-gray-200 dark:border-gray-700 pr-6">
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Dinero en CAJA</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Fondo de caja:</span>
                                                    <span className="text-gray-900 dark:text-white">Bs. 100.00</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Ventas en efectivo:</span>
                                                    <span className="text-gray-900 dark:text-white">Bs. 30.00</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Ingresos varios:</span>
                                                    <span className="text-gray-900 dark:text-white">Bs. 0.00</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Gastos varios:</span>
                                                    <span className="text-red-500 font-medium">-Bs. 0.00</span>
                                                </div>
                                                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-3">
                                                    <div className="flex justify-between font-bold">
                                                        <span></span>
                                                        <span className="text-gray-900 dark:text-white">Bs. 130.00</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column - Ventas Totales */}
                                        <div className="flex-1 pl-2">
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Ventas Totales</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">En Efectivo:</span>
                                                    <span className="text-gray-900 dark:text-white">Bs. 30.00</span>
                                                </div>
                                                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-3">
                                                    <div className="flex justify-between font-bold">
                                                        <span></span>
                                                        <span className="text-gray-900 dark:text-white">Bs. 30.00</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Monto Físico en Caja */}
                            <div className="px-8 pb-4">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 max-w-md mx-auto">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-center">Verificar Cuadre de Caja</h3>

                                    <div className="mb-4">
                                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Monto físico en caja:</label>
                                        <input
                                            type="number"
                                            value={efectivoEnCaja}
                                            onChange={(e) => setEfectivoEnCaja(e.target.value)}
                                            placeholder="0.00"
                                            className="input-animated w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary text-lg text-center font-bold"
                                        />
                                    </div>

                                    {efectivoEnCaja && (
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Saldo según sistema:</span>
                                                <span className="font-bold text-gray-900 dark:text-white">Bs. {saldoCaja.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Monto físico:</span>
                                                <span className="font-bold text-gray-900 dark:text-white">Bs. {parseFloat(efectivoEnCaja || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-gray-700 dark:text-gray-300">Diferencia:</span>
                                                    {(() => {
                                                        const diferencia = parseFloat(efectivoEnCaja || 0) - saldoCaja;
                                                        if (diferencia === 0) {
                                                            return (
                                                                <span className="font-bold text-emerald-600 flex items-center gap-2">
                                                                    <span className="material-symbols-outlined">check_circle</span>
                                                                    ¡CUADRA! Bs. 0.00
                                                                </span>
                                                            );
                                                        } else if (diferencia > 0) {
                                                            return (
                                                                <span className="font-bold text-blue-600 flex items-center gap-2">
                                                                    <span className="material-symbols-outlined">arrow_upward</span>
                                                                    Sobrante: Bs. {diferencia.toFixed(2)}
                                                                </span>
                                                            );
                                                        } else {
                                                            return (
                                                                <span className="font-bold text-red-600 flex items-center gap-2">
                                                                    <span className="material-symbols-outlined">arrow_downward</span>
                                                                    Faltante: Bs. {Math.abs(diferencia).toFixed(2)}
                                                                </span>
                                                            );
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center pb-8">
                                <button
                                    onClick={() => {
                                        setShowCerrarCajaModal(false);
                                        setShowCerrarTurnoModal(true);
                                        setEfectivoEnCaja('');
                                    }}
                                    className="px-10 py-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold text-sm uppercase tracking-wide hover:from-orange-500 hover:to-orange-600 transition-all shadow-lg shadow-orange-500/30 btn-bounce"
                                >
                                    CERRAR CAJA
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Modal Cerrar Turno (Step 2) */}
            {
                showCerrarTurnoModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="modal-backdrop absolute inset-0 bg-slate-200/90 dark:bg-gray-950/90 backdrop-blur-sm"
                            onClick={() => setShowCerrarTurnoModal(false)}
                        />
                        <div className="modal-content relative w-full max-w-md bg-slate-100 dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="p-6 flex items-center justify-center">
                                <button
                                    onClick={() => {
                                        setShowCerrarTurnoModal(false);
                                        setShowCerrarCajaModal(true);
                                    }}
                                    className="absolute left-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                    <span className="font-medium">Volver</span>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="px-8 pb-8 text-center">
                                {/* Expected Cash */}
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Efectivo esperado en caja:
                                </h2>
                                <p className="text-3xl font-black text-gray-900 dark:text-white mb-8">
                                    Bs. 130.00
                                </p>

                                {/* Input Section */}
                                <div className="mb-4">
                                    <label className="block text-sm text-gray-500 dark:text-gray-400 mb-3">
                                        ¿Cuánto de <span className="font-bold text-gray-700 dark:text-gray-300">EFECTIVO</span> hay en caja física?
                                    </label>
                                    <input
                                        type="number"
                                        value={efectivoEnCaja}
                                        onChange={(e) => setEfectivoEnCaja(e.target.value)}
                                        placeholder="0.00"
                                        className="input-animated w-full px-6 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary text-xl text-center"
                                        autoFocus
                                    />
                                </div>

                                {/* Difference */}
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    diferencia: <span className={`font-bold ${(parseFloat(efectivoEnCaja) || 0) - 130 < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {(parseFloat(efectivoEnCaja) || 0) - 130 < 0 ? '-' : ''}Bs. {Math.abs((parseFloat(efectivoEnCaja) || 0) - 130).toFixed(2)}
                                    </span>
                                </p>

                                {/* Submit Button */}
                                <button
                                    onClick={() => {
                                        console.log('Cerrando turno con efectivo:', efectivoEnCaja);
                                        setShowCerrarTurnoModal(false);
                                        navigate('/admin/apertura-cajas');
                                    }}
                                    className="w-full py-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold text-sm uppercase tracking-wide hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg shadow-emerald-500/30 btn-bounce mb-4"
                                >
                                    CERRAR TURNO
                                </button>

                                {/* Warning Text */}
                                <p className="text-sm text-orange-500">
                                    La diferencia será registrada en su turno y se enviará a gerencia
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Bottom Action Bar */}
            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-2.5 flex items-center gap-2 page-animate">
                <button
                    onClick={clearCart}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 btn-bounce"
                >
                    <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                    Eliminar venta
                </button>
                <button
                    onClick={() => setShowCerrarCajaModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-all btn-bounce"
                >
                    <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                    Cerrar caja
                </button>
                <button
                    onClick={() => setShowIngresoModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-all btn-bounce"
                >
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    Ingresar dinero
                </button>
                <button
                    onClick={() => setShowRetiroModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-all btn-bounce"
                >
                    <span className="material-symbols-outlined text-[16px]">remove_circle</span>
                    Retirar dinero
                </button>

                {/* Spacer para empujar el saldo a la derecha */}
                <div className="flex-1"></div>

                {/* Cash in Register Display */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800">
                    <span className="material-symbols-outlined text-blue-500 text-[16px]">account_balance_wallet</span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">En caja:</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Bs. {saldoCaja.toFixed(2)}</span>


                </div>
            </footer >

            {/* Modal Cerrar Caja */}
            {
                showCerrarCajaModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowCerrarCajaModal(false)}
                        />
                        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-md w-full scale-in">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-3xl text-blue-500">point_of_sale</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Cerrar Caja
                                </h3>

                                {/* Saldo del sistema */}
                                <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Saldo según sistema:</p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white">Bs. {saldoCaja.toFixed(2)}</p>
                                </div>

                                {/* Input para monto físico */}
                                <div className="w-full mb-4">
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2 text-left">
                                        Monto físico en caja:
                                    </label>
                                    <input
                                        type="number"
                                        value={efectivoEnCaja}
                                        onChange={(e) => setEfectivoEnCaja(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-primary text-xl text-center font-bold"
                                        autoFocus
                                    />
                                </div>

                                {/* Mostrar diferencia solo si hay monto ingresado */}
                                {efectivoEnCaja && (
                                    <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
                                        {(() => {
                                            const diferencia = parseFloat(efectivoEnCaja || 0) - saldoCaja;
                                            if (diferencia === 0) {
                                                return (
                                                    <div className="flex items-center justify-center gap-2 text-emerald-600">
                                                        <span className="material-symbols-outlined">check_circle</span>
                                                        <span className="font-bold text-lg">¡CUADRA PERFECTO!</span>
                                                    </div>
                                                );
                                            } else if (diferencia > 0) {
                                                return (
                                                    <div className="text-center">
                                                        <p className="text-sm text-gray-500 mb-1">Diferencia:</p>
                                                        <div className="flex items-center justify-center gap-2 text-blue-600">
                                                            <span className="material-symbols-outlined">arrow_upward</span>
                                                            <span className="font-bold text-lg">Sobrante: Bs. {diferencia.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <div className="text-center">
                                                        <p className="text-sm text-gray-500 mb-1">Diferencia:</p>
                                                        <div className="flex items-center justify-center gap-2 text-red-600">
                                                            <span className="material-symbols-outlined">arrow_downward</span>
                                                            <span className="font-bold text-lg">Faltante: Bs. {Math.abs(diferencia).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>
                                )}

                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => {
                                            setShowCerrarCajaModal(false);
                                            setEfectivoEnCaja('');
                                        }}
                                        className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleCerrarCaja();
                                            setEfectivoEnCaja('');
                                        }}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                                    >
                                        Cerrar Caja
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Modal Stock Insuficiente */}
            {
                showStockModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowStockModal(false)}
                        />
                        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full scale-in">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-4xl text-red-500">inventory_2</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Stock Insuficiente</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">{stockAlertMessage}</p>
                                <button
                                    onClick={() => setShowStockModal(false)}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-bold hover:from-primary/90 hover:to-blue-700 transition-all"
                                >
                                    Entendido
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Modal Venta Exitosa */}
            {
                showVentaExitosaModal && ventaCompletada && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowVentaExitosaModal(false)}
                        />
                        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full scale-in">
                            <div className="flex flex-col items-center text-center">
                                {/* Success Icon */}
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                                    <span className="material-symbols-outlined text-5xl text-white">check</span>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">¡Venta Exitosa!</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-2">
                                    {ventaCompletada.tipoDocumento.charAt(0).toUpperCase() + ventaCompletada.tipoDocumento.slice(1)}: <span className="font-bold text-primary">{ventaCompletada.numeroDocumento}</span>
                                </p>
                                <p className="text-3xl font-bold text-emerald-500 mb-6">Bs. {ventaCompletada.total.toFixed(2)}</p>

                                {/* Buttons */}
                                <div className="w-full space-y-3">
                                    <button
                                        onClick={() => {
                                            setShowVentaExitosaModal(false);
                                            setShowTicketModal(true);
                                        }}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:from-primary/90 hover:to-blue-700 transition-all"
                                    >
                                        <span className="material-symbols-outlined">receipt_long</span>
                                        Ver e Imprimir Ticket
                                    </button>
                                    <button
                                        onClick={() => setShowVentaExitosaModal(false)}
                                        className="w-full py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Modal Ticket de Venta */}
            {
                showTicketModal && ventaCompletada && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowTicketModal(false)}
                        />
                        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto scale-in">
                            {/* Ticket Content for Printing */}
                            <div id="ticket-print" className="p-6 bg-white">
                                {/* Header */}
                                <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                                    <div className="border-2 border-gray-800 px-4 py-2 inline-block mb-2">
                                        <span className="text-xs">TU LOGO</span>
                                        <p className="font-bold text-lg">AQUÍ</p>
                                    </div>
                                    <p className="font-bold text-lg">{ventaCompletada.sucursal}</p>
                                    <p className="text-sm text-gray-500">-</p>
                                </div>

                                {/* Document Info */}
                                <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                                    <p className="font-bold capitalize">{ventaCompletada.tipoDocumento}</p>
                                    <p className="text-primary font-bold">{ventaCompletada.numeroDocumento}</p>
                                    <div className="flex justify-between text-xs mt-2">
                                        <span><strong>FECHA:</strong> {ventaCompletada.fecha.toLocaleDateString('es-ES')}</span>
                                        <span><strong>HORA:</strong> {ventaCompletada.fecha.toLocaleTimeString('es-ES')}</span>
                                    </div>
                                    <p className="text-xs mt-1"><strong>CAJERO:</strong> {ventaCompletada.vendedor}</p>
                                </div>

                                {/* Client Info */}
                                <div className="border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                                    <p className="font-bold text-sm">CLIENTE:</p>
                                    <p className="text-sm">NOMBRES: {ventaCompletada.cliente}</p>
                                    <p className="text-sm">DOC.ID: -</p>
                                    <p className="text-sm">DIRECC.: -</p>
                                </div>

                                {/* Products Table */}
                                <div className="border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                                    <div className="text-xs font-bold border-b border-gray-300 pb-1 mb-2">
                                        <div className="flex justify-between">
                                            <span className="w-1/2">CÓDIGO - DESCRIPCIÓN</span>
                                            <span className="w-1/6 text-center">CANT.</span>
                                            <span className="w-1/6 text-right">PRECIO</span>
                                            <span className="w-1/6 text-right">TOTAL</span>
                                        </div>
                                    </div>
                                    {ventaCompletada.items.map((item, index) => (
                                        <div key={index} className="text-xs mb-1">
                                            <p className="truncate">{item.nombre}</p>
                                            <div className="flex justify-between">
                                                <span className="w-1/2"></span>
                                                <span className="w-1/6 text-center">{item.cantidad}</span>
                                                <span className="w-1/6 text-right">{item.precioUnit.toFixed(2)}</span>
                                                <span className="w-1/6 text-right">{item.subtotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="border-b-2 border-dashed border-gray-300 pb-4 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold">SUBTOTAL: Bs.</span>
                                        <span>{ventaCompletada.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold">DESCUENTO: Bs.</span>
                                        <span>{ventaCompletada.descuento.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold mt-2">
                                        <span>TOTAL: Bs.</span>
                                        <span>{ventaCompletada.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="border-b-2 border-dashed border-gray-300 pb-4 mb-4 text-center">
                                    <p className="font-bold text-sm">FORMA DE PAGO:</p>
                                    <div className="flex justify-between text-sm mt-1">
                                        <span className="capitalize">{ventaCompletada.metodoPago}: Bs.</span>
                                        <span>{ventaCompletada.montoRecibido.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Vuelto: Bs.</span>
                                        <span>{ventaCompletada.vuelto.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="text-center text-xs text-gray-500">
                                    <p>¡Gracias por su compra!</p>
                                    <p className="mt-2">{ventaCompletada.sucursal} - {ventaCompletada.caja}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-4 border-t border-gray-200 flex gap-3 print:hidden">
                                <button
                                    onClick={() => setShowTicketModal(false)}
                                    className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => {
                                        const ticketContent = document.getElementById('ticket-print').innerHTML;
                                        const printWindow = window.open('', '_blank', 'width=300,height=600');
                                        printWindow.document.write(`
                                        <html>
                                            <head>
                                                <title>Ticket de Venta</title>
                                                <style>
                                                    @page {
                                                        size: 80mm auto;
                                                        margin: 0;
                                                    }
                                                    * { 
                                                        margin: 0; 
                                                        padding: 0; 
                                                        box-sizing: border-box; 
                                                        font-family: 'Courier New', monospace; 
                                                    }
                                                    body { 
                                                        width: 80mm;
                                                        max-width: 80mm;
                                                        padding: 5mm;
                                                        font-size: 10px;
                                                        line-height: 1.4;
                                                    }
                                                    .text-center { text-align: center; }
                                                    .font-bold { font-weight: bold; }
                                                    .text-xs { font-size: 9px; }
                                                    .text-sm { font-size: 10px; }
                                                    .text-lg { font-size: 12px; }
                                                    .border-b-2, .border-dashed, .border-b, .border-2 { border: none; }
                                                    .border-gray-300, .border-gray-800 { border: none; }
                                                    .pb-4 { padding-bottom: 8px; }
                                                    .mb-4 { margin-bottom: 8px; }
                                                    .mb-2 { margin-bottom: 4px; }
                                                    .mb-1 { margin-bottom: 2px; }
                                                    .mt-2 { margin-top: 4px; }
                                                    .mt-1 { margin-top: 2px; }
                                                    .p-6 { padding: 0; }
                                                    .flex { display: flex; }
                                                    .justify-between { justify-content: space-between; }
                                                    .capitalize { text-transform: capitalize; }
                                                    .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                                                    .text-primary { color: #000; }
                                                    .text-gray-500, .text-gray-600, .text-gray-400 { color: #333; }
                                                    .w-1\\/2 { width: 50%; }
                                                    .w-1\\/6 { width: 16.666%; }
                                                    .text-right { text-align: right; }
                                                    .inline-block { display: inline-block; }
                                                    .px-4 { padding-left: 8px; padding-right: 8px; }
                                                    .py-2 { padding-top: 4px; padding-bottom: 4px; }
                                                    .pb-1 { padding-bottom: 2px; }
                                                </style>
                                            </head>
                                            <body>${ticketContent}</body>
                                        </html>
                                    `);
                                        printWindow.document.close();
                                        printWindow.focus();
                                        printWindow.print();
                                        printWindow.close();
                                    }}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:from-primary/90 hover:to-blue-700 transition-all"
                                >
                                    <span className="material-symbols-outlined text-lg">print</span>
                                    Imprimir
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
