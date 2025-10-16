/**
 * Sistema de autenticación ultra simple para MVP
 * 
 * Este archivo proporciona funciones básicas de autenticación sin JWT complejo
 * para acelerar el desarrollo del MVP. En futuras versiones, se implementará
 * un sistema de autenticación más robusto con JWT, roles y permisos.
 */

// Tipo de usuario simplificado para MVP
export interface SimpleUser {
    id: string;
    email: string;
    role: string;
    name: string;
}

// Credenciales fijas para MVP
const MVP_CREDENTIALS = {
    email: "admin@9001app.com",
    password: "admin123",
    role: "admin"
};

/**
 * Autentica un usuario con email y contraseña
 * @param email Email del usuario
 * @param password Contraseña del usuario
 * @returns Objeto de usuario si la autenticación es exitosa, null en caso contrario
 */
export const authenticateUser = (email: string, password: string): SimpleUser | null => {
    // Validación ultra simple para MVP
    if (email === MVP_CREDENTIALS.email && password === MVP_CREDENTIALS.password) {
        return {
            id: "admin-1",
            email,
            role: MVP_CREDENTIALS.role,
            name: "Administrador MVP"
        };
    }
    return null;
};

/**
 * Verifica si hay un usuario autenticado en las cookies
 * @returns Objeto de usuario si existe, null en caso contrario
 */
export const getCurrentUser = (): SimpleUser | null => {
    if (typeof window === 'undefined') return null;

    // Obtener todas las cookies
    const cookies = document.cookie.split(';');
    let userCookie = cookies.find(cookie => cookie.trim().startsWith('user='));

    if (!userCookie) return null;

    try {
        // Extraer el valor de la cookie
        const userJson = userCookie.split('=')[1].trim();
        return JSON.parse(decodeURIComponent(userJson)) as SimpleUser;
    } catch (error) {
        console.error('Error al parsear usuario de la cookie:', error);
        return null;
    }
};

/**
 * Cierra la sesión del usuario actual
 */
export const logoutUser = (): void => {
    if (typeof window === 'undefined') return;
    // Eliminar la cookie estableciendo una fecha de expiración en el pasado
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

/**
 * Verifica si el usuario está autenticado
 * @returns true si el usuario está autenticado, false en caso contrario
 */
export const isAuthenticated = (): boolean => {
    return getCurrentUser() !== null;
};