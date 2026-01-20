import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    const [cart, setCart] = useState([
        {
            id: 1,
            nombre: 'Producto de prueba',
            precioUnit: 10.00,
            cantidad: 1
        }
    ]);

    // Current cash register info
    const cajaInfo = {
        sucursal: 'Generica',
        caja: 'Caja principal',
        usuario: 'superadmin'
    };

    // Sample products for the center grid
    const productos = [
        { id: 1, nombre: 'Zapatillas Running Pro', precio: 89.99, icon: 'directions_run', color: 'bg-blue-500' },
        { id: 2, nombre: 'Botas de Montaña', precio: 125.00, icon: 'hiking', color: 'bg-amber-600' },
        { id: 3, nombre: 'Sandalias Verano', precio: 45.50, icon: 'sunny', color: 'bg-yellow-500' },
        { id: 4, nombre: 'Zapatos Formales', precio: 150.00, icon: 'business_center', color: 'bg-gray-700' },
        { id: 5, nombre: 'Tenis Casuales', precio: 75.00, icon: 'mood', color: 'bg-green-500' },
        { id: 6, nombre: 'Zapatillas Skate', precio: 95.00, icon: 'skateboarding', color: 'bg-purple-500' },
        { id: 7, nombre: 'Pantuflas Comfort', precio: 35.00, icon: 'home', color: 'bg-pink-400' },
        { id: 8, nombre: 'Botas Lluvia', precio: 55.00, icon: 'water_drop', color: 'bg-cyan-500' },
        { id: 9, nombre: 'Zapatos Niños', precio: 40.00, icon: 'child_care', color: 'bg-orange-400' },
        { id: 10, nombre: 'Deportivas Premium', precio: 180.00, icon: 'fitness_center', color: 'bg-red-500' },
        { id: 11, nombre: 'Mocasines Clasicos', precio: 110.00, icon: 'star', color: 'bg-indigo-500' },
        { id: 12, nombre: 'Chanclas Playa', precio: 25.00, icon: 'beach_access', color: 'bg-teal-400' },
    ];

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
                cantidad: 1
            }]);
        }
    };

    const updateQuantity = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.cantidad + delta);
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
    };

    const paymentMethods = [
        { id: 'credito', label: 'Crédito', icon: 'credit_score', color: 'bg-purple-500' },
        { id: 'efectivo', label: 'Efectivo', icon: 'payments', color: 'bg-pink-500' },
        { id: 'mixto', label: 'Mixto', icon: 'swap_horiz', color: 'bg-orange-500' },
        { id: 'tarjeta', label: 'Tarjeta', icon: 'credit_card', color: 'bg-blue-500' }
    ];

    // Handle payment method selection
    const handlePaymentSelect = (methodId) => {
        setSelectedPayment(methodId);
        setShowPaymentModal(true);
        setMontoEfectivo('');
    };

    // Handle complete payment
    const handleCobrar = () => {
        console.log('Cobrando:', { tipoDocumento, numeroFactura, clienteNombre, metodoPago: selectedPayment, total, efectivo: efectivoNum, vuelto });
        setShowPaymentModal(false);
        setCart([]);
        setMontoEfectivo('');
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
                    <div className="p-4 space-y-3 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                                className="input-focus w-16 px-3 py-2.5 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:border-primary"
                                placeholder="1"
                            />
                            <input
                                type="text"
                                value={searchProduct}
                                onChange={(e) => setSearchProduct(e.target.value)}
                                className="input-focus flex-1 px-4 py-2.5 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white focus:border-primary"
                                placeholder="buscar..."
                            />
                        </div>
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

                                {/* Client */}
                                <div className="text-center mb-8">
                                    <p className="text-gray-900 dark:text-white font-medium text-lg">{clienteNombre}</p>
                                    <button className="mt-2 w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 mx-auto hover:bg-cyan-200 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                </div>

                                {/* Payment Amount */}
                                <div className="mb-6">
                                    <p className="text-center text-gray-400 text-sm mb-2">{selectedPaymentInfo?.label || 'Efectivo'}</p>
                                    <input
                                        type="number"
                                        value={montoEfectivo}
                                        onChange={(e) => setMontoEfectivo(e.target.value)}
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
                                <button
                                    onClick={handleCobrar}
                                    disabled={restante > 0}
                                    className={`w-full py-4 rounded-full font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg btn-bounce ${restante > 0
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-emerald-500/30'
                                        }`}
                                >
                                    COBRAR (enter)
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
            {showIngresoModal && (
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

                            {/* Payment Type Toggle */}
                            <div className="flex justify-center gap-3 mb-4">
                                <button
                                    onClick={() => setIngresoTipo('credito')}
                                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${ingresoTipo === 'credito'
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                                        : 'bg-white dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Credito
                                </button>
                                <button
                                    onClick={() => setIngresoTipo('efectivo')}
                                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${ingresoTipo === 'efectivo'
                                        ? 'bg-yellow-400 text-gray-900 shadow-md'
                                        : 'bg-white dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Efectivo
                                </button>
                            </div>
                            <div className="flex justify-center mb-6">
                                <button
                                    onClick={() => setIngresoTipo('tarjeta')}
                                    className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${ingresoTipo === 'tarjeta'
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                                        : 'bg-white dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Tarjeta
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
                                onClick={() => {
                                    console.log('Ingreso:', { tipo: ingresoTipo, monto: ingresoMonto, motivo: ingresoMotivo });
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
            )}

            {/* Modal Retirar Dinero */}
            {showRetiroModal && (
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

                            {/* Payment Type Toggle */}
                            <div className="flex justify-center gap-3 mb-4">
                                <button
                                    onClick={() => setRetiroTipo('credito')}
                                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${retiroTipo === 'credito'
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                                        : 'bg-white dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Credito
                                </button>
                                <button
                                    onClick={() => setRetiroTipo('efectivo')}
                                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${retiroTipo === 'efectivo'
                                        ? 'bg-yellow-400 text-gray-900 shadow-md'
                                        : 'bg-white dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Efectivo
                                </button>
                            </div>
                            <div className="flex justify-center mb-6">
                                <button
                                    onClick={() => setRetiroTipo('tarjeta')}
                                    className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${retiroTipo === 'tarjeta'
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                                        : 'bg-white dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    Tarjeta
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
                                onClick={() => {
                                    console.log('Retiro:', { tipo: retiroTipo, monto: retiroMonto, motivo: retiroMotivo });
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
            )}

            {/* Modal Cerrar Caja */}
            {showCerrarCajaModal && (
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
            )}

            {/* Modal Cerrar Turno (Step 2) */}
            {showCerrarTurnoModal && (
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
            )}

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
            </footer>
        </div>
    );
}
