// Script para limpiar cookies de desarrollo
// Ejecutar en la consola del navegador

// Limpiar todas las cookies relacionadas con la aplicación
document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
localStorage.clear();
sessionStorage.clear();

console.log('✅ Cookies y almacenamiento local limpiados');
console.log('🔄 Recarga la página para probar el flujo de login');



