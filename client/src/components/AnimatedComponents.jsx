import { motion } from 'framer-motion';

export function AnimatedCard({ children, delay = 0, className = '', onClick = null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8 }}
      className={`card-modern ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedButton({ children, onClick, disabled = false, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className="btn-primary-gradient"
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function AnimatedContainer({ children, stagger = 0.1 }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export function LoadingSpinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1 }}
      style={{
        width: '40px',
        height: '40px',
        border: '4px solid rgba(102, 126, 234, 0.2)',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
      }}
    />
  );
}
