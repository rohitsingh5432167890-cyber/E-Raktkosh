import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Modal';
import { Boxes, Plus, Minus, ArrowLeft, RefreshCw, AlertTriangle, ShieldCheck, LogOut } from 'lucide-react';

const BLOOD_GROUPS = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMPONENTS = ['ALL', 'Whole Blood', 'PRBC', 'FFP', 'Platelets', 'SDP', 'Cryoprecipitate'];

export const StockInventoryManager = () => {
  const { bloodBank, user, logout } = useAuth();
  const { setActiveTab, showToast } = useApp();

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [selectedComponent, setSelectedComponent] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    logout();
    setActiveTab('login');
    showToast('You have been securely signed out.', 'info');
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getStock();
      if (res.success) {
        setStocks(res.stocks || []);
      }
    } catch (err) {
      showToast('Failed to load blood stock matrix.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustUnits = async (item, delta) => {
    if (item.units + delta < 0) return;
    setUpdatingId(item.id);

    try {
      const res = await adminApi.updateStock({
        bloodGroup: item.bloodGroup,
        component: item.component,
        delta
      });

      if (res.success) {
        setStocks(prev =>
          prev.map(s => (s.id === item.id ? { ...s, units: res.stock.units, isLow: res.stock.isLow } : s))
        );
        showToast(`Updated ${item.bloodGroup} ${item.component}: ${res.stock.units} units`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update stock units.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredStocks = stocks.filter(s => {
    if (selectedGroup !== 'ALL' && s.bloodGroup !== selectedGroup) return false;
    if (selectedComponent !== 'ALL' && s.component.toLowerCase() !== selectedComponent.toLowerCase()) return false;
    return true;
  });

  const totalUnits = stocks.reduce((acc, curr) => acc + (curr.units || 0), 0);
  const lowCount = stocks.filter(s => s.isLow).length;

  return (
    <div className="page-wrapper" style={{ padding: '2.5rem 0' }}>
      <div className="container">
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
            <h1 style={{ fontSize: '1.9rem', fontWeight: '800' }}>Live Blood Inventory Matrix</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Facility: <strong>{bloodBank?.name || 'AIIMS Central Blood Bank'}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                background: 'var(--bg-secondary)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem'
              }}
            >
              Total In Stock: <strong style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{totalUnits}</strong> units
            </div>
            {lowCount > 0 && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#fca5a5',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <AlertTriangle size={15} color="#ef4444" />
                <span>{lowCount} Low Stock Items</span>
              </div>
            )}
            <button
              className="btn btn-secondary btn-sm"
              onClick={fetchStock}
              title="Refresh inventory"
            >
              <RefreshCw size={15} /> Refresh
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setLogoutModalOpen(true)}
              style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
              title="Sign out of admin session"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>

        {/* Filters */}
        <div
          className="glass-card"
          style={{
            padding: '1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {/* Blood Group Filter Chips */}
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.4rem', display: 'block' }}>
              Filter by Blood Group:
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {BLOOD_GROUPS.map(bg => (
                <button
                  key={bg}
                  onClick={() => setSelectedGroup(bg)}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    fontFamily: 'var(--font-heading)',
                    backgroundColor: selectedGroup === bg ? 'var(--primary-red)' : 'var(--bg-tertiary)',
                    color: selectedGroup === bg ? '#ffffff' : 'var(--text-muted)',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Component Filter Chips */}
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.4rem', display: 'block' }}>
              Filter by Blood Component:
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {COMPONENTS.map(comp => (
                <button
                  key={comp}
                  onClick={() => setSelectedComponent(comp)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    backgroundColor: selectedComponent === comp ? 'var(--gov-blue)' : 'var(--bg-tertiary)',
                    color: selectedComponent === comp ? '#ffffff' : 'var(--text-muted)',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {comp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Matrix Grid */}
        {loading ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading live inventory records...
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1rem'
            }}
          >
            {filteredStocks.map(item => (
              <div
                key={item.id}
                className={`stock-cell ${item.isLow ? 'low-alert' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '180px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span className="blood-type">{item.bloodGroup}</span>
                    {item.isLow ? (
                      <span className="badge badge-urgent" style={{ fontSize: '0.65rem' }}>
                        Low (&le;5)
                      </span>
                    ) : (
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                        Adequate
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                    {item.component}
                  </div>
                </div>

                {/* Units Counter */}
                <div style={{ margin: '0.5rem 0' }}>
                  <div className="unit-count">
                    {item.units} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '400' }}>units</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Threshold: {item.threshold || 5} units
                  </div>
                </div>

                {/* Unit Increment / Decrement Controls */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: 'var(--bg-tertiary)',
                    padding: '0.35rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <button
                    onClick={() => handleAdjustUnits(item, -1)}
                    disabled={item.units <= 0 || updatingId === item.id}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#ef5350',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: item.units <= 0 ? 0.4 : 1
                    }}
                    title="Deduct 1 unit (transfusion dispatch)"
                  >
                    <Minus size={16} />
                  </button>

                  <span style={{ fontSize: '0.8rem', fontWeight: '700', minWidth: '40px', textAlign: 'center' }}>
                    {item.units}
                  </span>

                  <button
                    onClick={() => handleAdjustUnits(item, 1)}
                    disabled={updatingId === item.id}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Add 1 unit (tested donation intake)"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
            You are signed in as <strong>{user?.name || 'Admin'}</strong>. Any saved stock changes remain permanently stored in the registry.
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

export default StockInventoryManager;
