import axios from 'axios';

// Configuración del cliente HTTP para servicios CRM
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Client Error:', error);

        if (error.response?.status === 401) {
            // Manejar error de autenticación
            console.warn('Authentication error - redirecting to login');
        }

        return Promise.reject(error);
    }
);

// Interceptor para requests (agregar tokens de autenticación si es necesario)
apiClient.interceptors.request.use(
    (config) => {
        // Aquí se puede agregar lógica para tokens de autenticación
        // const token = localStorage.getItem('authToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export { apiClient };