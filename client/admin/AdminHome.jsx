import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../src/api';
import { Users, User, UserCheck, Calendar, Clock, DollarSign } from 'lucide-react';

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
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontWeight: 800, fontSize: '32px', color: '#1a1a1a' }}>
          🏥 Hospital Dashboard
        </h1>
        <p style={{ color: '#666', margin: '0', fontSize: '15px' }}>System overview and management controls</p>
      </div>

      {/* Stats Grid 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        {[
          { label: 'Total Users', value: stats.users, icon: Users, color: '#667eea', sub: 'Registered accounts' },
          { label: 'Active Doctors', value: stats.doctors, icon: UserCheck, color: '#5DCAA5', sub: 'Approved physicians' },
          { label: 'Patients', value: stats.patients, icon: User, color: '#764ba2', sub: 'Active patients' },
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#1a1a1a', marginTop: '8px', marginBottom: '4px' }}>{s.label}</div>
                  <div style={{ color: '#999', fontSize: '12px' }}>{s.sub}</div>
                </div>
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
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Grid 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {[
          { label: 'Total Appointments', value: stats.appointments, icon: Calendar, color: '#f59e0b' },
          { label: 'Pending Approvals', value: stats.pending, icon: Clock, color: '#dc2626' },
          { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: '#10b981' },
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

      {/* Pending Approvals Alert */}
      {pendingUsers.length > 0 && (
        <div style={{
          background: '#fff5f5',
          border: '2px solid #dc262630',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '40px',
          boxShadow: '0 4px 15px rgba(220, 38, 38, 0.1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '24px' }}>⚠️</div>
              <h3 style={{ margin: 0, fontWeight: 700, color: '#dc2626', fontSize: '16px' }}>Pending Approvals ({stats.pending})</h3>
            </div>
            <Link to="/admin/users" style={{ color: '#667eea', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>Manage all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingUsers.map(u => (
              <div key={u._id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: '#fff',
                borderRadius: '12px',
                borderLeft: '4px solid #dc2626',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#1a1a1a', marginBottom: '4px' }}>{u.name}</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>{u.email} · <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{u.role}</span></div>
                </div>
                <span style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: '#fef3c7',
                  color: '#92400e',
                }}>
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {[
          { icon: '👥', title: 'Manage Users', link: '/admin/users', desc: 'Approve, view, delete users', color: '#667eea' },
          { icon: '📋', title: 'All Appointments', link: '/admin/appointments', desc: 'View all system appointments', color: '#5DCAA5' },
          { icon: '📁', title: 'Medical Records', link: '/admin/records', desc: 'Upload and manage records', color: '#764ba2' },
        ].map(q => (
          <Link key={q.title} to={q.link} style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            border: `2px solid ${q.color}20`,
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
            e.currentTarget.style.borderColor = q.color;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = `${q.color}20`;
          }}
          >
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>{q.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '16px', color: '#1a1a1a', marginBottom: '6px' }}>{q.title}</div>
            <div style={{ color: '#666', fontSize: '13px' }}>{q.desc}</div>
            <div style={{ color: q.color, fontSize: '13px', fontWeight: 600, marginTop: 'auto', marginTop: '12px' }}>
              Go →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}