import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserPlus, Heart, CheckSquare, Square, AlertCircle } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const INDIAN_STATES = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Uttar Pradesh', 'Telangana'];

export const RegisterDonor = () => {
  const { registerDonor } = useAuth();
  const { setActiveTab, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bloodGroup: 'O+',
    dob: '1998-05-15',
    gender: 'Male',
    weight: 65,
    state: 'Delhi',
    district: 'Central Delhi',
    city: 'New Delhi',
    pincode: '110001'
  });

  const [eligibilityCheck, setEligibilityCheck] = useState({
    ageOk: true,
    weightOk: true,
    healthyOk: true,
    intervalOk: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleToggleCheck = (key) => {
    setEligibilityCheck(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecksPassed = Object.values(eligibilityCheck).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!allChecksPassed) {
      setError('Please review and confirm all health eligibility declarations.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerDonor(formData);
      if (res.success) {
        showToast('Registration successful! Welcome to BloodBuddy.', 'success');
        setActiveTab('donor-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: '3rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <div
          className="glass-card"
          style={{
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-highlight)'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 4px 16px rgba(198, 40, 40, 0.4)'
              }}
            >
              <Heart size={26} color="#ffffff" fill="#ffffff" />
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '800' }}>Become a Voluntary Donor</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
              Register on the BloodBuddy Network. One donation can save up to three lives.
            </p>
          </div>

          {/* Health Eligibility Pre-Screening Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '2rem'
            }}
          >
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem', color: '#fbbf24' }}>
              Medical Eligibility Declaration
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}
                onClick={() => handleToggleCheck('ageOk')}
              >
                {eligibilityCheck.ageOk ? <CheckSquare size={18} color="#10b981" /> : <Square size={18} />}
                <span>I am between 18 and 65 years of age</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}
                onClick={() => handleToggleCheck('weightOk')}
              >
                {eligibilityCheck.weightOk ? <CheckSquare size={18} color="#10b981" /> : <Square size={18} />}
                <span>I weigh at least 45 kg</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}
                onClick={() => handleToggleCheck('healthyOk')}
              >
                {eligibilityCheck.healthyOk ? <CheckSquare size={18} color="#10b981" /> : <Square size={18} />}
                <span>I feel in good health today (no fever/cold)</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}
                onClick={() => handleToggleCheck('intervalOk')}
              >
                {eligibilityCheck.intervalOk ? <CheckSquare size={18} color="#10b981" /> : <Square size={18} />}
                <span>I haven't donated blood in past 90 days</span>
              </div>
            </div>
          </div>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '1.5rem'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Blood Group Visual Selector */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">
                <span>Select Your Blood Group</span>
                <span style={{ color: 'var(--primary-light)', fontWeight: '700' }}>{formData.bloodGroup}</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '0.5rem' }}>
                {BLOOD_GROUPS.map(bg => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, bloodGroup: bg }))}
                    style={{
                      padding: '0.65rem 0.25rem',
                      borderRadius: '8px',
                      border: formData.bloodGroup === bg ? '2px solid #ef4444' : '1px solid var(--border-color)',
                      backgroundColor: formData.bloodGroup === bg ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-tertiary)',
                      color: formData.bloodGroup === bg ? '#ff5252' : 'var(--text-main)',
                      fontWeight: '800',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Legal Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="priya@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Mobile Number (SMS Alerts)</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="+91 98765 00000"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Create Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Vitals & Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  className="form-control"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select name="gender" className="form-control" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  className="form-control"
                  min="45"
                  max="160"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">State</label>
                <select name="state" className="form-control" value={formData.state} onChange={handleChange}>
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">District / City</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  placeholder="e.g. South Delhi"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  className="form-control"
                  placeholder="110001"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading}
            >
              <UserPlus size={18} />
              {loading ? 'Registering...' : 'Register & Receive Digital Pass'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Already registered with BloodBuddy?{' '}
            <a
              href="#login"
              onClick={(e) => { e.preventDefault(); setActiveTab('login'); }}
              style={{ color: 'var(--primary-light)', fontWeight: '600' }}
            >
              Sign In Here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterDonor;
