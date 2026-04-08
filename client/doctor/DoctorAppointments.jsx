import { useState, useEffect } from 'react';
import api from '../src/api';

const STATUS = {
  pending:   { bg: '#fef3c7', color: '#92400e' },
  confirmed: { bg: '#d1fae5', color: '#065f46' },
  completed: { bg: '#dbeafe', color: '#1e40af' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
};

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({}); // stores doctor notes per appointment id
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/appointments')
      .then(r => { setAppointments(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/appointments/${id}/status`, { status, notes: notes[id] || '' });
    setAppointments(a => a.map(x => x._id === id ? { ...x, status, notes: notes[id] || x.notes } : x));
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div className="spinner-border" style={{ color: '#667eea' }}></div>
    </div>
  );

  return (
    <div>
      <h4 style={{ fontWeight: 800, marginBottom: 8, color: '#1a1a2e' }}>📋 Patient Appointments</h4>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Manage and respond to appointment requests</p>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all','pending','confirmed','completed','cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: filter === f ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#f0f0f0', color: filter === f ? '#fff' : '#666' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? appointments.length : appointments.filter(a => a.status === f).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: 14 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <div style={{ fontWeight: 600, color: '#888' }}>No appointments in this category</div>
        </div>
      ) : filtered.map(a => {
        const s = STATUS[a.status] || STATUS.pending;
        return (
          <div key={a._id} className="card p-4 mb-3">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              {/* Patient info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f0f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{a.patient?.name}</div>
                    <div style={{ color: '#888', fontSize: 12 }}>
                      {a.patient?.email}{a.patient?.bloodGroup ? ` · Blood: ${a.patient?.bloodGroup}` : ''}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: '#555', marginBottom: 4 }}>
                  📅 {new Date(a.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} at <strong>{a.timeSlot}</strong>
                </div>
                <div style={{ fontSize: 13, color: '#777', marginBottom: 10 }}>Reason: {a.reason}</div>
                {/* Notes input */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#444', marginBottom: 4, display: 'block' }}>Doctor's Notes</label>
                  <textarea rows={2} placeholder="Add notes for the patient..."
                    style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 8, padding: '8px 10px', fontSize: 13, resize: 'none', outline: 'none' }}
                    value={notes[a._id] !== undefined ? notes[a._id] : (a.notes || '')}
                    onChange={e => setNotes(n => ({ ...n, [a._id]: e.target.value }))} />
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, minWidth: 140 }}>
                <span style={{ padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>
                  {a.status.toUpperCase()}
                </span>
                {a.status === 'pending' && (
                  <button onClick={() => updateStatus(a._id, 'confirmed')}
                    style={{ background: 'linear-gradient(135deg,#5DCAA5,#667eea)', border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                    ✅ Confirm
                  </button>
                )}
                {a.status === 'confirmed' && (
                  <button onClick={() => updateStatus(a._id, 'completed')}
                    style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                    ✔ Mark Complete
                  </button>
                )}
                {(a.status === 'pending' || a.status === 'confirmed') && (
                  <button onClick={() => updateStatus(a._id, 'cancelled')}
                    style={{ background: 'none', border: '1.5px solid #fca5a5', borderRadius: 8, padding: '7px 16px', color: '#dc2626', fontSize: 12, cursor: 'pointer', width: '100%' }}>
                    ❌ Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}