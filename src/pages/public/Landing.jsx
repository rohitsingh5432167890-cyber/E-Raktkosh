import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ALL_INDIAN_STATES } from '../../constants/indiaData';
import {
  Droplets,
  Search,
  Building2,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Heart,
  Users,
  Award,
  ArrowRight,
  Activity,
  PhoneCall,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const Landing = () => {
  const { setActiveTab, portalStats, t } = useApp();
  const { isAuthenticated, isDonor, isAdmin } = useAuth();

  const [heroState, setHeroState] = useState('Delhi');
  const [heroGroup, setHeroGroup] = useState('O+');

  const handleQuickSearch = (e) => {
    e.preventDefault();
    setActiveTab('stock-search');
  };

  const totalUnits = portalStats?.totalUnitsAvailable || 1480;
  const totalBanks = portalStats?.licensedBloodBanks || 12;
  const totalDonors = portalStats?.registeredDonors || 350;
  const totalCamps = portalStats?.donationCampsOrganized || 4;

  return (
    <div className="page-wrapper">
      {/* Hero Banner Section with Merged Instant Stock Lookup */}
      <section style={{ padding: '1.5rem 0 2.5rem 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
              minHeight: '520px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              background: '#0b0f17'
            }}
          >
            {/* Background Image */}
            <img
              src="/hero-bg.jpg"
              alt="Donate Blood Save Lives - Blood Donation Campaign"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 20%',
                display: 'block',
                zIndex: 0
              }}
            />

            {/* Gradient Mask to ensure image is visible on top and seamlessly blends to bottom search overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '75%',
                background: 'linear-gradient(to top, rgba(11, 15, 23, 0.95) 0%, rgba(11, 15, 23, 0.72) 50%, rgba(11, 15, 23, 0.0) 100%)',
                zIndex: 1,
                pointerEvents: 'none'
              }}
            />

            {/* Merged Instant Blood Stock Lookup & Action Controls */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                padding: '1.5rem 1.5rem 2rem 1.5rem',
                maxWidth: '920px',
                width: '100%',
                margin: '0 auto',
                textAlign: 'center'
              }}
            >
              {/* Frosted Glass Search Card */}
              <div
                style={{
                  padding: '1.5rem 1.75rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(19, 27, 38, 0.88)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: '#ff6b6b', fontWeight: '800', fontSize: '1.1rem' }}>
                  <Search size={20} /> {t('instantStockLookup')}
                </div>

                <form onSubmit={handleQuickSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ marginBottom: 0, textAlign: 'left' }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f1f5f9' }}>{t('selectState')}</label>
                    <select
                      className="form-control"
                      value={heroState}
                      onChange={(e) => setHeroState(e.target.value)}
                      style={{ backgroundColor: 'rgba(11, 15, 23, 0.92)', color: '#ffffff', borderColor: 'var(--border-color)', height: '44px', fontWeight: '600' }}
                    >
                      {ALL_INDIAN_STATES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0, textAlign: 'left' }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f1f5f9' }}>{t('bloodGroup')}</label>
                    <select
                      className="form-control"
                      value={heroGroup}
                      onChange={(e) => setHeroGroup(e.target.value)}
                      style={{ backgroundColor: 'rgba(11, 15, 23, 0.92)', color: '#ffffff', borderColor: 'var(--border-color)', height: '44px', fontWeight: '600' }}
                    >
                      {BLOOD_GROUPS.map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{ height: '44px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <Search size={18} /> {t('searchInventory')}
                  </button>
                </form>
              </div>

              {/* Direct Action Buttons Merged into Banner Bottom */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                {!isAuthenticated && (
                  <button
                    className="btn btn-primary btn-md"
                    onClick={() => setActiveTab('register')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', boxShadow: '0 4px 14px rgba(198, 40, 40, 0.45)' }}
                  >
                    <Heart size={18} fill="#ffffff" color="#ffffff" strokeWidth={2.2} /> <span>{t('registerAsDonor')}</span>
                  </button>
                )}

                <button
                  className="btn btn-danger-sos btn-md"
                  onClick={() => setActiveTab('emergency-sos')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800' }}
                >
                  <AlertCircle size={18} color="#ffffff" strokeWidth={2.2} /> <span>{t('emergencySOS')}</span>
                </button>

                <button
                  className="btn btn-secondary btn-md"
                  onClick={() => setActiveTab('directory')}
                  style={{
                    fontWeight: '700',
                    backgroundColor: 'rgba(21, 30, 46, 0.94)',
                    backdropFilter: 'blur(12px)',
                    color: '#ffffff',
                    border: '1px solid rgba(96, 165, 250, 0.45)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.45)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Building2 size={18} color="#60a5fa" strokeWidth={2.2} /> <span>{t('bloodBankDirectory')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Platform Metrics */}
      <section style={{ padding: '2.5rem 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              textAlign: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary-light)', fontFamily: 'var(--font-heading)' }}>
                {totalUnits}+
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {t('unitsAvailable')}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#60a5fa', fontFamily: 'var(--font-heading)' }}>
                {totalBanks}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {t('partnerCenters')}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                {totalDonors}+
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {t('registeredDonors')}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
                {totalCamps}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                {t('activeDrives')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of BloodBuddy */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <span className="badge badge-blood" style={{ marginBottom: '0.5rem' }}>{t('coreCapabilities')}</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>{t('ecosystemTitle')}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
              {t('ecosystemSubtitle')}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {/* Feature 1 */}
            <div
              className="glass-card interactive-card"
              style={{ padding: '2rem', cursor: 'pointer' }}
              onClick={() => setActiveTab('stock-search')}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(198, 40, 40, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <Search size={26} color="#ef4444" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.65rem' }}>{t('featStockSearchTitle')}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                {t('featStockSearchDesc')}
              </p>
              <span style={{ color: 'var(--primary-light)', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {t('navStockSearch')} <ArrowRight size={15} />
              </span>
            </div>

            {/* Feature 2 */}
            <div
              className="glass-card interactive-card"
              style={{ padding: '2rem', cursor: 'pointer' }}
              onClick={() => setActiveTab('emergency-sos')}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <AlertCircle size={26} color="#ef4444" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.65rem' }}>{t('featSOSTitle')}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                {t('featSOSDesc')}
              </p>
              <span style={{ color: '#ef4444', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {t('emergencySOS')} <ArrowRight size={15} />
              </span>
            </div>

            {/* Feature 3 */}
            <div
              className="glass-card interactive-card"
              style={{ padding: '2rem', cursor: 'pointer' }}
              onClick={() => setActiveTab(isDonor ? 'donor-pass' : 'register')}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <Award size={26} color="#60a5fa" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.65rem' }}>{t('featPassTitle')}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                {t('featPassDesc')}
              </p>
              <span style={{ color: '#60a5fa', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {t('navDonorPass')} <ArrowRight size={15} />
              </span>
            </div>

            {/* Feature 4 */}
            <div
              className="glass-card interactive-card"
              style={{ padding: '2rem', cursor: 'pointer' }}
              onClick={() => setActiveTab('camps')}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <Calendar size={26} color="#34d399" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.65rem' }}>{t('featCampsTitle')}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                {t('featCampsDesc')}
              </p>
              <span style={{ color: '#34d399', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {t('navCamps')} <ArrowRight size={15} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Steps Donation Flow */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>{t('stepsTitle')}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
              {t('stepsSubtitle')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'rgba(198, 40, 40, 0.25)', position: 'absolute', top: '1rem', right: '1.25rem' }}>01</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{t('step1Title')}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {t('step1Desc')}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'rgba(198, 40, 40, 0.25)', position: 'absolute', top: '1rem', right: '1.25rem' }}>02</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{t('step2Title')}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {t('step2Desc')}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'rgba(198, 40, 40, 0.25)', position: 'absolute', top: '1rem', right: '1.25rem' }}>03</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{t('step3Title')}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {t('step3Desc')}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'rgba(198, 40, 40, 0.25)', position: 'absolute', top: '1rem', right: '1.25rem' }}>04</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{t('step4Title')}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {t('step4Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
