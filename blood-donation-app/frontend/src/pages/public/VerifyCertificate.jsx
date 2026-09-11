import React, { useState } from 'react';
import { publicApi } from '../../api/publicApi';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Search, CheckCircle2, AlertTriangle, QrCode, FileText, Sparkles, Building2, Calendar } from 'lucide-react';

export const VerifyCertificate = () => {
  const { showToast } = useApp();
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (idToSearch = certificateId) => {
    if (!idToSearch) {
      showToast('Please enter a valid certificate number.', 'warning');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await publicApi.verifyCertificate(idToSearch.trim());
      if (res.success && res.verified) {
        setResult(res.certificate);
        showToast('Certificate successfully validated in National Registry!', 'success');
      } else {
        setError(res.message || 'Certificate could not be verified.');
      }
    } catch (err) {
      setError(err.message || 'Certificate was not found in the national registry.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillSample = (sampleId) => {
    setCertificateId(sampleId);
    handleSearch(sampleId);
  };

  return (
    <div className="page-wrapper" style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}
          >
            <ShieldCheck size={30} color="#10b981" />
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>National Certificate Verification</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '560px', margin: '0.4rem auto 0 auto' }}>
            Verify the authenticity of any e-RaktKosh Voluntary Blood Donor Certificate against the Ministry of Health and Family Welfare central ledger.
          </p>
        </div>

        {/* Search Box */}
        <div
          className="glass-card"
          style={{
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
            border: '1px solid var(--border-highlight)'
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.9rem' }}>
                Enter e-RaktKosh Certificate Number
              </label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. ERK-CERT-2024-88412 or ERK-CERT-2026-..."
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  style={{ textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.05em' }}
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0 1.5rem', flexShrink: 0 }}
                  disabled={loading}
                >
                  <Search size={18} />
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          </form>

          {/* 1-Click Sample Fill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Sparkles size={13} color="#fbbf24" /> Instant Test Sample Certificates:
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
              onClick={() => handleFillSample('ERK-CERT-2024-88412')}
            >
              ERK-CERT-2024-88412 (AIIMS)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
              onClick={() => handleFillSample('ERK-CERT-2024-19402')}
            >
              ERK-CERT-2024-19402 (Safdarjung)
            </button>
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div
            className="glass-card"
            style={{
              padding: '1.75rem',
              textAlign: 'center',
              borderColor: 'rgba(239, 68, 68, 0.4)',
              backgroundColor: 'rgba(239, 68, 68, 0.08)'
            }}
          >
            <AlertTriangle size={32} color="#ef4444" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#fca5a5', marginBottom: '0.35rem' }}>Verification Unsuccessful</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{error}</p>
          </div>
        )}

        {/* Validated Certificate Card */}
        {result && (
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid #10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.04)',
              animation: 'slideIn 0.3s ease'
            }}
          >
            {/* Status Pill */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  fontWeight: '800',
                  fontSize: '0.82rem',
                  letterSpacing: '0.04em'
                }}
              >
                <CheckCircle2 size={16} /> OFFICIALLY VERIFIED & AUTHENTIC
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                SHA-256: {result.verificationHash}
              </div>
            </div>

            {/* Certificate Header */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
              {/* QR Code */}
              {result.qrCode && (
                <div
                  style={{
                    background: '#ffffff',
                    padding: '8px',
                    borderRadius: '10px',
                    border: '2px solid #8b0000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={result.qrCode}
                    alt="Certificate QR Verification"
                    style={{ width: '130px', height: '130px', display: 'block' }}
                  />
                </div>
              )}

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Registered Donor:</div>
                <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  {result.donorName}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span className="badge badge-blood" style={{ fontSize: '0.9rem', padding: '0.3rem 0.65rem' }}>
                    {result.bloodGroup}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Donated: <strong>{result.component || 'Whole Blood'}</strong>
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building2 size={15} color="var(--primary-light)" />
                  <span>{result.bloodBankName}</span>
                </div>
              </div>
            </div>

            {/* Meta Details Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1.25rem',
                fontSize: '0.85rem'
              }}
            >
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Certificate Number:</span> <br />
                <strong style={{ fontFamily: 'monospace', color: 'var(--text-main)' }}>{result.certificateId}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Donation Date:</span> <br />
                <strong style={{ color: 'var(--text-main)' }}>{result.donationDate}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Authorized By:</span> <br />
                <strong style={{ color: 'var(--text-main)' }}>{result.authorizedBy}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)' }}>Medical Officer:</span> <br />
                <strong style={{ color: 'var(--text-main)' }}>{result.verifiedBy}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;
