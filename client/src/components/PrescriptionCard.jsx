import { motion } from 'framer-motion';
import { Pill, Download, Eye } from 'lucide-react';
import { useState } from 'react';

export function PrescriptionCard({ prescription, onView, onDownload }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'white',
        borderRadius: '12px',
        border: '2px solid #f0f0f0',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div style={{
        height: '4px',
        background: 'linear-gradient(90deg, #667eea, #764ba2)',
      }} />

      <div style={{ padding: '16px' }}>
        {/* Header */}
        <motion.div
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: '#f0f4ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#667eea',
              flexShrink: 0,
            }}>
              <Pill size={22} />
            </div>
            <div>
              <h4 style={{
                margin: '0 0 4px 0',
                fontSize: '14px',
                fontWeight: '700',
                color: '#1a1a1a',
              }}>
                Dr. {prescription.doctorName}
              </h4>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#666',
              }}>
                {new Date(prescription.date).toLocaleDateString()} · {prescription.medicines?.length || 0} medicines
              </p>
            </div>
          </div>

          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#667eea',
              fontSize: '20px',
              marginTop: '4px',
            }}
          >
            ▼
          </motion.div>
        </motion.div>

        {/* Expanded content */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            overflow: 'hidden',
            marginTop: expanded ? '16px' : 0,
            paddingTop: expanded ? '16px' : 0,
            borderTop: expanded ? '1px solid #f0f0f0' : 'none',
          }}
        >
          {prescription.medicines && prescription.medicines.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '8px',
              }}>
                Medicines:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {prescription.medicines.map((med, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '8px',
                      background: '#f9f9f9',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#666',
                      borderLeft: '3px solid #667eea',
                    }}
                  >
                    <strong>{med.name}</strong> - {med.dosage}
                    {med.instructions && <div style={{ color: '#999', marginTop: '2px' }}>📝 {med.instructions}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {prescription.notes && (
            <div>
              <p style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '6px',
              }}>
                Notes:
              </p>
              <p style={{
                fontSize: '12px',
                color: '#666',
                margin: 0,
                padding: '8px',
                background: '#fafafa',
                borderRadius: '6px',
                borderLeft: '3px solid #f59e0b',
              }}>
                {prescription.notes}
              </p>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: expanded ? '16px' : '12px',
          paddingTop: '12px',
          borderTop: '1px solid #f0f0f0',
        }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onView?.(prescription)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: '2px solid #667eea',
              background: 'transparent',
              color: '#667eea',
              fontWeight: '600',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Eye size={14} /> View
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onDownload?.(prescription)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: '2px solid #10b981',
              background: 'transparent',
              color: '#10b981',
              fontWeight: '600',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Download size={14} /> Download
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default PrescriptionCard;
