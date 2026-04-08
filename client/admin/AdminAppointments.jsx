import { useState, useEffect } from 'react';
import api from '../../api';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/appointments')
      .then(r => { setAppointments(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div className="spinner-border" style={{ color: '#667eea' }}></div>
    </div>
  );

  return (
    <div>
      <h4 style={{ fontWeight: 800, marginBottom: 8, color: '#1a1a2e' }}>📋 All Appointments</h4>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>System-wide appointment overview ({appointments.length} total)</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all','pending','confirmed','completed','cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: filter === f ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#f0f0f0', color: filter === f ? '#fff' : '#666' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? appointments.length : appointments.filter(a => a.status === f).length})
          </button>
        ))}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8f9ff' }}>
                {['Patient', 'Doctor', 'Date', 'Time', 'Reason', 'Status', 'Payment'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#555', borderBottom: '2px solid #e8e8e8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a._id} style={{ borderBottom: '1px solid #f0f0f0' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8f9ff'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{a.patient?.name}</td>
                  <td style={{ padding: '12px 16px', color: '#555' }}>Dr. {a.doctor?.name}</td>
                  <td style={{ padding: '12px 16px', color: '#555' }}>{new Date(a.date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px', color: '#555' }}>{a.timeSlot}</td>
                  <td style={{ padding: '12px 16px', color: '#777', maxWidth: 160 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{a.reason}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: a.status === 'confirmed' ? '#d1fae5' : a.status === 'pending' ? '#fef3c7' : a.status === 'completed' ? '#dbeafe' : '#fee2e2', color: a.status === 'confirmed' ? '#065f46' : a.status === 'pending' ? '#92400e' : a.status === 'completed' ? '#1e40af' : '#991b1b' }}>
                      {a.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: a.paymentStatus === 'paid' ? '#d1fae5' : '#fef3c7', color: a.paymentStatus === 'paid' ? '#065f46' : '#92400e' }}>
                      {a.paymentStatus === 'paid' ? `✓ $${a.amount}` : a.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>No appointments in this category.</div>
        )}
      </div>
    </div>
  );
}