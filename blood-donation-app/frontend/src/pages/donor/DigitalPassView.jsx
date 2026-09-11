import React, { useState, useEffect } from 'react';
import { donorApi } from '../../api/donorApi';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import QRCard from '../../components/QRCard';
import Modal from '../../components/Modal';
import { ArrowLeft, Shield, Info, CheckCircle, Smartphone, LogOut } from 'lucide-react';

export const DigitalPassView = () => {
  const { user, profile, logout } = useAuth();
  const { setActiveTab, showToast } = useApp();
  const [passData, setPassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    logout();
    setActiveTab('login');
    showToast('You have been securely signed out.', 'info');
  };

  useEffect(() => {
    fetchPass();
  }, []);

  const fetchPass = async () => {
    try {
      const res = await donorApi.getDigitalPass();
      if (res.success) {
        setPassData(res.pass);
      }
    } catch (err) {
      setError('Could not generate digital pass. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Navigation & Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <button
              onClick={() => setActiveTab('donor-dashboard')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                marginBottom: '0.75rem'
              }}
            >
              <ArrowLeft size={16} /> Back to Donor Dashboard
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-gov">
                <Shield size={13} /> Official Digital Credential
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>MoHFW Digital Blood Donor Pass</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Nationally verifiable contactless pass embedded with cryptographic donor credentials.
            </p>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setLogoutModalOpen(true)}
            style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', marginTop: '0.5rem' }}
            title="Sign out of donor account"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Loading / Error / Pass */}
        {loading ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Generating high-resolution QR pass...
          </div>
        ) : error ? (
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
            {error}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            {/* The QR Card Component */}
            <QRCard passData={passData} donorProfile={profile} donorName={user?.name} />

            {/* Explanatory Guide */}
            <div
              className="glass-card no-print"
              style={{
                padding: '1.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={18} color="var(--primary-light)" /> How to use this pass
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Smartphone size={18} color="#60a5fa" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>Save to Mobile Device:</strong> You can download or screenshot this pass on your phone. It contains offline-verifiable data recognized at all government and licensed blood banks.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <div>
                    <strong style={{ color: 'var(--text-main)' }}>Priority Fast-Track:</strong> Presenting this pass bypasses paper pre-registration at voluntary donation drives across India.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Confirm Donor Sign Out"
        maxWidth="450px"
      >
        <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.2rem',
              color: '#ef4444'
            }}
          >
            <LogOut size={26} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Sign out of Donor Account?
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
            You are signed in as <strong>{user?.name || 'Donor'}</strong>. Your digital pass remains permanently attached to your mobile and registry identity.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => setLogoutModalOpen(false)}
            >
              Stay In
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
              }}
              onClick={handleConfirmLogout}
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DigitalPassView;
