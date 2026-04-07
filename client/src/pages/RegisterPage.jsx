import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Logo from '../components/Logo';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient', specialization: '', bloodGroup: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      localStorage.setItem('token', data.token);
      navigate(`/${data.user.role}`);
    } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '11px 14px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0f0c29,#302b63,#1a1a3e)', padding: '20px', fontFamily: 'Inter,sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <Logo size={36} white />
            <span style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>VitalMind.ai</span>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '36px' }}>
          <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Create Account</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 24 }}>Join VitalMind.ai today</p>
          {error && <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: '#fca5a5', fontSize: 13, marginBottom: 20 }}>⚠️ {error}</div>}
          <form onSubmit={handleSubmit}>
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Smith' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters' },
              { name: 'phone', label: 'Phone (optional)', type: 'text', placeholder: '+1 234 567 8900' },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{f.label}</label>
                <input name={f.name} type={f.type} style={inputStyle} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} required={f.name !== 'phone'} />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>I am a</label>
              <select name="role" style={{ ...inputStyle, cursor: 'pointer' }} value={form.role} onChange={handleChange}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            {form.role === 'doctor' && (
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Specialization</label>
                <select name="specialization" style={{ ...inputStyle, cursor: 'pointer' }} value={form.specialization} onChange={handleChange}>
                  <option value="">Select specialization</option>
                  {['Cardiology','Neurology','Pediatrics','Orthopedics','Dermatology','Oncology','General Practice','Psychiatry','Radiology'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            )}
            {form.role === 'patient' && (
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Blood Group</label>
                <select name="bloodGroup" style={{ ...inputStyle, cursor: 'pointer' }} value={form.bloodGroup} onChange={handleChange}>
                  <option value="">Select blood group</option>
                  {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            )}
            <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg,#667eea,#764ba2)', border: 'none', borderRadius: 10, padding: '13px', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
              {loading ? '⏳ Creating account...' : '✨ Create Account'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: 20, fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#667eea', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}