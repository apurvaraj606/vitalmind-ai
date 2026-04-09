import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

// Floating AI chatbot widget — appears on all dashboard pages
export default function ChatBot() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm VitalMind AI. Ask me any health question!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/chat', {
        messages: updated,
        userContext: { name: user?.name, bloodGroup: user?.bloodGroup },
      });
      setMessages(m => [...m, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: '⚠️ Something went wrong. Please try again.' }]);
    } finally { setLoading(false); }
  };

  if (!user) return null;

  return (
    <>
      {/* Floating trigger button */}
      <button onClick={() => setOpen(o => !o)} style={{
        position: 'fixed', bottom: 28, right: 28, width: 58, height: 58,
        borderRadius: '50%', border: 'none', cursor: 'pointer', zIndex: 1200,
        background: 'linear-gradient(135deg,#667eea,#764ba2)',
        boxShadow: '0 6px 24px rgba(102,126,234,0.45)',
        fontSize: 24, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {open ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 100, right: 28, width: 350, height: 500,
          borderRadius: 18, overflow: 'hidden', zIndex: 1200,
          boxShadow: '0 12px 48px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', background: '#fff',
        }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>VitalMind AI</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>● Online · Powered by Claude</div>
            </div>
          </div>

          {/* Messages area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', background: '#f8f9ff' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                <div style={{
                  maxWidth: '82%', padding: '10px 14px', borderRadius: 14, fontSize: 13, lineHeight: 1.5,
                  background: m.role === 'user' ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#fff',
                  color: m.role === 'user' ? '#fff' : '#333',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  borderBottomRightRadius: m.role === 'user' ? 4 : 14,
                  borderBottomLeftRadius: m.role === 'assistant' ? 4 : 14,
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
                <div style={{ background: '#fff', padding: '10px 14px', borderRadius: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: 18 }}>●●●</div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #eee', display: 'flex', gap: 8 }}>
            <input
              style={{ flex: 1, border: '1.5px solid #e0e0e0', borderRadius: 22, padding: '8px 14px', fontSize: 13, outline: 'none' }}
              placeholder="Ask a health question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button onClick={send} style={{
              background: 'linear-gradient(135deg,#667eea,#764ba2)', border: 'none',
              borderRadius: '50%', width: 36, height: 36, color: '#fff', cursor: 'pointer', fontSize: 16,
            }}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}