import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DoctorHome from './DoctorHome';
import DoctorAppointments from './DoctorAppointments';
import WritePrescription from './WritePrescription';
import DoctorSchedule from './DoctorSchedule';
import Logo from '../../components/Logo';

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const links = [
    { to: '/doctor', label: '🏠 Home', exact: true },
    { to: '/doctor/appointments', label: '📋 Appointments' },
    { to: '/doctor/prescribe', label: '✍️ Write Prescription' },
    { to: '/doctor/schedule', label: '📅 My Schedule' },
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
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👨‍⚕️</div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>Dr. {user?.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 }}>{user?.specialization || 'Doctor'}</div>
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
          <Route index element={<DoctorHome />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="prescribe" element={<WritePrescription />} />
          <Route path="schedule" element={<DoctorSchedule />} />
        </Routes>
      </div>
    </div>
  );
}