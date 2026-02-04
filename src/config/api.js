/**
 * Configuración centralizada de la API URL
 * 
 * Usa la variable de entorno VITE_API_URL si está definida,
 * de lo contrario usa 'http://localhost:3000' como fallback para desarrollo local.
 * 
 * Para producción, configura VITE_API_URL en tu archivo .env o en las variables
 * de entorno de Render.
 */

// Obtener la URL base de la API desde las variables de entorno de Vite
const envApiUrl = import.meta.env.VITE_API_URL;

// URL base con fallback para desarrollo local
export const API_BASE_URL = envApiUrl || 'http://localhost:3000';

/**
 * Construye una URL completa de la API concatenando la ruta proporcionada.
 * Evita duplicar barras inclinadas (/).
 * 
 * @param {string} path - Ruta del endpoint (ej: '/productos' o 'productos')
 * @returns {string} - URL completa del endpoint
 * 
 * @example
 * // Si VITE_API_URL = 'https://api.miapp.com'
 * buildApiUrl('/productos') // => 'https://api.miapp.com/productos'
 * buildApiUrl('productos')  // => 'https://api.miapp.com/productos'
 */
export const buildApiUrl = (path) => {
    // Eliminar barra final de la URL base si existe
    const baseUrl = API_BASE_URL.replace(/\/+$/, '');

    // Asegurar que el path comience con /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${baseUrl}${normalizedPath}`;
};

/**
 * URL de la API (compatibilidad con código existente)
 * @deprecated Usar buildApiUrl() para nuevos desarrollos
 */
export const API_URL = API_BASE_URL;

export default {
    API_BASE_URL,
    API_URL,
    buildApiUrl,
};
