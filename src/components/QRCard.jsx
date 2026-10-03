import React from 'react';
import { ShieldCheck, Download, Printer, Award, Droplets, CheckCircle2, Clock } from 'lucide-react';

export const QRCard = ({ passData, donorProfile, donorName }) => {
  if (!passData) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Generating secure digital QR pass...
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!passData.qrCode) return;
    const link = document.createElement('a');
    link.download = `bloodbuddy-pass-${passData.donorId}.png`;
    link.href = passData.qrCode;
    link.click();
  };

  const isEligible = donorProfile?.eligibility?.isEligible ?? true;

  return (
    <div style={{ maxWidth: '460px', margin: '0 auto' }}>
      {/* Official Card Wrapper */}
      <div
        className="printable-card"
        style={{
          background: 'linear-gradient(145deg, #180505 0%, #290808 60%, #150202 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          border: '2px solid #8b0000',
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.55), 0 0 20px rgba(198, 40, 40, 0.25)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Accent stripe on top of pass */}
        <div style={{ height: '5px', background: 'linear-gradient(90deg, #8b0000 0%, #c62828 50%, #ef5350 100%)' }} />

        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.25rem 0.85rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0, 0, 0, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b0000 0%, #ef4444 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)'
              }}
            >
              <Droplets size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.08em', color: '#fca5a5', textTransform: 'uppercase', fontWeight: '700' }}>
                BLOODBUDDY VERIFIED NETWORK
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
                Digital Donor Pass
              </div>
            </div>
          </div>
          <ShieldCheck size={26} color="#10b981" />
        </div>

        {/* Card Body */}
        <div style={{ padding: '1.25rem' }}>
          {/* Main Info Box */}
          <div
            style={{
              display: 'flex',
              gap: '1.25rem',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '1rem'
            }}
          >
            {/* QR Code Container */}
            <div
              style={{
                background: '#ffffff',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                flexShrink: 0
              }}
            >
              {passData.qrCode ? (
                <img
                  src={passData.qrCode}
                  alt="Donor QR Pass"
                  style={{ width: '128px', height: '128px', display: 'block' }}
                />
              ) : (
                <div style={{ width: '128px', height: '128px', background: '#e2e8f0' }} />
              )}
            </div>

            {/* Donor Metrics */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Verified Donor Name</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {donorName || passData.name}
              </div>

              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '1.4rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '900',
                    color: '#ff4d4d',
                    background: 'rgba(255, 77, 77, 0.15)',
                    padding: '0.1rem 0.5rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 77, 77, 0.3)'
                  }}
                >
                  {passData.bloodGroup}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                  Total Donations: <strong>{donorProfile?.totalDonations ?? passData.totalDonations ?? 0}</strong>
                </span>
              </div>

              <div style={{ marginTop: '0.6rem' }}>
                {isEligible ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      border: '1px solid rgba(16, 185, 129, 0.35)'
                    }}
                  >
                    <CheckCircle2 size={12} /> ELIGIBLE TO DONATE
                  </span>
                ) : (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: 'rgba(245, 158, 11, 0.2)',
                      color: '#fbbf24',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      border: '1px solid rgba(245, 158, 11, 0.35)'
                    }}
                  >
                    <Clock size={12} /> ELIGIBLE: {donorProfile?.eligibility?.nextEligibleDate}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              fontSize: '0.78rem',
              color: '#cbd5e1',
              marginBottom: '0.75rem'
            }}
          >
            <div>
              <span style={{ color: '#94a3b8' }}>Donor ID:</span> <br />
              <strong style={{ color: '#ffffff', fontFamily: 'monospace' }}>{passData.donorId}</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Donor Tier:</span> <br />
              <strong style={{ color: '#fbbf24', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Award size={13} /> {donorProfile?.badgeLevel || passData.badge || 'Registered Donor'}
              </strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>State / Region:</span> <br />
              <strong style={{ color: '#ffffff' }}>{donorProfile?.state || passData.state || 'Delhi NCR'}</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Issued Through:</span> <br />
              <strong style={{ color: '#ffffff' }}>BloodBuddy Registry</strong>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '6px',
              padding: '0.45rem 0.75rem',
              fontSize: '0.68rem',
              color: '#94a3b8',
              textAlign: 'center',
              border: '1px dashed rgba(255, 255, 255, 0.1)'
            }}
          >
            Show this QR code at any verified Blood Center or Voluntary Drive for instant check-in.
          </div>
        </div>
      </div>

      {/* Action Buttons (Hidden when printing) */}
      <div className="no-print" style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'center' }}>
        <button
          onClick={handlePrint}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Printer size={15} /> Print Pass
        </button>
        <button
          onClick={handleDownload}
          className="btn btn-primary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Download size={15} /> Download QR
        </button>
      </div>
    </div>
  );
};

export default QRCard;
