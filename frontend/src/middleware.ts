import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Middleware simple para MVP
 * 
 * Este middleware verifica si el usuario está autenticado para acceder a rutas protegidas.
 * Es una implementación simplificada para el MVP, sin verificación de JWT ni roles complejos.
 */
export function middleware(request: NextRequest) {
    // Obtener la cookie de autenticación
    const user = request.cookies.get('user')?.value;
    const isLoggedIn = !!user;

    // Ruta actual
    const { pathname } = request.nextUrl;

    // Rutas públicas que no requieren autenticación
    const publicRoutes = ['/login'];
    const isPublicRoute = publicRoutes.some(route => pathname === route);

    // Si es una ruta pública y el usuario está autenticado, redirigir según el tipo de usuario
    if (isPublicRoute && isLoggedIn) {
        try {
            const userData = JSON.parse(decodeURIComponent(user));
            // Redirigir según el rol del usuario
            if (userData.role === 'super-admin') {
                return NextResponse.redirect(new URL('/super-admin', request.url));
            } else {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        } catch (error) {
            // Si hay error parseando el usuario, redirigir al dashboard por defecto
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // Si no es una ruta pública y el usuario no está autenticado, redirigir al login
    if (!isPublicRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Continuar con la solicitud
    return NextResponse.next();
}

// Configurar las rutas que deben ser manejadas por el middleware
export const config = {
    matcher: [
        // Rutas que requieren autenticación
        '/',
        '/dashboard',
        '/dashboard/:path*',
        '/super-admin/:path*',
        '/rrhh/:path*',
        '/crm/:path*',
        '/documentos/:path*',
        '/procesos/:path*',
        '/auditorias/:path*',
        '/indicadores/:path*',
        '/calidad/:path*',
        '/mejoras/:path*',
        '/deteccion-personal/:path*',
        '/satisfaccion-partes/:path*',
        '/hallazgos/:path*',
        '/acciones/:path*',
        '/normas/:path*',
        // Rutas públicas (para redirigir si ya está autenticado)
        '/login'
    ],
};