import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import AdminHome from './AdminHome';
import ManageUsers from './ManageUsers';
import AdminAppointments from './AdminAppointments';
import ManageRecords from './ManageRecords';
import Logo from '../src/components/Logo';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const links = [
    { to: '/admin', label: '🏠 Dashboard', exact: true },
    { to: '/admin/users', label: '👥 Manage Users' },
    { to: '/admin/appointments', label: '📋 All Appointments' },
    { to: '/admin/records', label: '📁 Medical Records' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="sidebar">
        <div style={{ textAlign: 'center', padding: '0 16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 12 }}>
          <Logo size={34} white />
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 13, marginTop: 8 }}>VitalMind.ai</div>
        </div>
        <div style={{ padding: '10px 0', textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏥</div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{user?.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 }}>Hospital Administrator</div>
        </div>
        <nav style={{ flex: 1, marginTop: 8 }}>
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`nav-link ${(l.exact ? pathname === l.to : pathname.startsWith(l.to)) ? 'active' : ''}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '0 12px' }}>
          <button onClick={() => { logout(); navigate('/'); }}
            style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '9px', color: '#fff', cursor: 'pointer', fontSize: 13 }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="dashboard-main">
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