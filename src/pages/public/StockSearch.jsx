import React, { useState, useEffect } from 'react';
import { publicApi } from '../../api/publicApi';
import { useApp } from '../../context/AppContext';
import { ALL_INDIAN_STATES } from '../../constants/indiaData';
import { Search, Building2, Phone, MapPin, Clock, AlertTriangle, ShieldCheck, Filter } from 'lucide-react';

const BLOOD_GROUPS = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMPONENTS = ['ALL', 'Whole Blood', 'PRBC', 'FFP', 'Platelets', 'SDP', 'Cryoprecipitate'];

export const StockSearch = () => {
  const { showToast, t } = useApp();

  const [states, setStates] = useState(ALL_INDIAN_STATES);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState('Delhi');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [selectedComponent, setSelectedComponent] = useState('ALL');

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load States
  useEffect(() => {
    fetchStates();
  }, []);

  // Load Districts when state changes
  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState);
    } else {
      setDistricts([]);
      setSelectedDistrict('');
    }
  }, [selectedState]);

  // Query stocks on filter changes
  useEffect(() => {
    executeSearch();
  }, [selectedState, selectedDistrict, selectedGroup, selectedComponent]);

  const fetchStates = async () => {
    try {
      const res = await publicApi.getStates();
      if (res.success && res.states?.length > 0) {
        setStates(res.states);
      }
    } catch (err) {
      console.error('Failed to load states:', err);
    }
  };

  const fetchDistricts = async (state) => {
    try {
      const res = await publicApi.getDistricts(state);
      if (res.success) {
        setDistricts(res.districts || []);
        setSelectedDistrict(''); // Reset district when state changes
      }
    } catch (err) {
      console.error('Failed to load districts:', err);
    }
  };

  const executeSearch = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (selectedState) filters.state = selectedState;
      if (selectedDistrict) filters.district = selectedDistrict;
      if (selectedGroup !== 'ALL') filters.bloodGroup = selectedGroup;
      if (selectedComponent !== 'ALL') filters.component = selectedComponent;

      const res = await publicApi.searchStock(filters);
      if (res.success) {
        setStocks(res.stocks || []);
      }
    } catch (err) {
      showToast('Could not fetch blood stock.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-light)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <Search size={16} /> {t('instantStockLookup')}
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>{t('liveInventoryTitle')}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {t('liveInventorySubtitle')}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div
          className="glass-card"
          style={{
            padding: '1.75rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
            border: '1px solid var(--border-highlight)'
          }}
        >
          {/* Location Cascading Dropdowns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('selectState')}</label>
              <select
                className="form-control"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">{t('allStates')}</option>
                {states.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('selectDistrict')}</label>
              <select
                className="form-control"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedState}
              >
                <option value="">{selectedState ? `${t('allDistricts')} in ${selectedState}` : t('allDistricts')}</option>
                {districts.map(dt => (
                  <option key={dt} value={dt}>{dt}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('component')}</label>
              <select
                className="form-control"
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
              >
                <option value="ALL">{t('allComponents')}</option>
                {COMPONENTS.filter(c => c !== 'ALL').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Blood Group Chips */}
          <div>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>
              {t('bloodGroup')}
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {BLOOD_GROUPS.map(bg => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setSelectedGroup(bg)}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    fontFamily: 'var(--font-heading)',
                    backgroundColor: selectedGroup === bg ? 'var(--primary-red)' : 'var(--bg-tertiary)',
                    color: selectedGroup === bg ? '#ffffff' : 'var(--text-muted)',
                    border: selectedGroup === bg ? '1px solid #ef4444' : '1px solid var(--border-color)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {bg === 'ALL' ? t('allGroups') : bg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Showing <strong>{stocks.length}</strong> {t('unitsInStock')}
          </div>
        </div>

        {/* Stock Cards Grid */}
        {loading ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            {t('loading')}
          </div>
        ) : stocks.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <AlertTriangle size={36} color="#f59e0b" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{t('noStockFound')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Try selecting another state or requesting units via our Emergency SOS board.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {stocks.map(item => (
              <div
                key={item.id}
                className="glass-card interactive-card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Top Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="blood-type" style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--primary-light)' }}>
                        {item.bloodGroup}
                      </span>
                      <span className="badge badge-gov">{item.component}</span>
                    </div>

                    {item.isLow ? (
                      <span className="badge badge-urgent">{t('lowStock')}</span>
                    ) : (
                      <span className="badge badge-success">{t('available')}</span>
                    )}
                  </div>

                  {/* Units available count */}
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>
                      {item.units}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                      {t('units')}
                    </span>
                  </div>

                  {/* Blood Bank Info */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', fontSize: '0.82rem' }}>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      {item.bloodBank?.name || item.bloodBankName || `${item.state} Blood Center`}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                      <MapPin size={13} style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                      <span>{item.district}, {item.state}</span>
                    </div>
                    {item.bloodBank?.is24x7 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontSize: '0.75rem', fontWeight: '600' }}>
                        <Clock size={12} /> {t('open24x7')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact CTA */}
                <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {item.lastUpdated ? `${t('lastUpdated')}: ${new Date(item.lastUpdated).toLocaleDateString()}` : 'Live'}
                  </span>
                  {item.bloodBank?.phone && (
                    <a
                      href={`tel:${item.bloodBank.phone}`}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Phone size={13} color="#ef4444" /> {t('callNow')}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockSearch;
