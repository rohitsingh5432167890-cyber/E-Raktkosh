import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Modal';
import {
  Heart,
  Calendar,
  Award,
  ShieldCheck,
  QrCode,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  MapPin,
  LogOut,
  Lock
} from 'lucide-react';

export const DonorDashboard = () => {
  const { user, profile, logout } = useAuth();
  const { setActiveTab, showToast } = useApp();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    logout();
    setActiveTab('login');
    showToast('You have been securely signed out.', 'info');
  };

  const totalDonations = profile?.totalDonations || 0;
  const livesSaved = totalDonations * 3;
  const isEligible = profile?.eligibility?.isEligible ?? true;
  const daysRemaining = profile?.eligibility?.daysRemaining || 0;

  return (
    <div className="page-wrapper" style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Welcome Banner */}
        <div
          className="glass-card"
          style={{
            background: 'var(--hero-gradient)',
            border: '1px solid var(--border-highlight)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-blood">{profile?.bloodGroup || 'O+'} Positive</span>
                <span className="badge badge-gov">
                  <Award size={13} /> {profile?.badgeLevel || 'Registered Donor'}
                </span>
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff' }}>
                Welcome back, {user?.name || 'Valued Donor'}!
              </h1>
              <p style={{ color: '#cbd5e1', maxWidth: '600px', marginTop: '0.4rem', fontSize: '0.95rem' }}>
                Your commitment to voluntary donation powers emergency transfusion departments across the country. Every single unit touches up to 3 patient lives.
              </p>
            </div>

            {/* Header Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => setActiveTab('donor-pass')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 24px rgba(198, 40, 40, 0.4)'
                }}
              >
                <QrCode size={18} /> Show Digital Donor Pass
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setLogoutModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#f87171',
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  fontWeight: '600'
                }}
                title="Log out of donor account"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* 4 Stat Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}
        >
          {/* Metric 1 */}
          <div className="glass-card interactive-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Total Donations</span>
              <Heart size={20} color="#ef4444" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.5rem', color: 'var(--text-main)' }}>
              {totalDonations} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '400' }}>units</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#34d399', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ShieldCheck size={14} /> Verified in National Registry
            </div>
          </div>

          {/* Metric 2 */}
          <div className="glass-card interactive-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Estimated Lives Saved</span>
              <Sparkles size={20} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.5rem', color: '#fbbf24' }}>
              {livesSaved} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '400' }}>patients</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Multi-component hospital impact
            </div>
          </div>

          {/* Metric 3 */}
          <div className="glass-card interactive-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Eligibility Status</span>
              {isEligible ? <ShieldCheck size={20} color="#10b981" /> : <Clock size={20} color="#f59e0b" />}
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              {isEligible ? (
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>
                  Eligible Today
                </span>
              ) : (
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b' }}>
                  In {daysRemaining} Days
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              {profile?.lastDonationDate ? `Last donated on ${profile.lastDonationDate}` : 'Ready for first donation!'}
            </div>
          </div>

          {/* Metric 4 */}
          <div className="glass-card interactive-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Current Honors Tier</span>
              <Award size={20} color="#818cf8" />
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '0.5rem', color: '#a5b4fc' }}>
              {profile?.badgeLevel || 'Registered Donor'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Next tier at {totalDonations < 3 ? 3 : totalDonations < 5 ? 5 : 10} donations
            </div>
          </div>
        </div>

        {/* Quick Action Hub */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Card 1: Pass */}
          <div
            className="glass-card interactive-card"
            style={{ padding: '1.75rem', cursor: 'pointer' }}
            onClick={() => setActiveTab('donor-pass')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(198, 40, 40, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QrCode size={24} color="#ef4444" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Official QR Donor Card</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Digital credential for express check-in</p>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Display your verified QR pass at blood centers and mobile camps to instantly pull up your medical records.
            </p>
            <span style={{ color: 'var(--primary-light)', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Open Donor Card <ArrowRight size={15} />
            </span>
          </div>

          {/* Card 2: History & Certificates */}
          <div
            className="glass-card interactive-card"
            style={{ padding: '1.75rem', cursor: 'pointer' }}
            onClick={() => setActiveTab('donor-history')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={24} color="#60a5fa" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Donation History</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verifiable certificates & timeline</p>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              View and print your official Ministry of Health certificates of appreciation for every voluntary donation.
            </p>
            <span style={{ color: '#60a5fa', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              View All Certificates <ArrowRight size={15} />
            </span>
          </div>

          {/* Card 3: Upcoming Camps RSVP */}
          <div
            className="glass-card interactive-card"
            style={{ padding: '1.75rem', cursor: 'pointer' }}
            onClick={() => setActiveTab('camps')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={24} color="#34d399" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Upcoming Blood Drives</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Participate in local donation drives</p>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Find scheduled voluntary blood camps organized in your city by universities, hospitals, and NGOs.
            </p>
            <span style={{ color: '#34d399', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Browse Camps & RSVP <ArrowRight size={15} />
            </span>
          </div>
        </div>
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
            Sign out of Donor Portal?
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
            You are signed in as <strong>{user?.name || 'Donor'}</strong>. Your donation records and passes remain securely saved.
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

export default DonorDashboard;
