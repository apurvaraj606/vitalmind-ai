import { useState, useEffect } from 'react';
import api from '../../api';

const RECORD_COLORS = { lab_result: '#dbeafe', imaging: '#fce7f3', prescription: '#d1fae5', report: '#fef3c7', other: '#f3f4f6' };
const RECORD_TEXT =   { lab_result: '#1e40af', imaging: '#9d174d', prescription: '#065f46', report: '#92400e', other: '#374151' };

export default function ManageRecords() {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ patientId: '', title: '', description: '', recordType: 'report' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fileError, setFileError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/records'), api.get('/users')])
      .then(([r, u]) => {
        setRecords(r.data);
        setPatients(u.data.filter(x => x.role === 'patient'));
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const handleFileChange = e => {
    const selected = e.target.files[0];
    setFileError('');
    if (selected) {
      // Client-side file type validation (backend also validates)
      const allowed = ['image/jpeg','image/png','image/gif','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowed.includes(selected.type)) {
        setFileError('Invalid file type. Only PDF, images (JPG/PNG), and Word documents allowed.');
        setFile(null);
        return;
      }
      if (selected.size > 10 * 1024 * 1024) {
        setFileError('File too large. Maximum size is 10MB.');
        setFile(null);
        return;
      }
      setFile(selected);
    }
  };

  const handleUpload = async e => {
    e.preventDefault();
    if (fileError) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('file', file);
      const { data } = await api.post('/records', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setRecords(r => [data, ...r]);
      setForm({ patientId: '', title: '', description: '', recordType: 'report' });
      setFile(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { alert(err.response?.data?.message || 'Upload failed'); }
    setUploading(false);
  };

  const deleteRecord = async id => {
    if (!confirm('Delete this record permanently?')) return;
    await api.delete(`/records/${id}`);
    setRecords(r => r.filter(x => x._id !== id));
  };

  const inputStyle = { width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <div className="spinner-border" style={{ color: '#667eea' }}></div>
    </div>
  );

  return (
    <div>
      <h4 style={{ fontWeight: 800, marginBottom: 8, color: '#1a1a2e' }}>📁 Medical Records</h4>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Upload and manage patient medical records and files</p>

      {/* Upload Form */}
      <div className="card p-4 mb-4">
        <h6 style={{ fontWeight: 700, marginBottom: 16 }}>📤 Upload New Record</h6>
        {success && <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#065f46', fontWeight: 600 }}>✅ Record uploaded successfully!</div>}
        <form onSubmit={handleUpload}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>Patient *</label>
              <select style={inputStyle} value={form.patientId} onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))} required>
                <option value="">Select patient...</option>
                {patients.map(p => <option key={p._id} value={p._id}>{p.name} ({p.email})</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>Record Type *</label>
              <select style={inputStyle} value={form.recordType} onChange={e => setForm(f => ({ ...f, recordType: e.target.value }))}>
                {[
                  { v: 'lab_result', l: 'Lab Result' },
                  { v: 'imaging', l: 'Imaging (X-Ray/MRI)' },
                  { v: 'prescription', l: 'Prescription' },
                  { v: 'report', l: 'Medical Report' },
                  { v: 'other', l: 'Other' },
                ].map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>Title *</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g., Blood Test Results — March 2026" required />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>
                Attach File <span style={{ color: '#aaa', fontWeight: 400 }}>(PDF, JPG, PNG, Word · max 10MB)</span>
              </label>
              <input type="file" style={inputStyle} onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx" />
              {fileError && <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>⚠️ {fileError}</div>}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#444', display: 'block', marginBottom: 5 }}>Description</label>
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2}
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of the record..." />
          </div>
          <button type="submit" disabled={uploading || !!fileError}
            style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', border: 'none', borderRadius: 8, padding: '10px 24px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {uploading ? '⏳ Uploading...' : '📤 Upload Record'}
          </button>
        </form>
      </div>

      {/* Records Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8f9ff' }}>
                {['Title', 'Patient', 'Type', 'Uploaded By', 'Date', 'File', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#555', borderBottom: '2px solid #e8e8e8' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r._id} style={{ borderBottom: '1px solid #f0f0f0' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8f9ff'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{r.title}</td>
                  <td style={{ padding: '12px 16px', color: '#555' }}>{r.patient?.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: RECORD_COLORS[r.recordType] || '#f3f4f6', color: RECORD_TEXT[r.recordType] || '#374151' }}>
                      {r.recordType?.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#555' }}>{r.uploadedBy?.name}</td>
                  <td style={{ padding: '12px 16px', color: '#777' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {r.fileUrl
                      ? <a href={`http://localhost:5000${r.fileUrl}`} target="_blank" rel="noreferrer" style={{ color: '#667eea', fontWeight: 600, fontSize: 12, textDecoration: 'none' }}>📄 View</a>
                      : <span style={{ color: '#bbb', fontSize: 12 }}>No file</span>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => deleteRecord(r._id)}
                      style={{ background: 'none', border: '1.5px solid #fca5a5', borderRadius: 6, padding: '4px 10px', color: '#dc2626', fontSize: 12, cursor: 'pointer' }}>
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {records.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>No records yet. Upload the first one!</div>
          )}
        </div>
      </div>
    </div>
  );
}