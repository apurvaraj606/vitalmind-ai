import { motion } from 'framer-motion';
import { ArrowRight, Activity, Heart, Users } from 'lucide-react';

export default function HeroBanner() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '24px',
      padding: '60px 40px',
      minHeight: '400px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* Animated background elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          top: '-100px',
          left: '-100px',
          blur: '40px',
        }}
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6, delay: 1 }}
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          bottom: '-50px',
          right: '-50px',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ flex: 1, position: 'relative', zIndex: 1 }}
      >
        <motion.div variants={itemVariants} style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '50px',
            padding: '8px 16px',
            color: 'white',
            fontSize: '13px',
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
            marginBottom: '20px',
          }}>
            <Activity size={16} />
            ✨ Your Health Assistant
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: '48px',
            fontWeight: '900',
            color: 'white',
            marginBottom: '16px',
            lineHeight: '1.2',
            letterSpacing: '-2px',
          }}
        >
          Welcome to VitalMind.ai
        </motion.h1>

        <motion.p
          variants={itemVariants}
          style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '28px',
            maxWidth: '500px',
            lineHeight: '1.7',
          }}
        >
          Experience seamless healthcare with AI-powered insights, instant consultations, and secure medical records management.
        </motion.p>

        <motion.div
          variants={itemVariants}
          style={{ display: 'flex', gap: '12px' }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            }}
          >
            Get Started <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Right side stats */}
      <motion.div
        style={{ position: 'relative', zIndex: 1, marginLeft: '40px' }}
      >
        {[
          { icon: Users, label: 'Active Users', value: '10K+', color: '#10b981' },
          { icon: Heart, label: 'Healthy Lives', value: '500+', color: '#f59e0b' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: stat.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              <stat.icon size={22} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'white' }}>
                {stat.value}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
