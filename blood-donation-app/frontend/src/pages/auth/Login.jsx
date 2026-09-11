import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { LogIn, UserCheck, Shield, Sparkles, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const { setActiveTab, showToast } = useApp();

  const [role, setRole] = useState('donor'); // 'donor' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFillDemo = (demoType) => {
    setError('');
    if (demoType === 'donor') {
      setRole('donor');
      setEmail('donor@eraktkosh.in');
      setPassword('Donor@123');
      showToast('Populated Demo Voluntary Donor credentials.', 'info');
    } else {
      setRole('admin');
      setEmail('admin@aiims.edu');
      setPassword('Admin@123');
      showToast('Populated Demo Blood Bank Admin (AIIMS) credentials.', 'info');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password, role);
      if (res.success) {
        showToast(res.message, 'success');
        if (res.user.role === 'admin') {
          setActiveTab('admin-dashboard');
        } else {
          setActiveTab('donor-dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '480px',
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
            <LogIn size={26} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Portal Access</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Sign in to e-RaktKosh National Transfusion Network
          </p>
        </div>

        {/* Demo Credentials Quick Fill Banner */}
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px dashed rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            marginBottom: '1.5rem',
            fontSize: '0.82rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontWeight: '700', marginBottom: '0.5rem' }}>
            <Sparkles size={15} /> Instant 1-Click Demo Credentials:
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleFillDemo('donor')}
              style={{ fontSize: '0.75rem', flex: 1 }}
            >
              <UserCheck size={13} color="#ef5350" /> Demo Donor
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleFillDemo('admin')}
              style={{ fontSize: '0.75rem', flex: 1 }}
            >
              <Shield size={13} color="#60a5fa" /> Demo Admin (AIIMS)
            </button>
          </div>
        </div>

        {/* Role Toggle Switch */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.25rem',
            marginBottom: '1.5rem'
          }}
        >
          <button
            type="button"
            onClick={() => setRole('donor')}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: '4px',
              fontWeight: '600',
              fontSize: '0.85rem',
              backgroundColor: role === 'donor' ? 'var(--primary-red)' : 'transparent',
              color: role === 'donor' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            Donor Login
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: '4px',
              fontWeight: '600',
              fontSize: '0.85rem',
              backgroundColor: role === 'admin' ? 'var(--gov-blue)' : 'transparent',
              color: role === 'admin' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            Blood Bank Admin
          </button>
        </div>

        {/* Error Notice */}
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
              marginBottom: '1.25rem'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Registered Email</label>
            <input
              type="email"
              className="form-control"
              placeholder={role === 'donor' ? 'donor@eraktkosh.in' : 'admin@aiims.edu'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : `Sign In as ${role === 'donor' ? 'Donor' : 'Admin'}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have a donor account?{' '}
          <a
            href="#register"
            onClick={(e) => { e.preventDefault(); setActiveTab('register'); }}
            style={{ color: 'var(--primary-light)', fontWeight: '600' }}
          >
            Register as a Voluntary Donor
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
