import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Handles redirect after Google OAuth — reads token from URL params
export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const token = params.get('token');
    const role = params.get('role');
    if (token) { localStorage.setItem('token', token); navigate(`/${role}`); }
    else navigate('/login');
  }, []);
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0f0c29,#302b63)' }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
        <div className="spinner-border text-white"></div>
        <p style={{ marginTop: 12, opacity: 0.7 }}>Completing Google Sign In...</p>
      </div>
    </div>
  );
}