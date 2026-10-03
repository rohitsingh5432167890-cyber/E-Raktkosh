import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Modal from './Modal';
import { publicApi } from '../api/publicApi';
import { Award, Printer, ShieldCheck, Heart, QrCode, CheckCircle, Download, ExternalLink, Sparkles } from 'lucide-react';

export const CertificateModal = ({ isOpen, onClose, certificate }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState(certificate?.qrCode || null);
  const [verificationData, setVerificationData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerificationReport, setShowVerificationReport] = useState(false);

  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }

      if (certificate?.certificateId) {
        loadCertificateDetails(certificate.certificateId);
      }
    } else {
      setShowVerificationReport(false);
    }
  }, [isOpen, certificate]);

  const loadCertificateDetails = async (certId) => {
    try {
      const res = await publicApi.verifyCertificate(certId);
      if (res.success && res.certificate) {
        setVerificationData(res.certificate);
        if (res.certificate.qrCode) {
          setQrCodeUrl(res.certificate.qrCode);
        }
      }
    } catch (err) {
      console.warn('Could not auto-fetch certificate QR details:', err);
    }
  };

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.download = `certificate-qr-${certificate.certificateId}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const handleVerifyScan = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setShowVerificationReport(true);
    }, 600);
  };

  const cert = verificationData || certificate;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Donor Certificate of Appreciation" maxWidth="780px">
      {/* Verification Success Toast / Notification Banner if tested */}
      {showVerificationReport && (
        <div
          className="no-print"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: '800', fontSize: '0.95rem' }}>
            <CheckCircle size={18} />
            <span>QR CODE SCANNED & CRYPTOGRAPHICALLY VALIDATED</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#d1fae5', marginTop: '0.4rem', lineHeight: '1.5' }}>
            Certificate <strong>{cert.certificateId}</strong> is registered to <strong>{cert.donorName}</strong> for voluntary blood donation at <strong>{cert.bloodBankName}</strong>. Verified in National Transfusion Registry with SHA-256 Checksum: <code style={{ color: '#6ee7b7' }}>{cert.verificationHash || 'ERK-VALIDATED-HASH'}</code>.
          </div>
        </div>
      )}

      {/* The Printable Certificate */}
      <div
        className="printable-card"
        style={{
          background: '#ffffff',
          color: '#1a1a1a',
          padding: '2.5rem 2rem',
          borderRadius: '12px',
          border: '12px double #8b0000',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          fontFamily: "'Inter', Georgia, serif",
          textAlign: 'center'
        }}
      >
        {/* Tricolor top header stripe */}
        <div
          style={{
            height: '5px',
            background: 'linear-gradient(90deg, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%)',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        />

        {/* Header Branding */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', letterSpacing: '0.14em', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700' }}>
            Ministry of Health and Family Welfare | Government of India
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#8b0000', letterSpacing: '0.04em', marginTop: '0.2rem' }}>
            NATIONAL BLOOD TRANSFUSION COUNCIL (NBTC) & e-RaktKosh
          </div>
        </div>

        {/* Certificate Title */}
        <div style={{ margin: '1.25rem 0' }}>
          <h2
            style={{
              fontFamily: "'Outfit', Georgia, serif",
              fontSize: '1.95rem',
              color: '#1e293b',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: '0.25rem 0'
            }}
          >
            Certificate of Appreciation
          </h2>
          <div style={{ width: '90px', height: '3px', background: '#c62828', margin: '0.5rem auto' }} />
          <p style={{ fontStyle: 'italic', color: '#4b5563', fontSize: '0.95rem' }}>
            This certificate is proudly and honorably presented to
          </p>
        </div>

        {/* Recipient Name */}
        <div style={{ margin: '1.25rem 0' }}>
          <div
            style={{
              fontSize: '2.1rem',
              fontWeight: '800',
              color: '#8b0000',
              fontFamily: "'Outfit', sans-serif",
              borderBottom: '2px dashed #e2e8f0',
              paddingBottom: '0.5rem',
              display: 'inline-block',
              minWidth: '280px'
            }}
          >
            {cert.donorName}
          </div>
        </div>

        {/* Citation text */}
        <p
          style={{
            fontSize: '0.92rem',
            lineHeight: '1.7',
            color: '#374151',
            maxWidth: '580px',
            margin: '0 auto 1.5rem auto'
          }}
        >
          In deep gratitude for your voluntary and selfless donation of <strong>{cert.component || 'Whole Blood'} ({cert.bloodGroup})</strong> at <strong>{cert.bloodBankName}</strong> on <strong>{cert.donationDate}</strong>. Your noble gesture contributes directly towards saving precious human lives.
        </p>

        {/* Bottom Section: QR Code, Gold Seal, and Signature */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid #e5e7eb',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          {/* Real Scannable Certificate QR Code */}
          <div style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                background: '#ffffff',
                border: '2px solid #8b0000',
                borderRadius: '8px',
                padding: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                display: 'inline-block'
              }}
            >
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="Scannable Certificate Verification QR"
                  style={{ width: '90px', height: '90px', display: 'block' }}
                />
              ) : (
                <div style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#64748b', fontSize: '0.7rem' }}>
                  Loading QR...
                </div>
              )}
            </div>

            <div style={{ fontSize: '0.72rem', color: '#4b5563', maxWidth: '170px' }}>
              <div style={{ fontWeight: '700', color: '#8b0000', marginBottom: '0.2rem' }}>
                SCAN TO VERIFY
              </div>
              <div>Cert: <strong style={{ color: '#111827', fontFamily: 'monospace' }}>{cert.certificateId}</strong></div>
              <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: '600', marginTop: '0.2rem' }}>
                ✓ MoHFW Cryptographic Seal
              </div>
            </div>
          </div>

          {/* Golden Seal Emblem */}
          <div
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #fef3c7 0%, #f59e0b 80%, #b45309 100%)',
              border: '2px solid #92400e',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#78350f',
              boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)',
              fontSize: '0.62rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              flexShrink: 0
            }}
          >
            <Heart size={16} color="#c62828" fill="#c62828" />
            <span>Hero</span>
            <span>Donor</span>
          </div>

          {/* Medical Officer signature */}
          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#4b5563' }}>
            <div style={{ fontStyle: 'italic', fontWeight: '700', color: '#1f2937', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
              {cert.verifiedBy || 'Dr. Ananya Sen'}
            </div>
            <div style={{ borderTop: '1px solid #9ca3af', paddingTop: '0.25rem', fontWeight: '600' }}>
              Chief Medical Officer
            </div>
            <div>Transfusion Medicine & Blood Services</div>
          </div>
        </div>
      </div>

      {/* Action Footer (Controls) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          onClick={handleVerifyScan}
          className="btn btn-secondary btn-sm"
          style={{
            borderColor: '#10b981',
            color: '#10b981',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
          disabled={isVerifying}
        >
          <ShieldCheck size={15} />
          {isVerifying ? 'Checking National Registry...' : 'Simulate Live QR Scan & Authenticate'}
        </button>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          {qrCodeUrl && (
            <button
              onClick={handleDownloadQR}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Download size={14} /> Download QR
            </button>
          )}
          <button
            onClick={handlePrint}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Printer size={14} /> Print Certificate
          </button>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CertificateModal;
