export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Página de Prueba</h1>
      <p>Si puedes ver esto, Next.js está funcionando correctamente.</p>
      <p>Fecha: {new Date().toLocaleString()}</p>
    </div>
  );
}
