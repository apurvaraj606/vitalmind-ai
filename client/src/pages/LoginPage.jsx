import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const fill = (e, p) => { setEmail(e); setPassword(p); };

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const user = await login(email, password);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0f0c29,#302b63,#1a1a3e)', padding: '20px', fontFamily: 'Inter,sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <Logo size={42} white />
            <span style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>VitalMind.ai</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8, fontSize: 14 }}>Intelligent Healthcare Management</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '36px' }}>
          <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Welcome back</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 28 }}>Sign in to your account</p>

          {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: '#fca5a5', fontSize: 13, marginBottom: 20 }}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="email-input" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Email address</label>
              <input id="email-input" type="email" name="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label htmlFor="password-input" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Password</label>
              <input id="password-input" type="password" name="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg,#667eea,#764ba2)', border: 'none', borderRadius: 10, padding: '13px', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>
              {loading ? '⏳ Signing in...' : '🔐 Sign In'}
            </button>
          </form>

          <a href="http://localhost:5000/api/auth/google" style={{ display: 'block', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '12px', color: '#fff', fontSize: 14, fontWeight: 600, textAlign: 'center', textDecoration: 'none', marginBottom: 24 }}>
            🔴 Continue with Google
          </a>

          {/* Click-to-fill demo accounts */}
          <div style={{ background: 'rgba(102,126,234,0.1)', border: '1px solid rgba(102,126,234,0.2)', borderRadius: 10, padding: '14px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 1 }}>Click to fill demo account</p>
            {[
              { role: 'Admin', e: 'admin@vitalmind.ai', p: 'Admin@123' },
              { role: 'Doctor', e: 'doctor@vitalmind.ai', p: 'Doctor@123' },
              { role: 'Patient', e: 'patient@vitalmind.ai', p: 'Patient@123' },
            ].map(d => (
              <button key={d.role} onClick={() => fill(d.e, d.p)} style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: 12, padding: '3px 0', textAlign: 'left' }}>
                <strong style={{ color: '#667eea' }}>{d.role}:</strong> {d.e} / {d.p}
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: 20, fontSize: 14 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#667eea', fontWeight: 700, textDecoration: 'none' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}