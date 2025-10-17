'use client';

import { Button } from '@/components/ui/button';
import { logoutUser } from '@/lib/auth-simple';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
}

/**
 * Botón de cierre de sesión para el MVP
 * 
 * Este componente proporciona un botón para cerrar sesión que elimina la cookie
 * de autenticación y redirige al usuario a la página de login.
 */
export function LogoutButton({
    variant = 'outline',
    size = 'sm',
    className = ''
}: LogoutButtonProps) {
    const router = useRouter();

    const handleLogout = () => {
        // Cerrar sesión
        logoutUser();

        // Redirigir al login
        router.push('/login');
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleLogout}
            className={className}
        >
            Cerrar sesión
        </Button>
    );
}