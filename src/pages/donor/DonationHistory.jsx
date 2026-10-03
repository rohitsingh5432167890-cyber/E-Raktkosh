import React, { useState, useEffect } from 'react';
import { donorApi } from '../../api/donorApi';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import CertificateModal from '../../components/CertificateModal';
import Modal from '../../components/Modal';
import { History, Award, Building2, Calendar, FileCheck, ArrowLeft, LogOut } from 'lucide-react';

export const DonationHistory = () => {
  const { user, logout } = useAuth();
  const { setActiveTab, showToast } = useApp();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    logout();
    setActiveTab('login');
    showToast('You have been securely signed out.', 'info');
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await donorApi.getHistory();
      if (res.success) {
        setHistory(res.history || []);
      }
    } catch (err) {
      console.error('Failed to load donation history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCertificate = (item) => {
    setSelectedCert({
      certificateId: item.certificateId,
      donorName: user?.name || 'Rahul Sharma',
      bloodGroup: item.bloodGroup,
      bloodBankName: item.bloodBankName,
      component: item.component,
      donationDate: item.donationDate,
      verifiedBy: item.verifiedBy
    });
    setIsCertModalOpen(true);
  };

  return (
    <div className="page-wrapper" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <button
              onClick={() => setActiveTab('donor-dashboard')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                marginBottom: '0.5rem'
              }}
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800' }}>My Donation History & Certificates</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Official records of your voluntary contributions to the national blood supply.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--bg-secondary)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem'
              }}
            >
              <Award size={18} color="#ef4444" />
              <span>Total Records: <strong>{history.length}</strong></span>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setLogoutModalOpen(true)}
              style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
              title="Sign out of donor account"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>

        {/* History Table */}
        {loading ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading verified history records...
          </div>
        ) : history.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <History size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No donations recorded yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your future donations at registered blood banks and camps will automatically appear here with verified certificates.
            </p>
            <button className="btn btn-primary" onClick={() => setActiveTab('camps')}>
              Find a Camp Near You
            </button>
          </div>
        ) : (
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>Date</th>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>Blood Center</th>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>Blood Group</th>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>Component</th>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>Certificate ID</th>
                    <th style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontWeight: '600', textAlign: 'right' }}>Certificate</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={15} color="var(--primary-light)" />
                          <span style={{ fontWeight: '600' }}>{item.donationDate}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Building2 size={15} color="var(--text-dim)" />
                          <span>{item.bloodBankName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        <span className="badge badge-blood">{item.bloodGroup}</span>
                      </td>
                      <td style={{ padding: '1.1rem 1.25rem' }}>
                        {item.component} ({item.unitsDonated || 1} Unit)
                      </td>
                      <td style={{ padding: '1.1rem 1.25rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        {item.certificateId}
                      </td>
                      <td style={{ padding: '1.1rem 1.25rem', textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            color: 'var(--primary-light)',
                            borderColor: 'var(--border-highlight)'
                          }}
                          onClick={() => handleOpenCertificate(item)}
                        >
                          <FileCheck size={15} /> View Certificate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Verifiable Certificate Modal */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        certificate={selectedCert}
      />

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
            You are signed in as <strong>{user?.name || 'Donor'}</strong>. Your certificates and donation records remain securely stored.
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

export default DonationHistory;
