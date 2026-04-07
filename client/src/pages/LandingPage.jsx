import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const FEATURES = [
  { icon: '📅', title: 'Smart Scheduling', desc: 'Book appointments with top doctors in under 60 seconds. Real-time slot availability.' },
  { icon: '🤖', title: 'AI Health Assistant', desc: 'Get instant answers to health questions powered by Claude AI, available 24/7.' },
  { icon: '💊', title: 'Digital Prescriptions', desc: 'Doctors write prescriptions digitally. Patients access them anytime, anywhere.' },
  { icon: '🔒', title: 'Secure Records', desc: 'All medical records encrypted and stored securely. You control your data.' },
  { icon: '💳', title: 'Easy Payments', desc: 'Pay consultation fees securely via Stripe with instant receipts.' },
  { icon: '👨‍⚕️', title: 'Expert Doctors', desc: 'Board-certified specialists across cardiology, neurology, pediatrics, and more.' },
];

const STATS = [
  { value: '10,000+', label: 'Patients Served' },
  { value: '500+', label: 'Expert Doctors' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '24/7', label: 'AI Support' },
];

const ROLES = [
  { icon: '🏥', title: 'Hospital Admin', color: '#667eea', grad: 'linear-gradient(135deg,#667eea,#764ba2)', featured: false, points: ['Approve & manage doctors','View all appointments','Upload medical records','Full system analytics'] },
  { icon: '👨‍⚕️', title: 'Doctor Portal', color: '#5DCAA5', grad: 'linear-gradient(135deg,#5DCAA5,#667eea)', featured: true, points: ['Manage your schedule','Confirm/complete appointments','Write digital prescriptions','View full patient history'] },
  { icon: '🧑‍💼', title: 'Patient Portal', color: '#764ba2', grad: 'linear-gradient(135deg,#764ba2,#f64f59)', featured: false, points: ['Book appointments online','Pay consultation fees','View all prescriptions','Chat with AI assistant'] },
];

