import { useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import api from '../src/api';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// All possible time slots during the day
const TIME_SLOTS = [
  '08:00','08:30','09:00','09:30','10:00','10:30',
  '11:00','11:30','12:00','13:00','13:30',
  '14:00','14:30','15:00','15:30','16:00','16:30','17:00',
];

// Default slots when a doctor enables a day
const DEFAULT_SLOTS = ['09:00','09:30','10:00','10:30','11:00','14:00','14:30','15:00'];

export default function DoctorSchedule() {
  const { user } = useAuth();
  const [availability, setAvailability] = useState(user?.availability || []);
  const [fee, setFee] = useState(user?.consultationFee || 100);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Get active slots for a given day
  const getSlots = day => availability.find(d => d.day === day)?.slots || [];

  // Toggle a single time slot on/off for a day
  const toggleSlot = (day, slot) => {
    setAvailability(prev => {
      const entry = prev.find(d => d.day === day);
      if (!entry) return [...prev, { day, slots: [slot] }];
      const has = entry.slots.includes(slot);
      const updated = prev.map(d => d.day !== day ? d : {
        ...d, slots: has ? d.slots.filter(s => s !== slot) : [...d.slots, slot]
      });
      return updated.filter(d => d.slots.length > 0);
    });
  };

  // Toggle entire day on/off
  const toggleDay = day => {
    const existing = getSlots(day);
    if (existing.length > 0) {
      // Turn off — remove all slots for this day
      setAvailability(prev => prev.filter(d => d.day !== day));
    } else {
      // Turn on — add default slots
      setAvailability(prev => [...prev, { day, slots: [...DEFAULT_SLOTS] }]);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.patch('/users/profile', { availability, consultationFee: fee });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { alert('Failed to save schedule'); }
    setSaving(false);
  };

  return (
    <div>
      <h4 style={{ fontWeight: 800, marginBottom: 8, color: '#1a1a2e' }}>📅 My Schedule</h4>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Set your availability so patients can book appointments with you</p>

      {saved && (
        <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 10, padding: '12px 18px', marginBottom: 16, color: '#065f46', fontWeight: 600 }}>
          ✅ Schedule saved successfully!
        </div>
      )}

      {/* Consultation Fee */}
      <div className="card p-4 mb-4" style={{ maxWidth: 300 }}>
        <h6 style={{ fontWeight: 700, marginBottom: 12 }}>💰 Consultation Fee</h6>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#667eea' }}>$</span>
          <input type="number" min="0" value={fee} onChange={e => setFee(Number(e.target.value))}
            style={{ border: '1.5px solid #e0e0e0', borderRadius: 8, padding: '8px 12px', fontSize: 16, fontWeight: 700, outline: 'none', width: 100 }} />
          <span style={{ color: '#888', fontSize: 13 }}>per visit</span>
        </div>
      </div>

      {/* Schedule grid */}
      <div className="card p-4 mb-4">
        <h6 style={{ fontWeight: 700, marginBottom: 6 }}>Weekly Availability</h6>
        <p style={{ color: '#888', fontSize: 12, marginBottom: 20 }}>
          Click a day name to enable/disable it. Click time slots to customize.
        </p>
        {DAYS.map(day => {
          const activeSlots = getSlots(day);
          const dayOn = activeSlots.length > 0;
          return (
            <div key={day} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <button type="button" onClick={() => toggleDay(day)}
                  style={{ padding: '5px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, minWidth: 54, background: dayOn ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#f0f0f0', color: dayOn ? '#fff' : '#888' }}>
                  {day}
                </button>
                <span style={{ color: dayOn ? '#888' : '#bbb', fontSize: 12 }}>
                  {dayOn ? `${activeSlots.length} slots selected` : 'Not available'}
                </span>
              </div>
              {dayOn && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingLeft: 8 }}>
                  {TIME_SLOTS.map(slot => {
                    const active = activeSlots.includes(slot);
                    return (
                      <button key={slot} type="button" onClick={() => toggleSlot(day, slot)}
                        style={{ padding: '5px 12px', borderRadius: 16, border: active ? 'none' : '1.5px solid #e0e0e0', background: active ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#fff', color: active ? '#fff' : '#555', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={save} disabled={saving}
        style={{ background: 'linear-gradient(135deg,#5DCAA5,#667eea)', border: 'none', borderRadius: 10, padding: '13px 32px', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
        {saving ? '⏳ Saving...' : '💾 Save Schedule'}
      </button>
    </div>
  );
}