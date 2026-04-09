import { useState, useEffect } from 'react';
import api from '../src/api';

const EMPTY_MED = { name: '', dosage: '', frequency: '', duration: '', instructions: '' };

export default function WritePrescription() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [form, setForm] = useState({
    patientId: '', appointmentId: '',
    diagnosis: '',
    medications: [{ ...EMPTY_MED }],
    notes: '',
    followUpDate: '',
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only show confirmed/completed appointments (ready to prescribe)
    api.get('/appointments')
      .then(r => setAppointments(r.data.filter(a => a.status === 'confirmed' || a.status === 'completed')))
      .catch(() => {});
  }, []);

  const selectAppointment = apptId => {
    const appt = appointments.find(a => a._id === apptId);
    setSelectedAppt(appt);
    setForm(f => ({ ...f, appointmentId: apptId, patientId: appt?.patient?._id || '' }));
  };

  // Add a new empty medication row
  const addMed = () => setForm(f => ({ ...f, medications: [...f.medications, { ...EMPTY_MED }] }));

  // Remove a medication row by index
  const removeMed = i => setForm(f => ({ ...f, medications: f.medications.filter((_, idx) => idx !== i) }));

  // Update a specific field in a medication row
  const updateMed = (i, field, val) => setForm(f => {
    const meds = [...f.medications];
    meds[i] = { ...meds[i], [field]: val };
    return { ...f, medications: meds };
  });

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      await api.post('/prescriptions', form);
      setSuccess(true);
      // Reset form after save
      setForm({ patientId: '', appointmentId: '', diagnosis: '', medications: [{ ...EMPTY_MED }], notes: '', followUpDate: '' });
      setSelectedAppt(null);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) { alert(err.response?.data?.message || 'Failed to save prescription'); }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 8,
    padding: '9px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div>
      <h4 style={{ fontWeight: 800, marginBottom: 8, color: '#1a1a2e' }}>✍️ Write Prescription</h4>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Create a digital prescription for your patient</p>

      {success && (
        <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 10, padding: '14px 18px', marginBottom: 20, color: '#065f46', fontWeight: 600 }}>
          ✅ Prescription saved! Patient can now view it in their portal.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: 720 }}>

        {/* Section 1 — Select Appointment */}
        <div className="card p-4 mb-4">
          <h6 style={{ fontWeight: 700, marginBottom: 14 }}>1. Select Patient Appointment</h6>
          <select style={inputStyle} value={form.appointmentId} onChange={e => selectAppointment(e.target.value)} required>
            <option value="">Choose a patient appointment...</option>
            {appointments.map(a => (
              <option key={a._id} value={a._id}>
                {a.patient?.name} — {new Date(a.date).toLocaleDateString()} at {a.timeSlot} ({a.status})
              </option>
            ))}
          </select>
          {selectedAppt && (
            <div style={{ marginTop: 12, background: '#f8f9ff', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
              <strong>Patient:</strong> {selectedAppt.patient?.name} &nbsp;·&nbsp;
              Blood: {selectedAppt.patient?.bloodGroup || 'N/A'} &nbsp;·&nbsp;
              Reason: {selectedAppt.reason}
            </div>
          )}
        </div>

        {/* Section 2 — Diagnosis */}
        <div className="card p-4 mb-4">
          <h6 style={{ fontWeight: 700, marginBottom: 14 }}>2. Diagnosis</h6>
          <input style={inputStyle} value={form.diagnosis}
            onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))}
            placeholder="e.g., Hypertension, Type 2 Diabetes, Common Cold" required />
        </div>

        {/* Section 3 — Medications */}
        <div className="card p-4 mb-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h6 style={{ fontWeight: 700, margin: 0 }}>3. Medications</h6>
            <button type="button" onClick={addMed}
              style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', border: 'none', borderRadius: 8, padding: '6px 14px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              + Add Medication
            </button>
          </div>
          {form.medications.map((m, i) => (
            <div key={i} style={{ background: '#f8f9ff', borderRadius: 10, padding: '14px', marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: '#667eea' }}>Medication {i + 1}</span>
                {form.medications.length > 1 && (
                  <button type="button" onClick={() => removeMed(i)}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                <input style={inputStyle} placeholder="Medicine name *" value={m.name} onChange={e => updateMed(i, 'name', e.target.value)} required />
                <input style={inputStyle} placeholder="Dosage (10mg)" value={m.dosage} onChange={e => updateMed(i, 'dosage', e.target.value)} />
                <input style={inputStyle} placeholder="Freq (2x/day)" value={m.frequency} onChange={e => updateMed(i, 'frequency', e.target.value)} />
                <input style={inputStyle} placeholder="Duration (7 days)" value={m.duration} onChange={e => updateMed(i, 'duration', e.target.value)} />
              </div>
              <input style={inputStyle} placeholder="Special instructions (e.g., Take after meals)" value={m.instructions} onChange={e => updateMed(i, 'instructions', e.target.value)} />
            </div>
          ))}
        </div>

        {/* Section 4 — Notes and Follow-up */}
        <div className="card p-4 mb-4">
          <h6 style={{ fontWeight: 700, marginBottom: 14 }}>4. Notes & Follow-up</h6>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6, display: 'block' }}>Doctor's Notes</label>
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3}
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Lifestyle advice, warnings, additional instructions..." />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6, display: 'block' }}>Follow-up Date (optional)</label>
            <input type="date" style={{ ...inputStyle, width: 'auto', minWidth: 200 }}
              value={form.followUpDate} onChange={e => setForm(f => ({ ...f, followUpDate: e.target.value }))} />
          </div>
        </div>

        <button type="submit" disabled={loading}
          style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', border: 'none', borderRadius: 10, padding: '13px 32px', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          {loading ? '⏳ Saving...' : '💊 Save Prescription'}
        </button>
      </form>
    </div>
  );
}