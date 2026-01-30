import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';

const API_URL = '/api';

export default function AddProducto() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get product ID from URL if editing
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    // Ref for barcode input
    const codigoBarrasRef = useRef(null);
    
    // State for camera scanner
    const [showScannerModal, setShowScannerModal] = useState(false);
    const [scanning, setScanning] = useState(false);
    const scannerRef = useRef(null);

    // Form state
    const [formData, setFormData] = useState({
        nombre: '',
        categoriaId: '',
        sucursalId: '',
        almacenId: '',
        talla: '',
        color: '',
        precioCompra: '',
        precioVenta: '',
        codigoBarras: '',
        codigoInterno: '',
        stock: 0,
        stockMinimo: 5
    });

    // Estado para imagen
    const [imagenFile, setImagenFile] = useState(null);
    const [imagenPreview, setImagenPreview] = useState(null);
    const [imagenActual, setImagenActual] = useState(null);

    // Data for dropdowns
    const [categorias, setCategorias] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [almacenes, setAlmacenes] = useState([]);

    useEffect(() => {
        fetchCategorias();
        fetchSucursales();
        fetchAlmacenes();

        // If editing, fetch the product data
        if (isEditing) {
            fetchProducto();
        }
    }, [id]);

    const fetchProducto = async () => {
        try {
            setLoadingData(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/productos/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const result = await response.json();
                const producto = result.data || result;

                setFormData({
                    nombre: producto.nombre || '',
                    categoriaId: producto.categoriaId || '',
                    sucursalId: producto.sucursalId || '',
                    almacenId: producto.almacenId || '',
                    talla: producto.talla || '',
                    color: producto.color || '',
                    precioCompra: producto.precioCompra || '',
                    precioVenta: producto.precioVenta || '',
                    codigoBarras: producto.codigoBarras || '',
                    codigoInterno: producto.codigoInterno || '',
                    stock: producto.stock || 0,
                    stockMinimo: producto.stockMinimo || 5
                });
                
                // Guardar imagen actual si existe
                if (producto.imagen) {
                    setImagenActual(producto.imagen);
                    setImagenPreview(producto.imagen);
                }
            } else {
                throw new Error('Error al cargar el producto');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingData(false);
        }
    };

    const fetchCategorias = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/categorias`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const result = await response.json();
                setCategorias(Array.isArray(result) ? result : (result.data || []));
            }
        } catch (err) {
            console.error('Error fetching categorias:', err);
        }
    };

    const fetchSucursales = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/sucursales`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const result = await response.json();
                setSucursales(Array.isArray(result) ? result : (result.data || []));
            }
        } catch (err) {
            console.error('Error fetching sucursales:', err);
        }
    };

    const fetchAlmacenes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/almacenes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const result = await response.json();
                setAlmacenes(Array.isArray(result) ? result : (result.data || []));
            }
        } catch (err) {
            console.error('Error fetching almacenes:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Manejar selección de imagen
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setError('Solo se permiten imágenes (JPG, PNG, GIF, WEBP)');
                return;
            }
            // Validar tamaño (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('La imagen no puede superar 5MB');
                return;
            }
            setImagenFile(file);
            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagenPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Eliminar imagen seleccionada
    const removeImage = () => {
        setImagenFile(null);
        setImagenPreview(imagenActual); // Volver a la imagen actual si existe
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.nombre.trim()) {
            errors.nombre = 'El nombre del producto es requerido';
        }
        if (!formData.categoriaId) {
            errors.categoriaId = 'Seleccione una categoría';
        }
        if (!formData.sucursalId) {
            errors.sucursalId = 'Seleccione una sucursal';
        }
        if (!formData.almacenId) {
            errors.almacenId = 'Seleccione un almacén';
        }
        if (!formData.precioCompra || parseFloat(formData.precioCompra) <= 0) {
            errors.precioCompra = 'Ingrese un precio de compra válido';
        }
        if (!formData.precioVenta || parseFloat(formData.precioVenta) <= 0) {
            errors.precioVenta = 'Ingrese un precio de venta válido';
        }
        if (!formData.talla || !formData.talla.trim()) {
            errors.talla = 'La talla es requerida';
        }
        if (!formData.color || !formData.color.trim()) {
            errors.color = 'El color es requerido';
        }
        if (!formData.codigoBarras || !formData.codigoBarras.trim()) {
            errors.codigoBarras = 'El código de barras es requerido';
        }
        if (!formData.codigoInterno || !formData.codigoInterno.trim()) {
            errors.codigoInterno = 'El código interno es requerido';
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const generateCodigoInterno = () => {
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        setFormData(prev => ({
            ...prev,
            codigoInterno: `ZAP-${random}`
        }));
    };

    // Función para activar el scanner de cámara
    const handleScannerClick = () => {
        setShowScannerModal(true);
    };

    // Iniciar escáner de cámara
    const startScanner = async () => {
        try {
            setScanning(true);
            const html5QrCode = new Html5Qrcode("barcode-reader");
            scannerRef.current = html5QrCode;

            await html5QrCode.start(
                { facingMode: "environment" }, // Usar cámara trasera en móviles
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    formatsToSupport: [
                        0,  // CODE_128
                        1,  // CODE_39
                        13, // EAN_13
                        14, // EAN_8
                        15, // UPC_A
                        16  // UPC_E
                    ]
                },
                (decodedText) => {
                    // Código detectado exitosamente
                    setFormData(prev => ({
                        ...prev,
                        codigoBarras: decodedText
                    }));
                    stopScanner();
                },
                (errorMessage) => {
                    // Error de escaneo (normal cuando no detecta nada)
                }
            );
        } catch (err) {
            console.error("Error al iniciar escáner:", err);
            setError("No se pudo acceder a la cámara. Por favor verifica los permisos.");
            setShowScannerModal(false);
            setScanning(false);
        }
    };

    // Detener escáner de cámara
    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current.clear();
            } catch (err) {
                console.error("Error al detener escáner:", err);
            }
        }
        setShowScannerModal(false);
        setScanning(false);
    };

    // Iniciar escáner cuando se abre el modal
    useEffect(() => {
        if (showScannerModal) {
            startScanner();
        }
        return () => {
            if (scannerRef.current && scanning) {
                stopScanner();
            }
        };
    }, [showScannerModal]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validate form before submission
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            // Usar FormData para enviar archivos
            const formDataToSend = new FormData();
            formDataToSend.append('nombre', formData.nombre);
            formDataToSend.append('categoriaId', formData.categoriaId);
            formDataToSend.append('sucursalId', formData.sucursalId);
            formDataToSend.append('almacenId', formData.almacenId);
            formDataToSend.append('talla', formData.talla || '');
            formDataToSend.append('color', formData.color || '');
            formDataToSend.append('precioCompra', formData.precioCompra);
            formDataToSend.append('precioVenta', formData.precioVenta);
            formDataToSend.append('codigoBarras', formData.codigoBarras || '');
            formDataToSend.append('codigoInterno', formData.codigoInterno || '');
            formDataToSend.append('stock', formData.stock || 0);
            formDataToSend.append('stockMinimo', formData.stockMinimo || 5);
            
            // Agregar imagen si se seleccionó una nueva
            if (imagenFile) {
                formDataToSend.append('imagen', imagenFile);
            }

            const url = isEditing ? `${API_URL}/productos/${id}` : `${API_URL}/productos`;
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`
                    // NO incluir Content-Type, el navegador lo agrega automáticamente con boundary
                },
                body: formDataToSend
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `Error al ${isEditing ? 'actualizar' : 'crear'} producto`);
            }

            // Redirect to products list
            navigate('/admin/productos');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex flex-wrap justify-between gap-3 items-center">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-neutral-gray mb-1">
                        <Link className="text-sm hover:text-primary" to="/admin/productos">Inventario</Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                        </span>
                    </div>
                    <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                        {isEditing ? 'Editar Producto' : 'Formulario de Producto'}
                    </h1>
                </div>
                <div className="flex gap-3">
                    <Link
                        to="/admin/productos"
                        className="flex items-center justify-center px-4 py-2 rounded-lg border border-border-light dark:border-border-dark text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Guardar Producto')}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500 text-[20px]">error</span>
                    <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                </div>
            )}

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-background-dark dark:border dark:border-border-dark rounded-xl shadow-sm border border-border-light p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Información General</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre del Producto */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Producto *</label>
                        <input
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className={`w-full rounded-lg border ${fieldErrors.nombre ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border-light dark:border-border-dark focus:border-primary focus:ring-primary'} dark:bg-gray-800 dark:text-white px-3 py-2`}
                            placeholder="Ej. Zapatillas Deportivas Air Run"
                            type="text"
                        />
                        {fieldErrors.nombre && (
                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">error</span>
                                {fieldErrors.nombre}
                            </p>
                        )}
                    </div>

                    {/* Imagen del Producto */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imagen del Producto</label>
                        <div className="flex items-start gap-4">
                            {/* Preview de imagen */}
                            <div className="size-24 rounded-lg border-2 border-dashed border-border-light dark:border-border-dark bg-background-light dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                {imagenPreview ? (
                                    <img 
                                        src={imagenPreview.startsWith('data:') ? imagenPreview : imagenPreview} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="material-symbols-outlined text-neutral-gray text-3xl">image</span>
                                )}
                            </div>
                            
                            {/* Input de archivo */}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    id="imagen"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <div className="flex gap-2">
                                    <label
                                        htmlFor="imagen"
                                        className="px-4 py-2 bg-background-light hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark cursor-pointer transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">upload</span>
                                        {imagenPreview ? 'Cambiar imagen' : 'Subir imagen'}
                                    </label>
                                    {imagenFile && (
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                            Quitar
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-neutral-gray mt-2">JPG, PNG, GIF o WEBP. Máximo 5MB.</p>
                                {imagenFile && (
                                    <p className="text-xs text-primary mt-1">Nueva imagen: {imagenFile.name}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Categoría */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría *</label>
                        <select
                            name="categoriaId"
                            value={formData.categoriaId}
                            onChange={handleChange}
                            className={`w-full rounded-lg border ${fieldErrors.categoriaId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border-light dark:border-border-dark focus:border-primary focus:ring-primary'} dark:bg-gray-800 dark:text-white px-3 py-2`}
                        >
                            <option value="">Seleccionar categoría...</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                        {fieldErrors.categoriaId && (
                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">error</span>
                                {fieldErrors.categoriaId}
                            </p>
                        )}
                    </div>

                    {/* Talla */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Talla *</label>
                        <select
                            name="talla"
                            value={formData.talla}
                            onChange={handleChange}
                            className={`w-full rounded-lg border ${fieldErrors.talla ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border-light dark:border-border-dark focus:border-primary focus:ring-primary'} dark:bg-gray-800 dark:text-white px-3 py-2`}
                        >
                            <option value="">Seleccionar talla...</option>
                            {Array.from({ length: 14 }, (_, i) => i + 30).map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                        {fieldErrors.talla && (
                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">error</span>
                                {fieldErrors.talla}
                            </p>
                        )}
                    </div>

                    {/* Color */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color *</label>
                        <input
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            className={`w-full rounded-lg border ${fieldErrors.color ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border-light dark:border-border-dark focus:border-primary focus:ring-primary'} dark:bg-gray-800 dark:text-white px-3 py-2`}
                            placeholder="Ej. Negro, Blanco, Rojo"
                            type="text"
                        />
                        {fieldErrors.color && (
                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">error</span>
                                {fieldErrors.color}
                            </p>
                        )}
                    </div>

                    {/* Precio de Compra */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio de Compra *</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-neutral-gray">$</span>
                            <input
                                name="precioCompra"
                                value={formData.precioCompra}
                                onChange={handleChange}
                                className={`w-full pl-7 rounded-lg border ${fieldErrors.precioCompra ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border-light dark:border-border-dark focus:border-primary focus:ring-primary'} dark:bg-gray-800 dark:text-white px-3 py-2`}
                                placeholder="0.00"
                                step="0.01"
                                type="number"
                            />
                        </div>
                        {fieldErrors.precioCompra && (
                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">error</span>
                                {fieldErrors.precioCompra}
                            </p>
                        )}
                    </div>

                    {/* Precio de Venta */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio de Venta *</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-neutral-gray">$</span>
                            <input
                                name="precioVenta"
                                value={formData.precioVenta}
                                onChange={handleChange}
                                className={`w-full pl-7 rounded-lg border ${fieldErrors.precioVenta ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border-light dark:border-border-dark focus:border-primary focus:ring-primary'} dark:bg-gray-800 dark:text-white px-3 py-2`}
                                placeholder="0.00"
                                step="0.01"
                                type="number"
                            />
                        </div>
                        {fieldErrors.precioVenta && (
                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">error</span>
                                {fieldErrors.precioVenta}
                            </p>
                        )}
                    </div>

                    {/* Código de Barras */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código de Barras *</label>
                        <div className="flex gap-2">
                            <input
                                ref={codigoBarrasRef}
                                name="codigoBarras"
                                value={formData.codigoBarras}
                                onChange={handleChange}
                                className={`w-full rounded-lg border ${fieldErrors.codigoBarras ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border-light dark:border-border-dark focus:border-primary focus:ring-primary'} dark:bg-gray-800 dark:text-white px-3 py-2`}
                                placeholder="Escaneé o ingrese código"
                                type="text"
                            />
                            <button 
                                type="button" 
                                onClick={handleScannerClick}
                                className="p-2 text-primary hover:text-primary/80 border border-primary dark:border-primary rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                                title="Activar escáner de código de barras"
                            >
                                <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                            </button>
                        </div>
                        {fieldErrors.codigoBarras && (
                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">error</span>
                                {fieldErrors.codigoBarras}
                            </p>
                        )}
                    </div>

                    {/* Código Interno */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código Interno *</label>
                        <div className="flex gap-2">
                            <input
                                name="codigoInterno"
                                value={formData.codigoInterno}
                                onChange={handleChange}
                                className={`w-full rounded-lg border ${fieldErrors.codigoInterno ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border-light dark:border-border-dark focus:border-primary focus:ring-primary'} dark:bg-gray-800 dark:text-white px-3 py-2`}
                                placeholder="Código automático"
                                type="text"
                            />
                            <button
                                type="button"
                                onClick={generateCodigoInterno}
                                className="px-3 py-2 bg-background-light hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-border-light dark:border-border-dark transition-colors"
                            >
                                Generar
                            </button>
                        </div>
                        {fieldErrors.codigoInterno && (
                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">error</span>
                                {fieldErrors.codigoInterno}
                            </p>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="col-span-1 md:col-span-2 border-t border-border-light dark:border-border-dark my-2"></div>

                    {/* Sucursal */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sucursal *</label>
                        <select
                            name="sucursalId"
                            value={formData.sucursalId}
                            onChange={handleChange}
                            className={`w-full rounded-lg border ${fieldErrors.sucursalId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border-light dark:border-border-dark focus:border-primary focus:ring-primary'} dark:bg-gray-800 dark:text-white px-3 py-2`}
                        >
                            <option value="">Seleccionar sucursal...</option>
                            {sucursales.map(suc => (
                                <option key={suc.id} value={suc.id}>{suc.nombre}</option>
                            ))}
                        </select>
                        {fieldErrors.sucursalId && (
                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">error</span>
                                {fieldErrors.sucursalId}
                            </p>
                        )}
                    </div>

                    {/* Almacén */}
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Almacén *</label>
                        <select
                            name="almacenId"
                            value={formData.almacenId}
                            onChange={handleChange}
                            className={`w-full rounded-lg border ${fieldErrors.almacenId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border-light dark:border-border-dark focus:border-primary focus:ring-primary'} dark:bg-gray-800 dark:text-white px-3 py-2`}
                        >
                            <option value="">Seleccionar almacén...</option>
                            {almacenes.map(alm => (
                                <option key={alm.id} value={alm.id}>{alm.nombre}</option>
                            ))}
                        </select>
                        {fieldErrors.almacenId && (
                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">error</span>
                                {fieldErrors.almacenId}
                            </p>
                        )}
                    </div>

                    {/* Stock */}
                    <div className="col-span-1">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <span className="material-symbols-outlined text-[18px] text-neutral-gray">inventory</span>
                            Stock
                        </label>
                        <input
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary px-3 py-2"
                            placeholder="0"
                            type="number"
                            min="0"
                        />
                    </div>

                    {/* Stock Mínimo */}
                    <div className="col-span-1">
                        <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <span className="material-symbols-outlined text-[18px] text-neutral-gray">warning</span>
                            Stock Mínimo
                        </label>
                        <input
                            name="stockMinimo"
                            value={formData.stockMinimo}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-border-light dark:border-border-dark dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary px-3 py-2"
                            placeholder="5"
                            type="number"
                        />
                    </div>
                </div>
            </form>

            {/* Scanner Modal */}
            {showScannerModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-blue-600 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white">
                                <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
                                <h3 className="font-bold text-lg">Escanear Código de Barras</h3>
                            </div>
                            <button
                                onClick={stopScanner}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Scanner Area */}
                        <div className="p-4">
                            <div 
                                id="barcode-reader" 
                                className="rounded-lg overflow-hidden border-4 border-primary/20"
                            ></div>
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
                                Coloca el código de barras frente a la cámara
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
