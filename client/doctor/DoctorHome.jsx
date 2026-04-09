import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import api from '../src/api';
import { Calendar, Clock, CheckCircle, Clock3, Users, FileText } from 'lucide-react';

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
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontWeight: 800, fontSize: '32px', color: '#1a1a1a' }}>
          Good day, Dr. {user?.name?.split(' ').slice(-1)[0]}! 🩺
        </h1>
        <p style={{ color: '#666', margin: '0', fontSize: '15px' }}>
          {user?.specialization} · Manage your patient schedule
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {[
          { label: 'Total Appointments', value: stats.total, icon: Calendar, color: '#667eea' },
          { label: "Today's Patients", value: stats.today, icon: Clock, color: '#5DCAA5' },
          { label: 'Awaiting Confirm', value: stats.pending, icon: Clock3, color: '#f59e0b' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: '#764ba2' },
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

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {[
          { icon: '📋', title: 'View Appointments', link: '/doctor/appointments', color: '#667eea', desc: 'Confirm and manage patient visits' },
          { icon: '✍️', title: 'Write Prescription', link: '/doctor/prescribe', color: '#5DCAA5', desc: 'Create digital prescriptions' },
          { icon: '📅', title: 'Manage Schedule', link: '/doctor/schedule', color: '#764ba2', desc: 'Set your available time slots' },
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

      {/* Today's Schedule */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: '18px', color: '#1a1a1a' }}>📋 Today's Schedule</h3>
          <Link to="/doctor/appointments" style={{ color: '#667eea', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
        </div>
        {todayAppts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 24px', color: '#666', fontSize: '15px' }}>
            🎉 No appointments today — enjoy your well-deserved break!
          </div>
        ) : todayAppts.map(a => (
          <div key={a._id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0',
            borderBottom: '1px solid #f0f0f0',
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
              }}>
                {a.patient?.name?.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px', color: '#1a1a1a', marginBottom: '4px' }}>{a.patient?.name}</div>
                <div style={{ color: '#666', fontSize: '13px' }}>⏰ {a.timeSlot} · {a.reason}</div>
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
    </div>
  );
}