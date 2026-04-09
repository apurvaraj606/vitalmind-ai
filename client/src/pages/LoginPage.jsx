import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
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
        {/* Left side - Brand showcase */}
        <div style={{
          flex: 1,
          color: 'white',
          display: 'none',
          '@media (min-width: 1024px)': { display: 'block' }
        }}>
          <div style={{ marginBottom: '50px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.2)',
              }}>
                <Logo size={48} white />
              </div>
              <h1 style={{ fontSize: '44px', fontWeight: 900, margin: 0, letterSpacing: '-1px' }}>VitalMind.ai</h1>
            </div>
            <p style={{ fontSize: '18px', opacity: 0.95, marginBottom: '8px', fontWeight: 500 }}>Healthcare Reimagined</p>
            <p style={{ fontSize: '15px', opacity: 0.8, maxWidth: '400px', lineHeight: 1.6 }}>Experience seamless healthcare management with AI-powered insights and secure medical consultations</p>
          </div>

          {/* Features list */}
          <div style={{ marginTop: '60px', space: '24px' }}>
            {[
              { icon: Heart, text: '500+ Verified Doctors' },
              { icon: Users, text: '10K+ Active Patients' },
              { icon: Shield, text: 'Enterprise Security' },
              { icon: Zap, text: 'Instant Consultations' },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', opacity: 0.95 }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    backdropFilter: 'blur(10px)',
                  }}>
                    <Icon size={22} />
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 500 }}>{feature.text}</span>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {[
                { number: '99.9%', label: 'Uptime' },
                { number: '2M+', label: 'Consultations' },
                { number: '48h', label: 'Avg Response' },
              ].map((stat, i) => (
                <div key={i}>
                  <div style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>{stat.number}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7, fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div style={{
          flex: 1,
          maxWidth: '480px',
          width: '100%',
        }}>
          {/* Mobile header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '32px',
            '@media (min-width: 1024px)': { display: 'none' }
          }}>
            <Logo size={40} white />
            <span style={{ color: '#fff', fontSize: '24px', fontWeight: 800 }}>VitalMind.ai</span>
          </div>

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
            <div style={{ marginBottom: '32px' }}>
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
              }}>Sign in to your account to access healthcare management</p>
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
                  cursor: 'text',
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
                <a href="#" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 600, hover: { color: '#764ba2' } }}>
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
              color: '#ddd',
            }}>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
              <span style={{ fontSize: '12px', color: '#999', fontWeight: 600 }}>OR CONTINUE WITH</span>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            </div>

            {/* Google OAuth button */}
            <button
              onClick={() => window.location.href = 'http://localhost:5001/api/auth/google'}
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
                  { role: '👤 Patient', email: 'patient@test.com', pass: 'password123' },
                  { role: '👨‍⚕️ Doctor', email: 'doctor@test.com', pass: 'password123' },
                  { role: '⚙️ Admin', email: 'admin@test.com', pass: 'password123' },
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