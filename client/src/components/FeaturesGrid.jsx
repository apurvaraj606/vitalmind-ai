import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Calendar, 
  FileText, 
  Zap, 
  Shield, 
  Clock 
} from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: 'Smart AI Chatbot',
    description: 'Get instant answers to your health questions 24/7 with our advanced AI assistant',
    color: '#667eea',
    light: '#f0f4ff',
  },
  {
    icon: Calendar,
    title: 'Easy Appointments',
    description: 'Book consultations with top doctors instantly with our intuitive scheduling system',
    color: '#f59e0b',
    light: '#fffbf0',
  },
  {
    icon: FileText,
    title: 'Medical Records',
    description: 'Keep all your health documents secure and accessible in one place',
    color: '#10b981',
    light: '#f0fdf4',
  },
  {
    icon: Zap,
    title: 'Quick Prescriptions',
    description: 'Receive digital prescriptions instantly from your doctor',
    color: '#ef4444',
    light: '#fef2f2',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your medical data is encrypted and protected with enterprise-level security',
    color: '#8b5cf6',
    light: '#faf5ff',
  },
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'Receive instant notifications for appointments, prescriptions, and health tips',
    color: '#06b6d4',
    light: '#f0f9fa',
  },
];

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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function FeaturesGrid() {
  return (
    <div style={{ padding: '80px 40px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: '60px' }}
      >
        <h2 style={{
          fontSize: '44px',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px',
        }}>
          Why Choose VitalMind.ai?
        </h2>
        <p style={{
          fontSize: '18px',
          color: '#666',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          Everything you need for better healthcare management in one platform
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #f0f0f0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
            }}
          >
            {/* Animated background gradient */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: feature.light,
                zIndex: 0,
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: feature.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  marginBottom: '20px',
                  boxShadow: `0 8px 20px ${feature.color}40`,
                }}
              >
                <feature.icon size={28} />
              </motion.div>

              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '10px',
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.6',
              }}>
                {feature.description}
              </p>
            </div>

            {/* Animated accent line */}
            <motion.div
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${feature.color}, transparent)`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
