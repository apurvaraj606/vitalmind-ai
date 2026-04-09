import { motion } from 'framer-motion';
import { TrendingUp, Users, Clock, DollarSign } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, color = '#667eea', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8 }}
      style={{
        background: `linear-gradient(135deg, ${color}15, ${color}08)`,
        border: `1px solid ${color}20`,
        borderRadius: '16px',
        padding: '24px',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 12px 32px ${color}25`;
        e.currentTarget.style.borderColor = `${color}40`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = `${color}20`;
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: `0 8px 16px ${color}30`,
        }}>
          <Icon size={28} />
        </div>
        {trend && (
          <motion.div
            animate={{ rotate: trend > 0 ? 0 : 180 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: trend > 0 ? '#10b981' : '#ef4444',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            <TrendingUp size={16} />
            {Math.abs(trend)}%
          </motion.div>
        )}
      </div>
      <div style={{ marginBottom: '8px' }}>
        <div style={{ color: '#888', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{
          fontSize: '28px',
          fontWeight: '800',
          color: '#1a1a1a',
          letterSpacing: '-1px',
        }}>
          {value}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
