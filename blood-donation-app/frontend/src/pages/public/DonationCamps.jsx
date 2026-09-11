import React, { useState, useEffect } from 'react';
import { publicApi } from '../../api/publicApi';
import { donorApi } from '../../api/donorApi';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Modal';
import { Calendar, MapPin, Clock, Users, Building2, CheckCircle2, ArrowRight, Heart } from 'lucide-react';

export const DonationCamps = () => {
  const { isAuthenticated, isDonor, user } = useAuth();
  const { setActiveTab, showToast } = useApp();

  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    try {
      const res = await publicApi.getCamps();
      if (res.success) {
        setCamps(res.camps || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRsvp = (camp) => {
    if (!isAuthenticated) {
      showToast('Please sign in or register as a donor to reserve your slot.', 'info');
      setActiveTab('login');
      return;
    }
    if (!isDonor) {
      showToast('Only registered voluntary donors can register for donation slots.', 'warning');
      return;
    }
    setSelectedCamp(camp);
    setIsRsvpModalOpen(true);
  };

  const handleConfirmRsvp = async () => {
    if (!selectedCamp) return;
    setRegistering(true);
    try {
      const res = await donorApi.registerForCamp(selectedCamp.id);
      if (res.success) {
        showToast(res.message, 'success');
        setIsRsvpModalOpen(false);
        fetchCamps();
      }
    } catch (err) {
      showToast(err.message || 'Slot registration failed.', 'error');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-light)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <Calendar size={16} /> Voluntary Blood Donation Drives
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Upcoming Blood Donation Camps</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Join voluntary community camps organized across universities, community centers, and corporations.
          </p>
        </div>

        {/* Camps Grid */}
        {loading ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading upcoming donation drives...
          </div>
        ) : camps.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Calendar size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No active drives scheduled right now</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Check back soon or donate directly at any of our licensed blood banks.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {camps.map(camp => {
              const isRegistered = camp.registeredDonors?.includes(user?.id);

              return (
                <div
                  key={camp.id}
                  className="glass-card interactive-card"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderLeft: '4px solid var(--primary-red)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                        {camp.status || 'UPCOMING'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: '700' }}>
                        Target: {camp.targetUnits} units
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.4rem', lineHeight: '1.3' }}>
                      {camp.name}
                    </h3>

                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '500', marginBottom: '1rem' }}>
                      Organized by: {camp.organizer}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={15} color="var(--primary-light)" />
                        <strong style={{ color: 'var(--text-main)' }}>{camp.startDate}</strong>
                        <span style={{ color: 'var(--text-dim)' }}>({camp.timeSlot})</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <MapPin size={15} color="var(--primary-light)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                        <span>{camp.venue}, {camp.district}, {camp.state}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 size={15} color="var(--text-dim)" />
                        <span>Blood Bank: {camp.bloodBankName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Registered Donors & RSVP Button */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Users size={14} color="#34d399" />
                      <span>{camp.registeredDonors?.length || 0} Citizens Registered</span>
                    </div>

                    {isRegistered ? (
                      <span className="badge badge-success" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
                        <CheckCircle2 size={14} /> Slot Confirmed
                      </span>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenRsvp(camp)}
                      >
                        <Heart size={14} fill="#ffffff" /> RSVP Slot
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* RSVP Confirmation Modal */}
        <Modal
          isOpen={isRsvpModalOpen}
          onClose={() => setIsRsvpModalOpen(false)}
          title="Confirm Blood Donation Drive Slot"
          maxWidth="520px"
        >
          {selectedCamp && (
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                You are reserving a voluntary donation appointment for:
              </p>

              <div
                style={{
                  background: 'var(--bg-tertiary)',
                  padding: '1.25rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.35rem' }}>
                  {selectedCamp.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Date: <strong>{selectedCamp.startDate}</strong> ({selectedCamp.timeSlot})
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Venue: {selectedCamp.venue}
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#a7f3d0', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
                ✓ Present your Digital QR Pass on arrival for priority fast-track registration.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsRsvpModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleConfirmRsvp}
                  disabled={registering}
                >
                  {registering ? 'Reserving...' : 'Confirm My Slot'}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default DonationCamps;
