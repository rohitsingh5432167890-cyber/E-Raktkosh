import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

export const EmergencyBanner = () => {
  const { emergencyAlerts, setActiveTab } = useApp();

  if (!emergencyAlerts || emergencyAlerts.length === 0) {
    return null;
  }

  // Focus on the most urgent/recent alert
  const topAlert = emergencyAlerts[0];

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #7f1d1d 0%, #991b1b 50%, #450a0a 100%)',
        color: '#ffffff',
        borderBottom: '1px solid rgba(239, 68, 68, 0.4)',
        padding: '0.55rem 0',
        fontSize: '0.85rem'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              fontWeight: '700',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <ShieldAlert size={14} /> Critical SOS
          </span>
          <span style={{ fontWeight: '500' }}>
            Urgent need: <strong>{topAlert.unitsNeeded} unit(s) of {topAlert.bloodGroup} ({topAlert.component})</strong> at {topAlert.hospitalName}, {topAlert.district} ({topAlert.state})
          </span>
        </div>

        <button
          onClick={() => setActiveTab('emergency-sos')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: '600',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
        >
          View All SOS ({emergencyAlerts.length}) <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default EmergencyBanner;
