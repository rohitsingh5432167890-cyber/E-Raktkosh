import React, { useState, useEffect } from 'react';
import { publicApi } from '../../api/publicApi';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Modal';
import {
  AlertTriangle,
  ShieldAlert,
  Phone,
  PlusCircle,
  Building2,
  Clock,
  Heart,
  Send,
  Sparkles,
  MapPin
} from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMPONENTS = ['Whole Blood', 'PRBC', 'FFP', 'Platelets', 'SDP', 'Cryoprecipitate'];
const INDIAN_STATES = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Uttar Pradesh', 'Telangana'];

export const EmergencySOS = () => {
  const { showToast, refreshEmergencyAlerts } = useApp();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New SOS Form
  const [formData, setFormData] = useState({
    patientName: '',
    age: 28,
    bloodGroup: 'O-',
    component: 'PRBC',
    unitsNeeded: 2,
    hospitalName: '',
    state: 'Delhi',
    district: 'Central Delhi',
    attendantName: '',
    contactPhone: '',
    urgency: 'CRITICAL',
    reason: ''
  });

  useEffect(() => {
    fetchEmergencyRequests();
  }, []);

  const fetchEmergencyRequests = async () => {
    try {
      const res = await publicApi.getEmergencyRequests({ status: 'OPEN' });
      if (res.success) {
        setRequests(res.requests || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFillDemoSOS = () => {
    setFormData({
      patientName: 'Sunita Mehra',
      age: 42,
      bloodGroup: 'AB-',
      component: 'Platelets',
      unitsNeeded: 2,
      hospitalName: 'Safdarjung Hospital, New Delhi',
      state: 'Delhi',
      district: 'South Delhi',
      attendantName: 'Vikas Mehra (Brother)',
      contactPhone: '+91 98112 34567',
      urgency: 'CRITICAL',
      reason: 'Acute Dengue Hemorrhagic Shock - Platelets under 15,000'
    });
    showToast('Loaded sample emergency request.', 'info');
  };

  const handleSubmitSOS = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await publicApi.createEmergencyRequest(formData);
      if (res.success) {
        showToast(res.message, 'success');
        setIsCreateModalOpen(false);
        fetchEmergencyRequests();
        refreshEmergencyAlerts();
        // Reset form
        setFormData({
          patientName: '',
          age: 28,
          bloodGroup: 'O-',
          component: 'PRBC',
          unitsNeeded: 2,
          hospitalName: '',
          state: 'Delhi',
          district: 'Central Delhi',
          attendantName: '',
          contactPhone: '',
          urgency: 'CRITICAL',
          reason: ''
        });
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit SOS broadcast.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#ef4444', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <ShieldAlert size={16} /> BloodBuddy Emergency Alert System
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Live Emergency SOS Broadcasting</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Critical real-time transfusion requirements broadcast to registered voluntary donors and verified hospital centers.
            </p>
          </div>

          <button
            className="btn btn-danger-sos btn-lg"
            onClick={() => setIsCreateModalOpen(true)}
            style={{ fontWeight: '700' }}
          >
            <PlusCircle size={18} /> Request Blood Urgently (SOS)
          </button>
        </div>

        {/* SOS Cards Grid */}
        {loading ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Connecting to emergency broadcast pipeline...
          </div>
        ) : requests.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <ShieldAlert size={40} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Active Emergency SOS Requests</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              All current hospital transfusion requests have been successfully fulfilled.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {requests.map(req => {
              const progressPct = Math.min(100, Math.round(((req.unitsFulfilled || 0) / req.unitsNeeded) * 100));

              return (
                <div
                  key={req.id}
                  className="glass-card interactive-card"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: req.urgency === 'CRITICAL' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-color)',
                    background: req.urgency === 'CRITICAL' ? 'linear-gradient(180deg, rgba(239, 68, 68, 0.05) 0%, var(--bg-card) 100%)' : 'var(--bg-card)'
                  }}
                >
                  <div>
                    {/* Top Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span className="badge badge-urgent" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                        {req.urgency} EMERGENCY
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} /> {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Patient & Group */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                      <span
                        style={{
                          fontSize: '1.8rem',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: '900',
                          color: '#ff4d4d',
                          background: 'rgba(255, 77, 77, 0.15)',
                          padding: '0.15rem 0.65rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 77, 77, 0.3)'
                        }}
                      >
                        {req.bloodGroup}
                      </span>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', lineHeight: '1.2' }}>
                          {req.patientName}
                        </h3>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Age: {req.age} yrs • Need: <strong>{req.unitsNeeded} unit(s) of {req.component}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Hospital & Reason */}
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                        <Building2 size={14} color="#60a5fa" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                        <strong style={{ color: 'var(--text-main)' }}>{req.hospitalName}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '1.25rem' }}>
                        <span>{req.district}, {req.state}</span>
                      </div>
                      {req.reason && (
                        <div style={{ fontStyle: 'italic', background: 'rgba(255, 255, 255, 0.03)', padding: '0.45rem 0.65rem', borderRadius: '6px', marginTop: '0.35rem', color: '#cbd5e1' }}>
                          "{req.reason}"
                        </div>
                      )}
                    </div>

                    {/* Fulfillment Progress Bar */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Fulfillment Status:</span>
                        <strong style={{ color: req.unitsFulfilled > 0 ? '#34d399' : '#f87171' }}>
                          {req.unitsFulfilled || 0} of {req.unitsNeeded} Units Arranged
                        </strong>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${progressPct}%`,
                            height: '100%',
                            background: progressPct >= 100 ? '#10b981' : 'var(--primary-gradient)',
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Attendant & Call Action */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.78rem' }}>
                      <div style={{ color: 'var(--text-dim)' }}>Attendant:</div>
                      <strong style={{ color: 'var(--text-main)' }}>{req.attendantName}</strong>
                    </div>

                    <a
                      href={`tel:${req.contactPhone}`}
                      className="btn btn-danger-sos btn-sm"
                      style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Phone size={14} /> Call {req.contactPhone}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Request Urgent Blood (Create SOS) Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Emergency Blood SOS Broadcast"
          maxWidth="640px"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Fill patient clinical details. Submissions immediately alert compatible voluntary donors in this region.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleFillDemoSOS}
              style={{ fontSize: '0.75rem', color: '#fbbf24', flexShrink: 0 }}
            >
              <Sparkles size={13} /> Sample SOS Data
            </button>
          </div>

          <form onSubmit={handleSubmitSOS}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Patient Name</label>
                <input
                  type="text"
                  name="patientName"
                  className="form-control"
                  placeholder="e.g. Ramesh Chandra"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  name="age"
                  className="form-control"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select name="bloodGroup" className="form-control" value={formData.bloodGroup} onChange={handleChange}>
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Component</label>
                <select name="component" className="form-control" value={formData.component} onChange={handleChange}>
                  {COMPONENTS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Units Needed</label>
                <input
                  type="number"
                  name="unitsNeeded"
                  className="form-control"
                  min="1"
                  max="10"
                  value={formData.unitsNeeded}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Admitted Hospital Name</label>
              <input
                type="text"
                name="hospitalName"
                className="form-control"
                placeholder="e.g. AIIMS Trauma Center, Room 402"
                value={formData.hospitalName}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">State</label>
                <select name="state" className="form-control" value={formData.state} onChange={handleChange}>
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">District</label>
                <input
                  type="text"
                  name="district"
                  className="form-control"
                  value={formData.district}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Attendant Name & Relation</label>
                <input
                  type="text"
                  name="attendantName"
                  className="form-control"
                  placeholder="e.g. Suresh (Brother)"
                  value={formData.attendantName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Direct Contact Number</label>
                <input
                  type="tel"
                  name="contactPhone"
                  className="form-control"
                  placeholder="+91 98765 43210"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Urgency Level & Medical Indication</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <select name="urgency" className="form-control" value={formData.urgency} onChange={handleChange}>
                  <option value="CRITICAL">CRITICAL (Within 2 Hours)</option>
                  <option value="HIGH">HIGH (Today)</option>
                  <option value="NORMAL">NORMAL (Scheduled Surgery)</option>
                </select>
                <input
                  type="text"
                  name="reason"
                  className="form-control"
                  placeholder="e.g. Emergency Cardiac Bypass / Accident Trauma"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger-sos"
                disabled={submitting}
              >
                <Send size={16} />
                {submitting ? 'Broadcasting SOS...' : 'Broadcast Emergency SOS'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default EmergencySOS;
