import React, { useState, useEffect } from 'react';
import { publicApi } from '../../api/publicApi';
import { useApp } from '../../context/AppContext';
import { Building2, Search, MapPin, Phone, ShieldCheck, Clock, CheckCircle2, Award } from 'lucide-react';

export const BloodBankDirectory = () => {
  const { setActiveTab } = useApp();

  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStates();
    fetchBloodBanks();
  }, []);

  const fetchStates = async () => {
    try {
      const res = await publicApi.getStates();
      if (res.success) {
        setStates(res.states || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBloodBanks = async (state = selectedState, query = searchQuery) => {
    setLoading(true);
    try {
      const res = await publicApi.getBloodBanks({ state, query });
      if (res.success) {
        setBloodBanks(res.bloodBanks || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    fetchBloodBanks(state, searchQuery);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBloodBanks(selectedState, searchQuery);
  };

  return (
    <div className="page-wrapper" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-light)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <Building2 size={16} /> Blood Banks & Centers Directory
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Verified Blood Transfusion Centers</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Comprehensive registry of verified partner hospitals, regional blood centers, and voluntary transfusion facilities.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem'
          }}
        >
          <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Filter by State</label>
              <select
                className="form-control"
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
              >
                <option value="">All Indian States</option>
                {states.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Search by Hospital / Center Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. AIIMS, Safdarjung, Red Cross..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ height: '44px' }}>
              <Search size={16} /> Search Centers
            </button>
          </form>
        </div>

        {/* Directory Grid */}
        {loading ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading licensed centers...
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {bloodBanks.map(bb => (
              <div
                key={bb.id}
                className="glass-card interactive-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className="badge badge-gov">{bb.category || 'Licensed Center'}</span>
                    {bb.is24x7 && (
                      <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                        <Clock size={12} /> 24x7 Open
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', lineHeight: '1.3' }}>
                    {bb.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <MapPin size={15} style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                    <span>{bb.address}, {bb.district}, {bb.state} - {bb.pincode}</span>
                  </div>

                  {/* Badges / Features */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {bb.hasComponentFacility && (
                      <span style={{ fontSize: '0.72rem', background: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                        ✓ Components Facility
                      </span>
                    )}
                    {bb.hasAphaeresis && (
                      <span style={{ fontSize: '0.72rem', background: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                        ✓ Apheresis (Single Donor)
                      </span>
                    )}
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                      Lic: {bb.licenseNumber}
                    </span>
                  </div>
                </div>

                {/* Contacts & Action */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.82rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Helpline / Direct:</div>
                    <strong style={{ color: 'var(--text-main)' }}>{bb.helpline || bb.phone}</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {bb.phone && (
                      <a href={`tel:${bb.phone}`} className="btn btn-secondary btn-sm">
                        <Phone size={14} color="#ef4444" /> Call
                      </a>
                    )}
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setActiveTab('stock-search')}
                    >
                      View Stock
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodBankDirectory;
