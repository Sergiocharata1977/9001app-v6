'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Rutas públicas que NO requieren autenticación
const PUBLIC_ROUTES = ['/', '/login'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Verificar si hay usuario en localStorage o cookies al cargar
    const checkUser = () => {
      try {
        // Primero intentar obtener de localStorage
        const userDataFromStorage = localStorage.getItem('user');

        // Luego intentar obtener de cookies
        const cookies = document.cookie.split(';');
        const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='));
        let userDataFromCookie = null;

        if (userCookie) {
          const userJson = userCookie.split('=')[1].trim();
          userDataFromCookie = decodeURIComponent(userJson);
        }

        // Decidir qué fuente usar y sincronizar
        if (userDataFromStorage && !userDataFromCookie) {
          // Si solo existe en localStorage, sincronizar a cookies
          document.cookie = `user=${encodeURIComponent(userDataFromStorage)}; path=/; max-age=86400`;
          setUser(JSON.parse(userDataFromStorage));
        } else if (!userDataFromStorage && userDataFromCookie) {
          // Si solo existe en cookies, sincronizar a localStorage
          localStorage.setItem('user', userDataFromCookie);
          setUser(JSON.parse(userDataFromCookie));
        } else if (userDataFromStorage && userDataFromCookie) {
          // Si existe en ambos, usar localStorage
          setUser(JSON.parse(userDataFromStorage));
        } else {
          // TEMPORAL: Para testing, crear usuario por defecto
          const defaultUser = {
            id: '1',
            email: 'admin@9001app.com',
            name: 'Administrador',
            role: 'admin'
          };
          setUser(defaultUser);
          localStorage.setItem('user', JSON.stringify(defaultUser));
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Limpiar ambos en caso de error
        localStorage.removeItem('user');
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      setLoading(false);
    };

    // Pequeño delay para asegurar que localStorage esté disponible
    const timer = setTimeout(checkUser, 300); // Aumentamos el tiempo de espera
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Verificar autenticación en cada cambio de ruta
    if (!loading && pathname) {
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

      if (!user && !isPublicRoute) {
        // Si no hay usuario y no es ruta pública, redirigir al login
        console.log('🔒 No autenticado - Redirigiendo al login');
        // Pequeño delay para evitar redirección inmediata
        setTimeout(() => {
          router.push('/login');
        }, 100);
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Validación simple para MVP
      if (email === 'admin@9001app.com' && password === 'admin123') {
        const userData: User = {
          id: '1',
          email: 'admin@9001app.com',
          name: 'Administrador',
          role: 'admin'
        };

        const userDataString = JSON.stringify(userData);

        // Guardar en localStorage
        localStorage.setItem('user', userDataString);

        // Guardar en cookies para el middleware con tiempo de expiración de 1 día
        document.cookie = `user=${encodeURIComponent(userDataString)}; path=/; max-age=86400`;

        // Pequeña pausa para asegurar que los datos se guarden correctamente
        await new Promise(resolve => setTimeout(resolve, 100));

        setUser(userData);
        return true;
      }

      // Credenciales para super admin
      if (email === 'superadmin@9001app.com' && password === 'superadmin123') {
        const userData: User = {
          id: '2',
          email: 'superadmin@9001app.com',
          name: 'Super Administrador',
          role: 'super-admin'
        };

        const userDataString = JSON.stringify(userData);

        // Guardar en localStorage
        localStorage.setItem('user', userDataString);

        // Guardar en cookies para el middleware con tiempo de expiración de 1 día
        document.cookie = `user=${encodeURIComponent(userDataString)}; path=/; max-age=86400`;

        // Pequeña pausa para asegurar que los datos se guarden correctamente
        await new Promise(resolve => setTimeout(resolve, 100));

        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  const logout = () => {
    // Eliminar de localStorage
    localStorage.removeItem('user');

    // Eliminar de cookies
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    setUser(null);
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

