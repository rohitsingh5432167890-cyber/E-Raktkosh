import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Modal';
import {
  Building2,
  Boxes,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Droplets,
  TrendingDown,
  LogOut,
  Lock
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, bloodBank, logout } = useAuth();
  const { setActiveTab, showToast } = useApp();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    logout();
    setActiveTab('login');
    showToast('You have been securely signed out.', 'info');
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await adminApi.getDashboard();
      if (res.success) {
        setDashboardData(res);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const metrics = dashboardData?.metrics || {
    totalUnits: 0,
    lowStockCount: 0,
    upcomingCampsCount: 0,
    pendingEmergencyCount: 0
  };

  const facility = bloodBank || dashboardData?.bloodBank;

  return (
    <div className="page-wrapper" style={{ padding: '2rem 0' }}>
      <div className="container">
        {/* Header Facility Banner */}
        <div
          className="glass-card"
          style={{
            background: 'linear-gradient(135deg, #0b1a30 0%, #1e3a8a 60%, #0f172a 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-gov">
                  <Building2 size={13} /> Partner Blood Center
                </span>
                <span style={{ fontSize: '0.78rem', color: '#93c5fd', fontFamily: 'monospace' }}>
                  Center Code: {facility?.licenseNumber || 'BB-BLD-1996-001'}
                </span>
              </div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#ffffff' }}>
                {facility?.name || 'AIIMS Central Blood Bank & Transfusion Medicine'}
              </h1>
              <p style={{ color: '#bfdbfe', maxWidth: '650px', marginTop: '0.4rem', fontSize: '0.92rem' }}>
                Operational Manager: <strong>{user?.name}</strong> • 24x7 Facility: <strong>{facility?.is24x7 ? 'Active' : 'Standard'}</strong> • {facility?.district}, {facility?.state}
              </p>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={() => setActiveTab('admin-stock')}
                style={{ background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' }}
              >
                <Boxes size={18} /> Manage Inventory
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setActiveTab('admin-verify')}
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}
              >
                <CheckCircle2 size={18} color="#34d399" /> Verification Hub
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setLogoutModalOpen(true)}
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: '600'
                }}
                title="Log out of admin session"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Top 4 Metrics */}
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
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Available Units</span>
              <Droplets size={20} color="#ef4444" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.5rem', color: 'var(--text-main)' }}>
              {metrics.totalUnits} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '400' }}>units</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Across 8 groups & 6 components
            </div>
          </div>

          {/* Metric 2 */}
          <div className="glass-card interactive-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Low Stock Alerts</span>
              <AlertTriangle size={20} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.5rem', color: metrics.lowStockCount > 0 ? '#ef4444' : '#10b981' }}>
              {metrics.lowStockCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '400' }}>items</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Requires voluntary drives
            </div>
          </div>

          {/* Metric 3 */}
          <div className="glass-card interactive-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Scheduled Camps</span>
              <Calendar size={20} color="#34d399" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.5rem', color: '#34d399' }}>
              {metrics.upcomingCampsCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '400' }}>drives</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Under facility supervision
            </div>
          </div>

          {/* Metric 4 */}
          <div className="glass-card interactive-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Regional SOS Calls</span>
              <ShieldAlert size={20} color="#dc2626" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.5rem', color: '#f87171' }}>
              {metrics.pendingEmergencyCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '400' }}>requests</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Awaiting fulfillment dispatch
            </div>
          </div>
        </div>

        {/* Low Stock Alerts Section */}
        {dashboardData?.lowStockAlerts && dashboardData.lowStockAlerts.length > 0 && (
          <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <TrendingDown size={20} color="#ef4444" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Critical / Low Inventory Alerts</h3>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveTab('admin-stock')}
                style={{ fontSize: '0.8rem' }}
              >
                Open Stock Matrix <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.75rem' }}>
              {dashboardData.lowStockAlerts.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ff4d4d', fontFamily: 'var(--font-heading)' }}>
                      {item.bloodGroup}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.component}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ef4444' }}>{item.units} <span style={{ fontSize: '0.75rem' }}>units</span></div>
                    <span style={{ fontSize: '0.65rem', color: '#fca5a5', textTransform: 'uppercase', fontWeight: '700' }}>CRITICAL</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two Columns: Urgent SOS Board & Scheduled Camps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
          {/* Urgent SOS Calls */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={18} color="#ef4444" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Active Regional SOS Requests</h3>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveTab('admin-verify')}
                style={{ fontSize: '0.78rem' }}
              >
                Fulfill Units <ArrowRight size={13} />
              </button>
            </div>

            {dashboardData?.urgentRequests && dashboardData.urgentRequests.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dashboardData.urgentRequests.map(sos => (
                  <div
                    key={sos.id}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                        <span className="badge badge-urgent">{sos.urgency}</span>
                        <strong style={{ fontSize: '0.9rem' }}>{sos.patientName}</strong>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {sos.hospitalName} • Need: <strong>{sos.unitsNeeded} units of {sos.bloodGroup} ({sos.component})</strong>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setActiveTab('admin-verify')}
                      style={{ fontSize: '0.75rem' }}
                    >
                      Dispatch
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem 0' }}>
                No active SOS requests at this moment.
              </div>
            )}
          </div>

          {/* Upcoming Camps */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} color="#34d399" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Supervised Donation Camps</h3>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveTab('admin-verify')}
                style={{ fontSize: '0.78rem' }}
              >
                + New Camp
              </button>
            </div>

            {dashboardData?.upcomingCamps && dashboardData.upcomingCamps.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dashboardData.upcomingCamps.map(camp => (
                  <div
                    key={camp.id}
                    style={{
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '0.85rem 1rem'
                    }}
                  >
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      {camp.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Date: {camp.startDate} • Venue: {camp.venue}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Target: {camp.targetUnits} units</span>
                      <span>Registered Citizens: {camp.registeredDonors?.length || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem 0' }}>
                No upcoming camps scheduled under this center.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Confirm Admin Sign Out"
        maxWidth="460px"
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
            Sign out of Admin Hub?
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
            You are managing <strong>{facility?.name || 'Blood Bank'}</strong> as <strong>{user?.name}</strong>. Stock data and verification history remain safe in the BloodBuddy registry.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => setLogoutModalOpen(false)}
            >
              Cancel
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
              <LogOut size={15} /> Yes, Sign Out
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
