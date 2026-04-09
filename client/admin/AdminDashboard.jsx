import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import AdminHome from './AdminHome';
import ManageUsers from './ManageUsers';
import AdminAppointments from './AdminAppointments';
import ManageRecords from './ManageRecords';
import Logo from '../src/components/Logo';
import { Home, Users, Calendar, FileText, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: Home, exact: true },
    { to: '/admin/users', label: 'Manage Users', icon: Users },
    { to: '/admin/appointments', label: 'All Appointments', icon: Calendar },
    { to: '/admin/records', label: 'Medical Records', icon: FileText },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.2)',
        color: '#fff',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.2)', marginBottom: '24px' }}>
          <Logo size={40} />
          <div style={{ color: '#fff', fontWeight: 800, fontSize: '18px', marginTop: '10px', letterSpacing: '-0.5px' }}>VitalMind.ai</div>
          <p style={{ fontSize: '12px', opacity: 0.8, margin: '4px 0 0 0' }}>Admin Panel</p>
        </div>

        {/* User Profile */}
        <div style={{ textAlign: 'center', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.2)', marginBottom: '24px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            border: '2px solid rgba(255,255,255,0.3)',
          }}>🏥</div>
          <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{user?.name}</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            Administrator
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {links.map(l => {
            const Icon = l.icon;
            const isActive = l.exact ? pathname === l.to : pathname.startsWith(l.to);
            return (
              <Link key={l.to} to={l.to} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#fff',
                fontSize: '14px',
                fontWeight: isActive ? 700 : 500,
                background: isActive ? 'rgba(255,255,255,0.25)' : 'transparent',
                border: isActive ? '1px solid rgba(255,255,255,0.4)' : 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
              >
                <Icon size={18} />
                <span>{l.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button onClick={() => { logout(); navigate('/'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '12px',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '12px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Main content */}
      <div style={{
        marginLeft: '280px',
        flex: 1,
        padding: '40px',
        background: '#f8f9fa',
      }}>
        <Routes>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="records" element={<ManageRecords />} />
        </Routes>
      </div>
    </div>
  );
}