import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import api from '../src/api';

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
      <div style={{ marginBottom: 28 }}>
        <h4 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: '#1a1a2e' }}>
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h4>
        <p style={{ color: '#888', marginTop: 4, fontSize: 14 }}>Here's your health overview for today.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Appointments', value: stats.total, icon: '📅', color: '#667eea' },
          { label: 'Upcoming', value: stats.upcoming, icon: '⏰', color: '#5DCAA5' },
          { label: 'Prescriptions', value: stats.prescriptions, icon: '💊', color: '#764ba2' },
          { label: 'Blood Group', value: user?.bloodGroup || '—', icon: '🩸', color: '#f64f59' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { icon: '📅', title: 'Book Appointment', desc: 'Schedule a visit with a doctor', link: '/patient/book', color: '#667eea' },
          { icon: '💊', title: 'My Prescriptions', desc: 'View your medication history', link: '/patient/prescriptions', color: '#764ba2' },
          { icon: '🤖', title: 'AI Health Chat', desc: 'Ask VitalMind AI anything', link: null, color: '#5DCAA5' },
        ].map((a, i) => (
          <div key={i} className="card p-3"
            style={{ cursor: 'pointer', borderTop: `4px solid ${a.color}` }}
            onClick={() => a.link ? window.location.href = a.link : document.querySelector('button[style*="bottom: 28px"]')?.click()}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{a.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e', marginBottom: 4 }}>{a.title}</div>
            <div style={{ color: '#888', fontSize: 12 }}>{a.desc}</div>
            {a.link && <Link to={a.link} style={{ color: a.color, fontSize: 13, marginTop: 8, display: 'block', textDecoration: 'none', fontWeight: 600 }}>Go →</Link>}
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      {recent.length > 0 && (
        <div className="card p-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h6 style={{ margin: 0, fontWeight: 700 }}>Recent Appointments</h6>
            <Link to="/patient/appointments" style={{ color: '#667eea', fontSize: 13, textDecoration: 'none' }}>View all →</Link>
          </div>
          {recent.map(a => (
            <div key={a._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Dr. {a.doctor?.name}</div>
                <div style={{ color: '#888', fontSize: 12 }}>{new Date(a.date).toLocaleDateString()} · {a.timeSlot}</div>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: a.status === 'confirmed' ? '#d1fae5' : a.status === 'pending' ? '#fef3c7' : '#f3f4f6', color: a.status === 'confirmed' ? '#065f46' : a.status === 'pending' ? '#92400e' : '#374151' }}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

