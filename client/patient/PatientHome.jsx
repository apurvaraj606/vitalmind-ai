import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import api from '../src/api';
import { Calendar, Pill, Clock, Droplet } from 'lucide-react';

export default function PatientHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, upcoming: 0, prescriptions: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    // Load appointments and prescriptions in parallel
    Promise.all([api.get('/appointments'), api.get('/prescriptions')])
      .then(([a, p]) => {
        const upcoming = a.data.filter(x => x.status === 'confirmed' && new Date(x.date) > new Date());
        setStats({ total: a.data.length, upcoming: upcoming.length, prescriptions: p.data.length });
        setRecent(a.data.slice(0, 3));
      }).catch(() => {});
  }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontWeight: 800, fontSize: '32px', color: '#1a1a1a' }}>
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: '#666', margin: '0', fontSize: '15px' }}>Here's your health overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {[
          { label: 'Total Appointments', value: stats.total, icon: Calendar, color: '#667eea' },
          { label: 'Upcoming', value: stats.upcoming, icon: Clock, color: '#5DCAA5' },
          { label: 'Prescriptions', value: stats.prescriptions, icon: Pill, color: '#764ba2' },
          { label: 'Blood Group', value: user?.bloodGroup || '—', icon: Droplet, color: '#f64f59' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              border: '1px solid #f0f0f0',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: `${s.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: s.color,
                }}>
                  <Icon size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>{s.value}</div>
                </div>
              </div>
              <div style={{ color: '#666', fontSize: '13px', fontWeight: 600 }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {[
          { icon: '📅', title: 'Book Appointment', desc: 'Schedule a visit with a doctor', link: '/patient/book', color: '#667eea' },
          { icon: '💊', title: 'My Prescriptions', desc: 'View your medication history', link: '/patient/prescriptions', color: '#764ba2' },
          { icon: '🤖', title: 'AI Health Chat', desc: 'Ask VitalMind AI anything', link: null, color: '#5DCAA5' },
        ].map((a, i) => (
          <Link key={i} to={a.link || '#'}
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
              border: `2px solid ${a.color}20`,
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
              e.currentTarget.style.borderColor = a.color;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = `${a.color}20`;
            }}
            onClick={e => {
              if (!a.link) {
                e.preventDefault();
                document.querySelector('button[style*="bottom: 28px"]')?.click();
              }
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>{a.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '16px', color: '#1a1a1a', marginBottom: '6px' }}>{a.title}</div>
            <div style={{ color: '#666', fontSize: '13px', marginBottom: '12px' }}>{a.desc}</div>
            <div style={{ color: a.color, fontSize: '13px', fontWeight: 600, marginTop: 'auto' }}>
              {a.link ? 'Go →' : 'Click button →'}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Appointments */}
      {recent.length > 0 && (
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: '18px', color: '#1a1a1a' }}>📋 Recent Appointments</h3>
            <Link to="/patient/appointments" style={{ color: '#667eea', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
          </div>
          {recent.map(a => (
            <div key={a._id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0',
              borderBottom: '1px solid #f0f0f0',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px', color: '#1a1a1a', marginBottom: '4px' }}>
                  Dr. {a.doctor?.name || 'Unknown'}
                </div>
                <div style={{ color: '#666', fontSize: '13px' }}>
                  📅 {new Date(a.date).toLocaleDateString()} · ⏰ {a.timeSlot}
                </div>
              </div>
              <span style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                background: a.status === 'confirmed' ? '#d1fae5' : a.status === 'pending' ? '#fef3c7' : '#f3f4f6',
                color: a.status === 'confirmed' ? '#065f46' : a.status === 'pending' ? '#92400e' : '#374151',
              }}>
                {a.status?.charAt(0).toUpperCase() + a.status?.slice(1)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

