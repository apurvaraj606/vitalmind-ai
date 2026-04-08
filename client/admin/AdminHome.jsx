import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function AdminHome() {
  const [stats, setStats] = useState({ users: 0, doctors: 0, patients: 0, appointments: 0, pending: 0, revenue: 0 });
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    // Load users and appointments in parallel for dashboard stats
    Promise.all([api.get('/users'), api.get('/appointments')])
      .then(([u, a]) => {
        const users = u.data;
        const appts = a.data;
        // Calculate total revenue from paid appointments
        const revenue = appts
          .filter(x => x.paymentStatus === 'paid')
          .reduce((sum, x) => sum + (x.amount || 0), 0);
        setStats({
          users: users.length,
          doctors: users.filter(x => x.role === 'doctor').length,
          patients: users.filter(x => x.role === 'patient').length,
          appointments: appts.length,
          pending: users.filter(x => !x.isApproved).length,
          revenue,
        });
        setPendingUsers(users.filter(x => !x.isApproved).slice(0, 4));
      }).catch(() => {});
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h4 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: '#1a1a2e' }}>🏥 Hospital Dashboard</h4>
        <p style={{ color: '#888', marginTop: 4, fontSize: 14 }}>System overview and management controls</p>
      </div>

      {/* Stats row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 16 }}>
        {[
          { label: 'Total Users', value: stats.users, icon: '👥', color: '#667eea', sub: 'Registered accounts' },
          { label: 'Active Doctors', value: stats.doctors, icon: '👨‍⚕️', color: '#5DCAA5', sub: 'Approved physicians' },
          { label: 'Patients', value: stats.patients, icon: '🧑', color: '#764ba2', sub: 'Active patients' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginTop: 2 }}>{s.label}</div>
                <div style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>{s.sub}</div>
              </div>
              <div style={{ fontSize: 36 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Appointments', value: stats.appointments, icon: '📅', color: '#f59e0b' },
          { label: 'Pending Approvals', value: stats.pending, icon: '⏳', color: '#dc2626' },
          { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: '💰', color: '#10b981' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pending Approvals alert */}
      {pendingUsers.length > 0 && (
        <div className="card p-4 mb-4" style={{ borderLeft: '4px solid #dc2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h6 style={{ margin: 0, fontWeight: 700, color: '#dc2626' }}>⚠️ Pending Approvals ({stats.pending})</h6>
            <Link to="/admin/users" style={{ color: '#667eea', fontSize: 13, textDecoration: 'none' }}>Manage all →</Link>
          </div>
          {pendingUsers.map(u => (
            <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                <div style={{ color: '#888', fontSize: 12 }}>{u.email} · {u.role}</div>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#fef3c7', color: '#92400e' }}>Pending</span>
            </div>
          ))}
        </div>
      )}

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {[
          { icon: '👥', title: 'Manage Users', link: '/admin/users', desc: 'Approve, view, delete users', color: '#667eea' },
          { icon: '📋', title: 'All Appointments', link: '/admin/appointments', desc: 'View all system appointments', color: '#5DCAA5' },
          { icon: '📁', title: 'Medical Records', link: '/admin/records', desc: 'Upload and manage records', color: '#764ba2' },
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
    </div>
  );
}