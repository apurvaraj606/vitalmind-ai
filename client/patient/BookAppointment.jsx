import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../src/api';

// Load Stripe with publishable key from environment variable
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey || publishableKey.includes('undefined')) {
  console.error('⚠️ Stripe publishable key is not configured. Check your .env file.');
}

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

// Stripe payment form component
function PaymentForm({ appt, clientSecret, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async e => {
    e.preventDefault(); setLoading(true); setError('');
    const { error: sErr, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });
    if (sErr) { setError(sErr.message); setLoading(false); return; }
    if (paymentIntent.status === 'succeeded') {
      // Confirm on backend — updates appointment status to confirmed + paid
      await api.post('/payments/confirm', { appointmentId: appt._id });
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="card p-4" style={{ maxWidth: 480 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#667eea,#764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💳</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Secure Payment</div>
          <div style={{ color: '#888', fontSize: 13 }}>Amount: <strong style={{ color: '#667eea' }}>${appt.amount}</strong></div>
        </div>
      </div>
      <form onSubmit={handlePay}>
        <div style={{ border: '1.5px solid #e0e0e0', borderRadius: 10, padding: '14px', marginBottom: 14 }}>
          <CardElement options={{ style: { base: { fontSize: '15px', color: '#1a1a2e', fontFamily: 'Inter,sans-serif' } } }} />
        </div>
        {error && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 10 }}>⚠️ {error}</div>}
        <div style={{ background: '#f8f9ff', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#888', marginBottom: 14 }}>
          🔒 Test card: <strong>4242 4242 4242 4242</strong> · Any future date · Any 3-digit CVC
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-100">
          {loading ? '⏳ Processing...' : `✅ Pay $${appt.amount}`}
        </button>
      </form>
    </div>
  );
}

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [form, setForm] = useState({ date: '', timeSlot: '', reason: '' });
  const [step, setStep] = useState(1);
  const [bookedAppt, setBookedAppt] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load approved doctors on mount
  useEffect(() => { api.get('/users/doctors').then(r => setDoctors(r.data)).catch(() => {}); }, []);

  const handleBook = async () => {
    setLoading(true);
    try {
      // Step 1: Create appointment
      const { data: appt } = await api.post('/appointments', {
        doctorId: selectedDoc._id, date: form.date, timeSlot: form.timeSlot, reason: form.reason,
      });
      // Step 2: Create Stripe payment intent
      const { data: pay } = await api.post('/payments/create-intent', { appointmentId: appt._id });
      setBookedAppt({ ...appt, amount: pay.amount / 100 });
      setClientSecret(pay.clientSecret);
      setStep(3);
    } catch (err) { 
      alert(err.response?.data?.message || 'Booking failed'); 
      setLoading(false);
    }
  };

  const resetFlow = () => { setStep(1); setSuccess(false); setSelectedDoc(null); setForm({ date: '', timeSlot: '', reason: '' }); };

  if (success) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
      <h3 style={{ fontWeight: 800, color: '#065f46', marginBottom: 8 }}>Appointment Confirmed!</h3>
      <p style={{ color: '#888', marginBottom: 24 }}>Your appointment is booked and payment processed successfully.</p>
      <button className="btn btn-primary" onClick={resetFlow}>Book Another Appointment</button>
    </div>
  );

  const SPEC_COLORS = { Cardiology: '#f64f59', Neurology: '#667eea', Pediatrics: '#5DCAA5', 'General Practice': '#764ba2', Orthopedics: '#f093fb', Dermatology: '#4facfe', Psychiatry: '#43e97b' };

  return (
    <div>
      <h4 style={{ fontWeight: 800, marginBottom: 8, color: '#1a1a2e' }}>📅 Book an Appointment</h4>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>3 simple steps: choose a doctor, pick a time, and pay securely.</p>

      {/* Progress steps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
        {[{ n: 1, label: 'Select Doctor' }, { n: 2, label: 'Pick Time' }, { n: 3, label: 'Payment' }].map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: step >= s.n ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#e0e0e0', color: step >= s.n ? '#fff' : '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
              {step > s.n ? '✓' : s.n}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: step >= s.n ? '#667eea' : '#aaa' }}>{s.label}</span>
            {s.n < 3 && <div style={{ width: 28, height: 2, background: step > s.n ? '#667eea' : '#e0e0e0' }} />}
          </div>
        ))}
      </div>

      {/* Step 1 — Select Doctor */}
      {step === 1 && (
        <div>
          {doctors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading doctors...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
              {doctors.map(d => {
                const color = SPEC_COLORS[d.specialization] || '#667eea';
                const sel = selectedDoc?._id === d._id;
                return (
                  <div key={d._id} className="card p-3" onClick={() => setSelectedDoc(d)}
                    style={{ cursor: 'pointer', border: sel ? '2px solid #667eea' : '2px solid transparent', background: sel ? '#f0f2ff' : '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <div style={{ width: 46, height: 46, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff' }}>👨‍⚕️</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{d.name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{d.specialization}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: '#888' }}>{d.department || 'General'}</span>
                      <span style={{ fontWeight: 800, color, fontSize: 14 }}>${d.consultationFee}</span>
                    </div>
                    {sel && <div style={{ marginTop: 8, background: '#667eea', color: '#fff', borderRadius: 6, padding: '4px 0', textAlign: 'center', fontSize: 12, fontWeight: 600 }}>✓ Selected</div>}
                  </div>
                );
              })}
            </div>
          )}
          {selectedDoc && (
            <button className="btn btn-primary" onClick={() => setStep(2)}>
              Continue with Dr. {selectedDoc.name} →
            </button>
          )}
        </div>
      )}

      {/* Step 2 — Pick Time */}
      {step === 2 && selectedDoc && (
        <div className="card p-4" style={{ maxWidth: 500 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '12px', background: '#f8f9ff', borderRadius: 10 }}>
            <span style={{ fontSize: 24 }}>👨‍⚕️</span>
            <div>
              <div style={{ fontWeight: 700 }}>Dr. {selectedDoc.name}</div>
              <div style={{ color: '#888', fontSize: 13 }}>{selectedDoc.specialization} · ${selectedDoc.consultationFee}/visit</div>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, fontSize: 13, color: '#444', display: 'block', marginBottom: 6 }}>Select Date</label>
            <input type="date" className="form-control" value={form.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, fontSize: 13, color: '#444', display: 'block', marginBottom: 8 }}>Available Time Slots</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Array.from(new Set(selectedDoc.availability?.flatMap(a => a.slots) || [])).sort().map(s => (
                <button key={s} type="button" onClick={() => setForm({ ...form, timeSlot: s })}
                  style={{ padding: '6px 14px', borderRadius: 20, border: form.timeSlot === s ? 'none' : '1.5px solid #e0e0e0', background: form.timeSlot === s ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#fff', color: form.timeSlot === s ? '#fff' : '#444', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                  {s}
                </button>
              ))}
              {!selectedDoc.availability?.length && <span style={{ color: '#888', fontSize: 13 }}>No slots available yet. Doctor needs to set schedule.</span>}
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 600, fontSize: 13, color: '#444', display: 'block', marginBottom: 6 }}>Reason for Visit</label>
            <textarea className="form-control" rows={3} value={form.reason}
              onChange={e => setForm({ ...form, reason: e.target.value })}
              placeholder="Describe your symptoms or reason for visit..." />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline-secondary" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={handleBook}
              disabled={!form.date || !form.timeSlot || !form.reason || loading}>
              {loading ? '⏳ Booking...' : 'Proceed to Payment →'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Payment */}
      {step === 3 && clientSecret && bookedAppt && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm appt={bookedAppt} clientSecret={clientSecret} onSuccess={() => setSuccess(true)} />
        </Elements>
      )}
      {step === 3 && (!stripePromise || !clientSecret || !bookedAppt) && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#fee',
          borderRadius: 12,
          color: '#c33',
        }}>
          <div style={{ fontSize: 24, marginBottom: 12 }}>⚠️</div>
          <p style={{ fontWeight: 600 }}>Payment system not configured</p>
          <p style={{ fontSize: 13, opacity: 0.8 }}>Please check your Stripe API key configuration in .env file</p>
        </div>
      )}
    </div>
  );
}