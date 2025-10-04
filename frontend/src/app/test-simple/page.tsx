export default function TestSimplePage() {
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue' }}>
      <h1 style={{ color: 'red', fontSize: '24px' }}>TEST SIMPLE</h1>
      <p>Si ves esto, Next.js está funcionando</p>
      <p>Fecha: {new Date().toLocaleString()}</p>
    </div>
  );
}