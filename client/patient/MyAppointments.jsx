import { useState, useEffect } from 'react';
import api from '../../api';

// Status badge styles
const STATUS = {
  pending:   { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
  confirmed: { bg: '#d1fae5', color: '#065f46', label: 'Confirmed' },
  completed: { bg: '#dbeafe', color: '#1e40af', label: 'Completed' },
  cancelled: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' },
};

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/appointments')
      .then(r => { setAppointments(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cancel = async id => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    await api.patch(`/appointments/${id}/cancel`);
    setAppointments(a => a.map(x => x._id === id ? { ...x, status: 'cancelled' } : x));
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div className="spinner-border" style={{ color: '#667eea' }}></div>
    </div>
  );

  return (
    <div>
      <h4 style={{ fontWeight: 800, marginBottom: 8, color: '#1a1a2e' }}>🗓️ My Appointments</h4>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Track all your healthcare visits</p>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all','pending','confirmed','completed','cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: filter === f ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#f0f0f0', color: filter === f ? '#fff' : '#666' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: 14 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <div style={{ fontWeight: 600, color: '#888' }}>No appointments found</div>
          <a href="/patient/book" style={{ color: '#667eea', display: 'block', marginTop: 8, fontSize: 14 }}>Book your first appointment →</a>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {filtered.map(a => {
            const s = STATUS[a.status] || STATUS.pending;
            return (
              <div key={a._id} className="card p-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#667eea,#764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff', flexShrink: 0 }}>👨‍⚕️</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>Dr. {a.doctor?.name}</div>
                      <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>{a.doctor?.specialization}</div>
                      <div style={{ marginTop: 6, fontSize: 13, color: '#555' }}>
                        📅 {new Date(a.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {a.timeSlot}
                      </div>
                      <div style={{ fontSize: 13, color: '#777', marginTop: 3 }}>Reason: {a.reason}</div>
                      {a.notes && <div style={{ fontSize: 12, color: '#888', marginTop: 3, fontStyle: 'italic' }}>📝 Doctor's note: {a.notes}</div>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>{s.label}</span>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, background: a.paymentStatus === 'paid' ? '#d1fae5' : '#fef3c7', color: a.paymentStatus === 'paid' ? '#065f46' : '#92400e', fontWeight: 600 }}>
                      💳 {a.paymentStatus}
                    </span>
                    {(a.status === 'pending' || a.status === 'confirmed') && (
                      <button onClick={() => cancel(a._id)}
                        style={{ background: 'none', border: '1px solid #fca5a5', borderRadius: 6, padding: '4px 10px', color: '#dc2626', fontSize: 12, cursor: 'pointer' }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}