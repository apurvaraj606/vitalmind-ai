import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const fill = (e, p) => { setEmail(e); setPassword(p); };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      navigate(`/${user.role}`);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Check your credentials.';
      const status = err.response?.data?.status;
      
      if (status === 'pending_approval') {
        setError('⏳ ' + errMsg);
      } else {
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        top: '-100px',
        left: '-100px',
        animation: 'float 6s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
        bottom: '-50px',
        right: '-50px',
        animation: 'float 8s ease-in-out infinite reverse',
      }} />

      <div style={{
        display: 'flex',
        gap: '60px',
        width: '100%',
        maxWidth: '1400px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Login form */}
        <div style={{
          flex: 1,
          maxWidth: '480px',
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          {/* Form card */}
          <div style={{
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '48px 40px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 0 1px rgba(255,255,255,0.5) inset',
            border: '1px solid rgba(255,255,255,0.3)',
          }}>
            {/* Header */}
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
                <Logo size={40} />
                <span style={{ fontSize: '24px', fontWeight: 800, background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>VitalMind</span>
              </div>
              <h2 style={{
                color: '#1a1a1a',
                fontSize: '32px',
                fontWeight: 900,
                marginBottom: '12px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Welcome Back</h2>
              <p style={{
                color: '#666',
                fontSize: '14px',
              }}>Sign in to access your healthcare management</p>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                background: 'linear-gradient(135deg, #fee 0%, #fef3f0 100%)',
                border: '2px solid #f59e0b',
                borderRadius: '12px',
                padding: '14px 16px',
                color: '#92400e',
                fontSize: '13px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontWeight: 500,
              }}>
                <span style={{ fontSize: '20px' }}>⚠️</span>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Email field */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  color: '#1a1a1a',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'block',
                  marginBottom: '10px',
                }}>Email address</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '13px 16px',
                  transition: 'all 0.3s ease',
                }}>
                  <Mail size={18} style={{ color: '#667eea', marginRight: '12px', flexShrink: 0 }} />
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      border: 'none',
                      background: 'none',
                      outline: 'none',
                      flex: 1,
                      fontSize: '14px',
                      color: '#1a1a1a',
                      fontWeight: 500,
                    }}
                  />
                </div>
              </div>

              {/* Password field */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  color: '#1a1a1a',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'block',
                  marginBottom: '10px',
                }}>Password</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '13px 16px',
                  transition: 'all 0.3s ease',
                }}>
                  <Lock size={18} style={{ color: '#667eea', marginRight: '12px', flexShrink: 0 }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      border: 'none',
                      background: 'none',
                      outline: 'none',
                      flex: 1,
                      fontSize: '14px',
                      color: '#1a1a1a',
                      fontWeight: 500,
                      letterSpacing: '0.5px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#667eea',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px',
                    }}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '28px',
                fontSize: '13px',
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#666' }}>
                  <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                  Remember me
                </label>
                <a href="#" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 600 }}>
                  Forgot password?
                </a>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
                }}
              >
                {loading ? '⏳ Signing in...' : <>Sign in <ArrowRight size={18} /></>}
              </button>
            </form>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '28px 0',
            }}>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
              <span style={{ fontSize: '12px', color: '#999', fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            </div>

            {/* Google OAuth button */}
            <button
              onClick={() => window.location.href = 'https://vitalmind-ai-e9xn.onrender.com/api/auth/google'}
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                background: '#fff',
                color: '#1a1a1a',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
              }}
            >
              <FaGoogle size={18} color="#4285f4" />
              Continue with Google
            </button>

            {/* Footer */}
            <p style={{
              textAlign: 'center',
              marginTop: '28px',
              fontSize: '14px',
              color: '#666',
            }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#667eea', fontWeight: 700, textDecoration: 'none' }}>
                Create one
              </Link>
            </p>

            {/* Demo accounts */}
            <div style={{
              marginTop: '28px',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb',
            }}>
              <p style={{ fontSize: '12px', color: '#999', fontWeight: 600, marginBottom: '12px', textAlign: 'center' }}>DEMO ACCOUNTS</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {[
                  { role: '👤 Patient', email: 'patient@vitalmind.ai', pass: 'Patient@123' },
                  { role: '👨‍⚕️ Doctor', email: 'doctor@vitalmind.ai', pass: 'Doctor@123' },
                  { role: '⚙️ Admin', email: 'admin@vitalmind.ai', pass: 'Admin@123' },
                ].map((demo, i) => (
                  <button
                    key={i}
                    onClick={() => fill(demo.email, demo.pass)}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      background: '#f9fafb',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#666',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#f0f0f0';
                      e.currentTarget.style.borderColor = '#667eea';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    {demo.role}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}