import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Logo from '../components/Logo';
import { Mail, Lock, User, Phone, Heart, Stethoscope } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient', specialization: '', bloodGroup: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); 
    setError(''); 
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      
      // If doctor registration, show pending approval message
      if (form.role === 'doctor' && !data.token) {
        setError('');
        alert('✅ Registration successful!\n\nYour account is pending admin approval. You will receive an email notification once approved. Please contact support if you need assistance.');
        navigate('/login');
        return;
      }
      
      // For patients, login immediately
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate(`/${data.user.role}`);
      }
    } catch (err) { 
      setError(err.response?.data?.message || 'Registration failed'); 
    }
    finally { 
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
        width: '100%',
        maxWidth: '480px',
        position: 'relative',
        zIndex: 1,
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
            }}>Create Account</h2>
            <p style={{
              color: '#666',
              fontSize: '14px',
            }}>Join our healthcare community today</p>
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
            {/* Name field */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                color: '#1a1a1a',
                fontSize: '13px',
                fontWeight: 700,
                display: 'block',
                marginBottom: '10px',
              }}>Full Name</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '13px 16px',
                transition: 'all 0.3s ease',
              }}>
                <User size={18} style={{ color: '#667eea', marginRight: '12px', flexShrink: 0 }} />
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Smith"
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

            {/* Email field */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                color: '#1a1a1a',
                fontSize: '13px',
                fontWeight: 700,
                display: 'block',
                marginBottom: '10px',
              }}>Email</label>
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
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
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
            <div style={{ marginBottom: '18px' }}>
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
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
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

            {/* Phone field */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                color: '#1a1a1a',
                fontSize: '13px',
                fontWeight: 700,
                display: 'block',
                marginBottom: '10px',
              }}>Phone (optional)</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '13px 16px',
                transition: 'all 0.3s ease',
              }}>
                <Phone size={18} style={{ color: '#667eea', marginRight: '12px', flexShrink: 0 }} />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
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

            {/* Role selection */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                color: '#1a1a1a',
                fontSize: '13px',
                fontWeight: 700,
                display: 'block',
                marginBottom: '10px',
              }}>I am a</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '13px 16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#1a1a1a',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                <option value="patient">👤 Patient</option>
                <option value="doctor">👨‍⚕️ Doctor</option>
              </select>
            </div>

            {/* Specialization for doctors */}
            {form.role === 'doctor' && (
              <div style={{ marginBottom: '18px' }}>
                <label style={{
                  color: '#1a1a1a',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'block',
                  marginBottom: '10px',
                }}>Specialization</label>
                <select
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '13px 16px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1a1a1a',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <option value="">Select specialization</option>
                  {['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Oncology', 'General Practice', 'Psychiatry', 'Radiology'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Blood group for patients */}
            {form.role === 'patient' && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  color: '#1a1a1a',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'block',
                  marginBottom: '10px',
                }}>Blood Group</label>
                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '13px 16px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1a1a1a',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <option value="">Select blood group</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            )}

            {form.role === 'doctor' && (
              <div style={{ marginBottom: '24px' }} />
            )}

            {/* Create account button */}
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
                transition: 'all 0.3s ease',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
              }}
            >
              {loading ? '⏳ Creating account...' : '✨ Create Account'}
            </button>
          </form>

          {/* Footer */}
          <p style={{
            textAlign: 'center',
            marginTop: '24px',
            fontSize: '14px',
            color: '#666',
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#667eea', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}