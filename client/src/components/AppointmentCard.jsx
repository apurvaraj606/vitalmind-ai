import { motion } from 'framer-motion';
import { Calendar, Clock, User, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const statusConfig = {
  confirmed: { color: '#10b981', icon: CheckCircle, label: 'Confirmed' },
  pending: { color: '#f59e0b', icon: AlertCircle, label: 'Pending' },
  cancelled: { color: '#ef4444', icon: XCircle, label: 'Cancelled' },
};

export function AppointmentCard({ appointment, onCancel, onReschedule }) {
  const status = statusConfig[appointment.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'white',
        borderRadius: '12px',
        border: `2px solid ${status.color}20`,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div style={{
        height: '4px',
        background: `linear-gradient(90deg, ${status.color}, transparent)`,
      }} />

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#f0f4ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#667eea',
            }}>
              <User size={24} />
            </div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 4px 0' }}>
                Dr. {appointment.doctorName}
              </p>
              <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>
                {appointment.speciality}
              </p>
            </div>
          </div>

          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: `${status.color}15`,
              padding: '6px 12px',
              borderRadius: '20px',
            }}
          >
            <StatusIcon size={16} color={status.color} />
            <span style={{ fontSize: '12px', fontWeight: '600', color: status.color }}>
              {status.label}
            </span>
          </motion.div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '16px',
          padding: '12px 0',
          borderTop: '1px solid #f0f0f0',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#666' }}>
            <Calendar size={16} color="#667eea" />
            <span style={{ fontSize: '13px' }}>{appointment.date}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#666' }}>
            <Clock size={16} color="#667eea" />
            <span style={{ fontSize: '13px' }}>{appointment.time}</span>
          </div>
        </div>

        {appointment.location && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '16px', color: '#666' }}>
            <MapPin size={16} color="#667eea" style={{ marginTop: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: '13px' }}>{appointment.location}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          {appointment.status === 'confirmed' && (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onReschedule}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '2px solid #667eea',
                  background: 'transparent',
                  color: '#667eea',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Reschedule
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '2px solid #ef4444',
                  background: 'transparent',
                  color: '#ef4444',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Cancel
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default AppointmentCard;
