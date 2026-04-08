import { useState, useEffect } from 'react';
import api from '../src/api';

export default function MyPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/prescriptions')
      .then(r => { setPrescriptions(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div className="spinner-border" style={{ color: '#667eea' }}></div>
    </div>
  );

  return (
    <div>
      <h4 style={{ fontWeight: 800, marginBottom: 8, color: '#1a1a2e' }}>💊 My Prescriptions</h4>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>All prescriptions written by your doctors</p>

      {prescriptions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: 14 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💊</div>
          <div style={{ fontWeight: 600, color: '#888' }}>No prescriptions yet</div>
          <div style={{ color: '#aaa', fontSize: 13, marginTop: 6 }}>Your doctor will add prescriptions after your appointment</div>
        </div>
      ) : prescriptions.map(p => (
        <div key={p._id} className="card p-4 mb-3">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#5DCAA5,#667eea)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👨‍⚕️</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Dr. {p.doctor?.name}</div>
                <div style={{ color: '#888', fontSize: 12 }}>{p.doctor?.specialization}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: '#888' }}>{new Date(p.createdAt).toLocaleDateString()}</div>
              {p.followUpDate && <div style={{ fontSize: 11, color: '#667eea', marginTop: 2 }}>
                Follow-up: {new Date(p.followUpDate).toLocaleDateString()}
              </div>}
            </div>
          </div>

          {/* Diagnosis */}
          <div style={{ background: '#f8f9ff', borderRadius: 10, padding: '12px 16px', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#667eea', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Diagnosis</div>
            <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{p.diagnosis}</div>
          </div>

          {/* Medications table */}
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: '#444' }}>Medications</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8f9ff' }}>
                  {['Medicine', 'Dosage', 'Frequency', 'Duration', 'Instructions'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#555', borderBottom: '1px solid #e8e8e8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {p.medications?.map((m, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600, color: '#1a1a2e' }}>{m.name}</td>
                    <td style={{ padding: '8px 12px', color: '#555' }}>{m.dosage || '—'}</td>
                    <td style={{ padding: '8px 12px', color: '#555' }}>{m.frequency || '—'}</td>
                    <td style={{ padding: '8px 12px', color: '#555' }}>{m.duration || '—'}</td>
                    <td style={{ padding: '8px 12px', color: '#777', fontSize: 12 }}>{m.instructions || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {p.notes && <div style={{ marginTop: 10, fontSize: 12, color: '#888', fontStyle: 'italic' }}>📝 {p.notes}</div>}
        </div>
      ))}
    </div>
  );
}