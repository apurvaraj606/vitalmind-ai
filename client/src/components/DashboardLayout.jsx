import Navbar from './Navbar';

export default function DashboardLayout({ children, title, subtitle }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb' }}>
      <Navbar />
      <div style={{ padding: '32px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {(title || subtitle) && (
            <div style={{ marginBottom: 32 }}>
              {title && (
                <h1 style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: '#1a1a1a',
                  margin: '0 0 8px',
                }}>
                  {title}
                </h1>
              )}
              {subtitle && (
                <p style={{
                  fontSize: 15,
                  color: '#666',
                  margin: 0,
                }}>
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
