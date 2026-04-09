import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  if (!user) return null;

  const navItems = {
    admin: [
      { label: 'Dashboard', path: '/admin' },
      { label: 'Doctors', path: '/admin/manage-doctors' },
      { label: 'Patients', path: '/admin/manage-patients' },
      { label: 'Appointments', path: '/admin/appointments' },
      { label: 'Records', path: '/admin/records' },
    ],
    doctor: [
      { label: 'Dashboard', path: '/doctor' },
      { label: 'Schedule', path: '/doctor/schedule' },
      { label: 'Appointments', path: '/doctor/appointments' },
      { label: 'Prescriptions', path: '/doctor/prescriptions' },
    ],
    patient: [
      { label: 'Dashboard', path: '/patient' },
      { label: 'Book Appointment', path: '/patient/book-appointment' },
      { label: 'My Appointments', path: '/patient/appointments' },
      { label: 'Prescriptions', path: '/patient/prescriptions' },
    ],
  };

  const items = navItems[user.role] || [];

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Logo size={32} white />
        <span style={{
          color: 'white',
          fontSize: 18,
          fontWeight: 800,
        }}>VitalMind.ai</span>
      </div>

      {/* Desktop menu */}
      <div style={{
        display: 'none',
        '@media (min-width: 768px)': { display: 'flex' },
        gap: 8,
        alignItems: 'center',
      }}>
        {items.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              color: location.pathname === item.path ? 'white' : 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              background: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
            }}
            onMouseEnter={e => {
              if (location.pathname !== item.path) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseLeave={e => {
              if (location.pathname !== item.path) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* User menu */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '8px',
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>
            <div style={{
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
            }}>
              {user.name}
            </div>
            <div style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 11,
              textTransform: 'capitalize',
            }}>
              {user.role}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <LogOut size={16} />
          <span style={{ display: 'none', '@media (min-width: 768px)': { display: 'inline' } }}>
            Logout
          </span>
        </button>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'flex',
            '@media (min-width: 768px)': { display: 'none' },
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}>
          {items.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              style={{
                color: location.pathname === item.path ? 'white' : 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                padding: '12px 16px',
                borderRadius: '8px',
                background: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
