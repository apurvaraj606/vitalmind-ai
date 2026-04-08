import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function DoctorHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, today: 0, pending: 0, completed: 0 });
  const [todayAppts, setTodayAppts] = useState([]);

  useEffect(() => {
    api.get('/appointments').then(r => {
      const appts = r.data;
      const todayStr = new Date().toDateString();
      const today = appts.filter(a => new Date(a.date).toDateString() === todayStr);
      setStats({
        total: appts.length,
        today: today.length,
        pending: appts.filter(a => a.status === 'pending').length,
        completed: appts.filter(a => a.status === 'completed').length,
      });
      setTodayAppts(today.slice(0, 5));
    }).catch(() => {});
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h4 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: '#1a1a2e' }}>
          Good day, Dr. {user?.name?.split(' ').slice(-1)[0]}! 🩺
        </h4>
        <p style={{ color: '#888', marginTop: 4, fontSize: 14 }}>{user?.specialization} · {user?.department || 'General'}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Appointments', value: stats.total, icon: '📅', color: '#667eea' },
          { label: "Today's Patients", value: stats.today, icon: '📆', color: '#5DCAA5' },
          { label: 'Awaiting Confirm', value: stats.pending, icon: '⏳', color: '#f59e0b' },
          { label: 'Completed', value: stats.completed, icon: '✅', color: '#764ba2' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { icon: '📋', title: 'View Appointments', link: '/doctor/appointments', color: '#667eea', desc: 'Confirm and manage patient visits' },
          { icon: '✍️', title: 'Write Prescription', link: '/doctor/prescribe', color: '#5DCAA5', desc: 'Create digital prescriptions' },
          { icon: '📅', title: 'Manage Schedule', link: '/doctor/schedule', color: '#764ba2', desc: 'Set your available time slots' },
        ].map(q => (
          <Link key={q.title} to={q.link} style={{ textDecoration: 'none' }}>
            <div className="card p-3" style={{ borderTop: `4px solid ${q.color}`, cursor: 'pointer' }}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>{q.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginBottom: 4 }}>{q.title}</div>
              <div style={{ color: '#888', fontSize: 12 }}>{q.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="card p-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h6 style={{ margin: 0, fontWeight: 700 }}>Today's Schedule</h6>
          <Link to="/doctor/appointments" style={{ color: '#667eea', fontSize: 13, textDecoration: 'none' }}>View all →</Link>
        </div>
        {todayAppts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#888', fontSize: 14 }}>
            🎉 No appointments today — enjoy your day!
          </div>
        ) : todayAppts.map(a => (
          <div key={a._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.patient?.name}</div>
                <div style={{ color: '#888', fontSize: 12 }}>{a.timeSlot} · {a.reason}</div>
              </div>
            </div>
            <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: a.status === 'confirmed' ? '#d1fae5' : '#fef3c7', color: a.status === 'confirmed' ? '#065f46' : '#92400e' }}>
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}