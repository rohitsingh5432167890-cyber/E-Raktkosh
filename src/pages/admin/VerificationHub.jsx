import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import CertificateModal from '../../components/CertificateModal';
import Modal from '../../components/Modal';
import {
  CheckCircle2,
  ShieldAlert,
  Calendar,
  Sparkles,
  ArrowLeft,
  UserCheck,
  Send,
  PlusCircle,
  Clock,
  Heart,
  LogOut
} from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMPONENTS = ['Whole Blood', 'PRBC', 'FFP', 'Platelets', 'SDP', 'Cryoprecipitate'];

export const VerificationHub = () => {
  const { user, bloodBank, logout } = useAuth();
  const { setActiveTab, showToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('verify'); // 'verify', 'emergency', 'camps'
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    logout();
    setActiveTab('login');
    showToast('You have been securely signed out.', 'info');
  };

  // Verification State
  const [donorIdentifier, setDonorIdentifier] = useState('');
  const [verifyGroup, setVerifyGroup] = useState('O+');
  const [verifyComponent, setVerifyComponent] = useState('Whole Blood');
  const [verifyUnits, setVerifyUnits] = useState(1);
  const [verifying, setVerifying] = useState(false);
  const [issuedCertificate, setIssuedCertificate] = useState(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Emergency Triage State
  const [emergencyList, setEmergencyList] = useState([]);
  const [loadingEmergency, setLoadingEmergency] = useState(false);
  const [dispatchingId, setDispatchingId] = useState(null);

  // Camp Creation State
  const [campName, setCampName] = useState('');
  const [campOrganizer, setCampOrganizer] = useState('');
  const [campVenue, setCampVenue] = useState('');
  const [campDate, setCampDate] = useState('2026-09-30');
  const [campTime, setCampTime] = useState('09:00 AM - 04:00 PM');
  const [campTarget, setCampTarget] = useState(150);
  const [creatingCamp, setCreatingCamp] = useState(false);
  const [campsList, setCampsList] = useState([]);

  useEffect(() => {
    if (activeSubTab === 'emergency') {
      fetchEmergency();
    } else if (activeSubTab === 'camps') {
      fetchCamps();
    }
  }, [activeSubTab]);

  const fetchEmergency = async () => {
    setLoadingEmergency(true);
    try {
      const res = await adminApi.getEmergencyRequests();
      if (res.success) {
        setEmergencyList(res.requests || []);
      }
    } catch (err) {
      showToast('Failed to load emergency SOS calls.', 'error');
    } finally {
      setLoadingEmergency(false);
    }
  };

  const fetchCamps = async () => {
    try {
      const res = await adminApi.getCamps();
      if (res.success) {
        setCampsList(res.camps || []);
      }
    } catch (err) {
      console.error('Failed to load camps:', err);
    }
  };

  const handleFillDemoDonor = () => {
    setDonorIdentifier('donor@bloodbuddy.org');
    setVerifyGroup('O+');
    setVerifyComponent('Whole Blood');
    showToast('Loaded demo donor Rahul Sharma (donor@bloodbuddy.org)', 'info');
  };

  const handleVerifyDonation = async (e) => {
    e.preventDefault();
    if (!donorIdentifier) {
      showToast('Please specify a donor ID or registered email.', 'error');
      return;
    }

    setVerifying(true);
    try {
      const res = await adminApi.verifyDonation({
        donorIdentifier,
        bloodGroup: verifyGroup,
        component: verifyComponent,
        units: Number(verifyUnits)
      });

      if (res.success) {
        showToast(res.message, 'success');
        setIssuedCertificate(res.certificate);
        setIsCertModalOpen(true);
        setDonorIdentifier('');
      }
    } catch (err) {
      showToast(err.message || 'Donation verification failed.', 'error');
    } finally {
      setVerifying(false);
    }
  };

  const handleFulfillEmergency = async (reqId, unitsNeeded) => {
    setDispatchingId(reqId);
    try {
      const res = await adminApi.fulfillEmergency(reqId, {
        unitsFulfilled: 1,
        deductStock: true
      });

      if (res.success) {
        showToast(res.message, 'success');
        fetchEmergency();
      }
    } catch (err) {
      showToast(err.message || 'Fulfillment dispatch failed.', 'error');
    } finally {
      setDispatchingId(null);
    }
  };

  const handleCreateCamp = async (e) => {
    e.preventDefault();
    setCreatingCamp(true);
    try {
      const res = await adminApi.createCamp({
        name: campName,
        organizer: campOrganizer,
        venue: campVenue,
        startDate: campDate,
        endDate: campDate,
        timeSlot: campTime,
        targetUnits: Number(campTarget)
      });

      if (res.success) {
        showToast('Voluntary donation camp scheduled successfully!', 'success');
        setCampName('');
        setCampOrganizer('');
        setCampVenue('');
        fetchCamps();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create camp.', 'error');
    } finally {
      setCreatingCamp(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <button
              onClick={() => setActiveTab('admin-dashboard')}
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
            <h1 style={{ fontSize: '1.9rem', fontWeight: '800' }}>Admin Verification & Dispatch Hub</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Facility: <strong>{bloodBank?.name || 'AIIMS Central Blood Bank'}</strong>
            </p>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setLogoutModalOpen(true)}
            style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
            title="Sign out of admin session"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>

        {/* Sub-Tab Navigation */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.35rem',
            marginBottom: '2rem',
            border: '1px solid var(--border-color)',
            gap: '0.35rem'
          }}
        >
          <button
            className={`btn btn-sm ${activeSubTab === 'verify' ? 'btn-primary' : ''}`}
            onClick={() => setActiveSubTab('verify')}
            style={{ flex: 1 }}
          >
            <CheckCircle2 size={16} /> Record & Verify Donation
          </button>
          <button
            className={`btn btn-sm ${activeSubTab === 'emergency' ? 'btn-primary' : ''}`}
            onClick={() => setActiveSubTab('emergency')}
            style={{ flex: 1 }}
          >
            <ShieldAlert size={16} /> Emergency SOS Triage
          </button>
          <button
            className={`btn btn-sm ${activeSubTab === 'camps' ? 'btn-primary' : ''}`}
            onClick={() => setActiveSubTab('camps')}
            style={{ flex: 1 }}
          >
            <Calendar size={16} /> Schedule Blood Camp
          </button>
        </div>

        {/* Sub-Tab 1: Record & Verify Donation */}
        {activeSubTab === 'verify' && (
          <div
            className="glass-card"
            style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Donor Transfusion Verification</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Verify donor intake at the blood center or mobile camp to update stock and generate an official verified certificate.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleFillDemoDonor}
                style={{ fontSize: '0.8rem', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)' }}
              >
                <Sparkles size={14} /> Quick Demo Fill: Rahul Sharma
              </button>
            </div>

            <form onSubmit={handleVerifyDonation}>
              <div className="form-group">
                <label className="form-label">Donor Registered Email or ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. donor@bloodbuddy.org or usr-donor-01"
                  value={donorIdentifier}
                  onChange={(e) => setDonorIdentifier(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <select
                    className="form-control"
                    value={verifyGroup}
                    onChange={(e) => setVerifyGroup(e.target.value)}
                  >
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Component Donated</label>
                  <select
                    className="form-control"
                    value={verifyComponent}
                    onChange={(e) => setVerifyComponent(e.target.value)}
                  >
                    {COMPONENTS.map(comp => (
                      <option key={comp} value={comp}>{comp}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Units Donated</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="form-control"
                    value={verifyUnits}
                    onChange={(e) => setVerifyUnits(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.82rem',
                  color: '#a7f3d0'
                }}
              >
                Verification automatically checks eligibility intervals, updates the facility's inventory by <strong>+{verifyUnits} unit(s)</strong>, increments donor milestones, and issues an authenticated certificate.
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={verifying}
              >
                <UserCheck size={18} />
                {verifying ? 'Verifying & Generating Certificate...' : 'Verify Donation & Issue Certificate'}
              </button>
            </form>
          </div>
        )}

        {/* Sub-Tab 2: Emergency SOS Triage */}
        {activeSubTab === 'emergency' && (
          <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Active Regional SOS Requests</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Dispatched blood units are subtracted from facility inventory and notify hospital attendants.
              </p>
            </div>

            {loadingEmergency ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading emergency requests...
              </div>
            ) : emergencyList.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No active SOS requests at this moment.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {emergencyList.map(item => (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: item.status === 'OPEN' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                        <span className="badge badge-urgent">{item.urgency}</span>
                        <span className="badge badge-blood">{item.bloodGroup}</span>
                        <strong style={{ fontSize: '1.05rem' }}>{item.patientName} ({item.age} yrs)</strong>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Hospital: <strong>{item.hospitalName}</strong> • {item.district}, {item.state}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                        Requirement: <strong>{item.unitsNeeded} unit(s) of {item.component}</strong> • Fulfilled: {item.unitsFulfilled || 0} unit(s)
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                        Attendant: {item.attendantName} ({item.contactPhone}) • Reason: {item.reason}
                      </div>
                    </div>

                    <div>
                      {item.status === 'OPEN' ? (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleFulfillEmergency(item.id, item.unitsNeeded)}
                          disabled={dispatchingId === item.id}
                        >
                          <Send size={14} />
                          {dispatchingId === item.id ? 'Dispatching...' : 'Dispatch 1 Unit'}
                        </button>
                      ) : (
                        <span className="badge badge-success">
                          FULFILLED
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sub-Tab 3: Schedule Blood Camp */}
        {activeSubTab === 'camps' && (
          <div className="glass-card" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Schedule a Voluntary Blood Donation Camp
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Publish mobile donation drives organized with educational institutions, corporates, and community halls.
            </p>

            <form onSubmit={handleCreateCamp} style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Camp Drive Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. DU North Campus Blood Drive"
                    value={campName}
                    onChange={(e) => setCampName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Co-Organizer / Partner</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Rotary Club / NSS Wing"
                    value={campOrganizer}
                    onChange={(e) => setCampOrganizer(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Venue Location & Landmark</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Auditorium Hall, Delhi University Main Campus"
                  value={campVenue}
                  onChange={(e) => setCampVenue(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={campDate}
                    onChange={(e) => setCampDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Operational Hours</label>
                  <input
                    type="text"
                    className="form-control"
                    value={campTime}
                    onChange={(e) => setCampTime(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Units</label>
                  <input
                    type="number"
                    className="form-control"
                    value={campTarget}
                    onChange={(e) => setCampTarget(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={creatingCamp}
              >
                <PlusCircle size={16} />
                {creatingCamp ? 'Publishing Camp...' : 'Schedule & Publish Camp'}
              </button>
            </form>

            {/* Existing Camps List */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>
                Scheduled Drives ({campsList.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {campsList.map(camp => (
                  <div
                    key={camp.id}
                    style={{
                      background: 'var(--bg-secondary)',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700' }}>{camp.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {camp.venue} • Date: {camp.startDate} ({camp.timeSlot})
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                      <span className="badge badge-success">Target: {camp.targetUnits}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Certificate Modal when verification completes */}
        <CertificateModal
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          certificate={issuedCertificate}
        />

        {/* Logout Confirmation Modal */}
        <Modal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          title="Confirm Admin Sign Out"
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
              Sign out of Admin Session?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              You are signed in as <strong>{user?.name || 'Admin'}</strong>. All verified certificates and emergency logs remain saved in the BloodBuddy registry.
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
    </div>
  );
};

export default VerificationHub;
