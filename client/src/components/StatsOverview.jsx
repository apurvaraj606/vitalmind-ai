import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatsOverview({ stats }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
      }}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.trend >= 0;

        return (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -4 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background accent */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: `${stat.color}08`,
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color,
                }}>
                  <Icon size={22} />
                </div>

                {stat.trend !== undefined && (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: isPositive ? '#10b981' : '#ef4444',
                      background: isPositive ? '#d1fae5' : '#fee2e2',
                      padding: '4px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(stat.trend)}%
                  </motion.div>
                )}
              </div>

              <p style={{
                fontSize: '12px',
                color: '#999',
                margin: '0 0 6px 0',
                fontWeight: '500',
              }}>
                {stat.label}
              </p>

              <h3 style={{
                fontSize: '28px',
                fontWeight: '800',
                color: stat.color,
                margin: '0 0 8px 0',
                lineHeight: 1,
              }}>
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </h3>

              {stat.subtitle && (
                <p style={{
                  fontSize: '12px',
                  color: '#666',
                  margin: 0,
                }}>
                  {stat.subtitle}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default StatsOverview;
