import { motion } from 'framer-motion';

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
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  icon: Icon,
  disabled = false,
  rows,
}) {
  return (
    <motion.div variants={itemVariants}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: '600',
          color: '#1a1a1a',
          marginBottom: '8px',
        }}>
          {label}
          {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#999',
            display: 'flex',
            alignItems: 'center',
          }}>
            <Icon size={18} />
          </div>
        )}

        {type === 'textarea' ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows || 4}
            style={{
              width: '100%',
              padding: Icon ? '12px 12px 12px 40px' : '12px',
              borderRadius: '8px',
              border: error ? '2px solid #ef4444' : '2px solid #e5e5e5',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              transition: 'all 0.2s ease',
              backgroundColor: disabled ? '#f5f5f5' : 'white',
              color: disabled ? '#999' : '#1a1a1a',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
              if (!error) {
                e.target.style.borderColor = '#e5e5e5';
              }
            }}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            style={{
              width: '100%',
              padding: Icon ? '12px 12px 12px 40px' : '12px',
              borderRadius: '8px',
              border: error ? '2px solid #ef4444' : '2px solid #e5e5e5',
              fontSize: '14px',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              backgroundColor: disabled ? '#f5f5f5' : 'white',
              color: disabled ? '#999' : '#1a1a1a',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
              if (!error) {
                e.target.style.borderColor = '#e5e5e5';
              }
            }}
          />
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: '12px',
            color: '#ef4444',
            marginTop: '6px',
            margin: '6px 0 0 0',
          }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}

export function BeautifulForm({ title, subtitle, fields, onSubmit, submitLabel = 'Submit', isLoading = false, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      {title && (
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#1a1a1a',
            marginBottom: '8px',
          }}
        >
          {title}
        </motion.h1>
      )}

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '24px',
          }}
        >
          {subtitle}
        </motion.p>
      )}

      <form onSubmit={onSubmit}>
        {children ? (
          children
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}
          >
            {fields.map((field, idx) => (
              <FormField key={idx} {...field} />
            ))}
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            background: isLoading ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            fontWeight: '700',
            fontSize: '15px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? '⏳ Processing...' : submitLabel}
        </motion.button>
      </form>
    </motion.div>
  );
}

export default BeautifulForm;