export default function LandingPage() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, background: 'rgba(15,12,41,0.88)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo size={32} white />
          <span style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>VitalMind.ai</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14, fontWeight: 500, padding: '8px 16px' }}>Sign In</Link>
          <Link to="/register" style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600, padding: '9px 22px', borderRadius: 50, boxShadow: '0 4px 14px rgba(102,126,234,0.35)' }}>Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#1a1a3e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 40px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(102,126,234,0.15) 0%,transparent 70%)', top: '10%', left: '-10%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(93,202,165,0.12) 0%,transparent 70%)', bottom: '10%', right: '-5%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 780 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(102,126,234,0.15)', border: '1px solid rgba(102,126,234,0.3)', borderRadius: 50, padding: '6px 16px', marginBottom: 28 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#5DCAA5', display: 'inline-block' }}></span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500 }}>AI-Powered Healthcare Platform · INFO 6150</span>
          </div>

          <h1 style={{ color: '#fff', fontSize: 'clamp(36px,6vw,68px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 24px', letterSpacing: '-1px' }}>
            Healthcare,{' '}
            <span style={{ background: 'linear-gradient(135deg,#667eea,#5DCAA5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>reimagined</span>
            <br />for the digital age
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 18, lineHeight: 1.7, margin: '0 0 40px', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Connect patients, doctors, and hospitals in one intelligent platform. Book appointments, manage prescriptions, and get AI health guidance — all in one place.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <Link to="/register" style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 700, padding: '16px 36px', borderRadius: 50, boxShadow: '0 8px 28px rgba(102,126,234,0.45)' }}>🚀 Get Started Free</Link>
            <Link to="/login" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 600, padding: '16px 36px', borderRadius: 50 }}>Sign In →</Link>
          </div>

          {/* Demo credentials box */}
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '16px 24px', display: 'inline-block', textAlign: 'left' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: '0 0 8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Demo Accounts</p>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { role: 'Admin', email: 'admin@vitalmind.ai', pass: 'Admin@123', color: '#667eea' },
                { role: 'Doctor', email: 'doctor@vitalmind.ai', pass: 'Doctor@123', color: '#5DCAA5' },
                { role: 'Patient', email: 'patient@vitalmind.ai', pass: 'Patient@123', color: '#764ba2' },
              ].map(d => (
                <div key={d.role}>
                  <span style={{ color: d.color, fontWeight: 700, fontSize: 12 }}>{d.role}:</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}> {d.email} / {d.pass}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', padding: '48px 40px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ color: '#fff', fontSize: 36, fontWeight: 900 }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 40px', background: '#f8f9ff' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, color: '#1a1a2e', marginBottom: 14 }}>Everything you need</h2>
            <p style={{ color: '#666', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>One platform for patients, doctors, and hospitals.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', boxShadow: '0 2px 16px rgba(102,126,234,0.08)', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(102,126,234,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 16px rgba(102,126,234,0.08)'; }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: '#777', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section style={{ padding: '80px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, color: '#1a1a2e', marginBottom: 14 }}>Built for every role</h2>
            <p style={{ color: '#666', fontSize: 17 }}>Tailored portals for every type of user.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {ROLES.map(r => (
              <div key={r.title} style={{ background: r.featured ? r.grad : '#fff', borderRadius: 20, padding: '32px 26px', boxShadow: r.featured ? '0 12px 48px rgba(102,126,234,0.3)' : '0 2px 16px rgba(0,0,0,0.06)', transform: r.featured ? 'scale(1.04)' : 'none', border: r.featured ? 'none' : '2px solid #f0f0f0' }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>{r.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: r.featured ? '#fff' : '#1a1a2e', marginBottom: 16 }}>{r.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24 }}>
                  {r.points.map(p => (
                    <li key={p} style={{ color: r.featured ? 'rgba(255,255,255,0.85)' : '#555', fontSize: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: r.featured ? '#fff' : r.color, fontWeight: 700 }}>✓</span> {p}
                    </li>
                  ))}
                </ul>
                <Link to="/register" style={{ display: 'block', textAlign: 'center', background: r.featured ? 'rgba(255,255,255,0.2)' : r.grad, color: '#fff', border: r.featured ? '2px solid rgba(255,255,255,0.4)' : 'none', padding: '11px', borderRadius: 50, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
                  Get started →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '72px 40px', background: '#f8f9ff' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#1a1a2e', marginBottom: 40 }}>Trusted by thousands</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[
              { name: 'Sarah M.', role: 'Patient', text: 'Booking an appointment used to take me 30 minutes on the phone. Now it takes 30 seconds. Game changer!', avatar: '👩' },
              { name: 'Dr. James K.', role: 'Cardiologist', text: 'The prescription system saves me at least an hour a day. Patients see their medications instantly after consultation.', avatar: '👨‍⚕️' },
              { name: 'Admin Team', role: 'Hospital Admin', text: 'Managing 50+ doctors and thousands of patients used to be chaos. VitalMind makes it simple.', avatar: '🏥' },
            ].map(t => (
              <div key={t.name} style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', textAlign: 'left' }}>
                <div style={{ fontSize: 22, marginBottom: 8, color: '#f59e0b' }}>★★★★★</div>
                <p style={{ color: '#444', fontSize: 14, lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{t.avatar}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>{t.name}</div>
                    <div style={{ color: '#999', fontSize: 12 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg,#667eea,#5DCAA5)', padding: '80px 40px', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: 40, fontWeight: 900, marginBottom: 16 }}>Ready to transform healthcare?</h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, marginBottom: 36 }}>Join thousands of patients and doctors already using VitalMind.ai</p>
        <Link to="/register" style={{ background: '#fff', color: '#667eea', padding: '16px 44px', borderRadius: 50, fontWeight: 800, fontSize: 16, textDecoration: 'none', boxShadow: '0 8px 28px rgba(0,0,0,0.15)', display: 'inline-block' }}>
          Create your free account →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a1a2e', padding: '40px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={28} white />
            <span style={{ color: '#fff', fontSize: 17, fontWeight: 800 }}>VitalMind.ai</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>© 2026 VitalMind.ai — Intelligent Healthcare Management</span>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>Built with ♥ for INFO 6150</span>
        </div>
      </footer>
    </div>
  );
}