import { useState, useEffect } from 'react';
import api from '../src/api';

const ROLE_STYLE = {
  admin:   { bg: '#1a1a2e', color: '#fff' },
  doctor:  { bg: '#dbeafe', color: '#1e40af' },
  patient: { bg: '#f3e8ff', color: '#7e22ce' },
};

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/users')
      .then(r => { setUsers(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Approve a pending user account
  const approve = async id => {
    await api.patch(`/users/${id}/approve`);
    setUsers(u => u.map(x => x._id === id ? { ...x, isApproved: true } : x));
  };

  // Delete a user permanently
  const deleteUser = async id => {
    if (!confirm('Are you sure? This cannot be undone.')) return;
    await api.delete(`/users/${id}`);
    setUsers(u => u.filter(x => x._id !== id));
  };

  // Filter by role/status and search term
  const filtered = users.filter(u => {
    const matchRole = filter === 'all' ? true
      : filter === 'pending' ? !u.isApproved
      : u.role === filter;
    const matchSearch = !search
      || u.name.toLowerCase().includes(search.toLowerCase())
      || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div className="spinner-border" style={{ color: '#667eea' }}></div>
    </div>
  );

  return (
    <div>
      <h4 style={{ fontWeight: 800, marginBottom: 8, color: '#1a1a2e' }}>👥 Manage Users</h4>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Approve doctors, manage all accounts</p>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="🔍 Search name or email..."
          style={{ border: '1.5px solid #e0e0e0', borderRadius: 8, padding: '8px 14px', fontSize: 13, outline: 'none', width: 260 }}
          value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { key: 'all', label: `All (${users.length})` },
            { key: 'doctor', label: `Doctors (${users.filter(u => u.role === 'doctor').length})` },
            { key: 'patient', label: `Patients (${users.filter(u => u.role === 'patient').length})` },
            { key: 'pending', label: `⚠️ Pending (${users.filter(u => !u.isApproved).length})` },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{ padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: filter === f.key ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#f0f0f0', color: filter === f.key ? '#fff' : '#666' }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8f9ff' }}>
                {['User', 'Email', 'Role', 'Specialization', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#555', borderBottom: '2px solid #e8e8e8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const rs = ROLE_STYLE[u.role] || ROLE_STYLE.patient;
                return (
                  <tr key={u._id} style={{ borderBottom: '1px solid #f0f0f0' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8f9ff'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#667eea,#764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: rs.bg, color: rs.color }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#777' }}>{u.specialization || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: u.isApproved ? '#d1fae5' : '#fef3c7', color: u.isApproved ? '#065f46' : '#92400e' }}>
                        {u.isApproved ? '● Active' : '⏳ Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {!u.isApproved && (
                          <button onClick={() => approve(u._id)}
                            style={{ background: 'linear-gradient(135deg,#5DCAA5,#667eea)', border: 'none', borderRadius: 6, padding: '5px 12px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                            ✅ Approve
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button onClick={() => deleteUser(u._id)}
                            style={{ background: 'none', border: '1.5px solid #fca5a5', borderRadius: 6, padding: '5px 12px', color: '#dc2626', fontSize: 12, cursor: 'pointer' }}>
                            🗑 Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>No users match your search.</div>
        )}
      </div>
    </div>
  );
}