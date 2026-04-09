import { motion } from 'framer-motion';
import { Star, MapPin, Clock, User } from 'lucide-react';

export function DoctorCard({ doctor, onClick }) {
  const rating = doctor.rating || 4.8;
  const reviews = doctor.reviews || 152;
  const isAvailable = doctor.isAvailable !== false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        cursor: 'pointer',
        border: '1px solid #f0f0f0',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header with avatar */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          {doctor.avatar || '👨‍⚕️'}
        </motion.div>

        {/* Availability badge */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: isAvailable ? '#10b981' : '#999',
            border: '2px solid white',
            boxShadow: `0 0 0 3px ${isAvailable ? '#d1fae5' : '#e5e5e5'}`,
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <h3 style={{
          margin: '0 0 4px 0',
          fontSize: '16px',
          fontWeight: '700',
          color: '#1a1a1a',
        }}>
          Dr. {doctor.name}
        </h3>

        <p style={{
          margin: '0 0 12px 0',
          fontSize: '13px',
          color: '#667eea',
          fontWeight: '600',
        }}>
          {doctor.specialty}
        </p>

        {/* Rating */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginBottom: '12px',
        }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Star
                size={14}
                fill={i < Math.floor(rating) ? '#f59e0b' : '#e5e5e5'}
                color={i < Math.floor(rating) ? '#f59e0b' : '#e5e5e5'}
              />
            </motion.div>
          ))}
          <span style={{
            fontSize: '12px',
            color: '#666',
            marginLeft: '4px',
          }}>
            {rating} ({reviews})
          </span>
        </div>

        {/* Info rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {doctor.location && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: '#666' }}>
              <MapPin size={14} color="#667eea" />
              {doctor.location}
            </div>
          )}
          {doctor.experience && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: '#666' }}>
              <Clock size={14} color="#667eea" />
              {doctor.experience} years experience
            </div>
          )}
          {doctor.patients && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: '#666' }}>
              <User size={14} color="#667eea" />
              {doctor.patients} patients
            </div>
          )}
        </div>

        {/* Book button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClick}
          style={{
            width: '100%',
            padding: '10px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            border: 'none',
            color: 'white',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Book Appointment
        </motion.button>
      </div>
    </motion.div>
  );
}

export default DoctorCard;
