import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
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
const POPULAR_STATES = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Uttar Pradesh', 'Telangana'];

export const Landing = () => {
  const { setActiveTab, portalStats } = useApp();
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
      {/* Hero Section */}
      <section
        style={{
          background: 'var(--hero-gradient)',
          borderBottom: '1px solid var(--border-color)',
          padding: '4rem 0 5rem 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle background glow effect */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(198, 40, 40, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            {/* Government Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(198, 40, 40, 0.15)',
                border: '1px solid rgba(198, 40, 40, 0.35)',
                padding: '0.35rem 0.95rem',
                borderRadius: '9999px',
                color: '#fca5a5',
                fontSize: '0.8rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                boxShadow: '0 2px 10px rgba(198, 40, 40, 0.2)'
              }}
            >
              <ShieldCheck size={16} color="#ef4444" />
              <span>Ministry of Health and Family Welfare (MoHFW) Initiative</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
                fontWeight: '900',
                color: '#ffffff',
                lineHeight: '1.15',
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem'
              }}
            >
              Every Drop Counts. <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #ff4d4d 0%, #ff8080 50%, #ffb3b3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                India's Unified Blood Network.
              </span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: '#cbd5e1',
                lineHeight: '1.6',
                marginBottom: '2.5rem',
                maxWidth: '680px',
                margin: '0 auto 2.5rem auto'
              }}
            >
              Real-time blood stock availability across licensed government and charitable blood centers. Instant QR donor passes, voluntary camps, and emergency SOS triage.
            </p>

            {/* Fast Stock Search Widget */}
            <div
              className="glass-card"
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-card)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid rgba(198, 40, 40, 0.35)',
                marginBottom: '2rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#ff6b6b', fontWeight: '700', fontSize: '0.88rem' }}>
                <Search size={16} /> Instant Blood Stock Lookup
              </div>

              <form onSubmit={handleQuickSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ marginBottom: 0, textAlign: 'left' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Select State</label>
                  <select
                    className="form-control"
                    value={heroState}
                    onChange={(e) => setHeroState(e.target.value)}
                  >
                    {POPULAR_STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0, textAlign: 'left' }}>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Blood Group</label>
                  <select
                    className="form-control"
                    value={heroGroup}
                    onChange={(e) => setHeroGroup(e.target.value)}
                  >
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ height: '44px', fontWeight: '700' }}
                >
                  <Search size={18} /> Search Inventory
                </button>
              </form>
            </div>

            {/* Direct Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {!isAuthenticated && (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => setActiveTab('register')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Heart size={18} fill="#ffffff" /> Register as a Donor
                </button>
              )}

              <button
                className="btn btn-danger-sos btn-lg"
                onClick={() => setActiveTab('emergency-sos')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800' }}
              >
                <AlertCircle size={18} /> Emergency Blood SOS
              </button>

              <button
                className="btn btn-secondary btn-lg"
                onClick={() => setActiveTab('directory')}
              >
                <Building2 size={18} /> Blood Bank Directory
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live National Counters */}
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
                Units Available in Real-Time
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#60a5fa', fontFamily: 'var(--font-heading)' }}>
                {totalBanks}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Licensed Apex Blood Centers
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                {totalDonors}+
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Registered Voluntary Donors
              </div>
            </div>

            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
                {totalCamps}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Active Blood Drives
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of e-RaktKosh */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <span className="badge badge-blood" style={{ marginBottom: '0.5rem' }}>Core Capabilities</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Comprehensive Blood Ecosystem</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
              Built to eradicate blood shortages, ensure equitable distribution, and provide transparent emergency responses.
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.65rem' }}>Real-time Stock Search</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                Filter by State, District, Blood Group, and component (PRBC, Whole Blood, Platelets, FFP) to locate units instantly.
              </p>
              <span style={{ color: 'var(--primary-light)', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Search Stock <ArrowRight size={15} />
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.65rem' }}>Emergency SOS Dispatch</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                Immediate emergency broadcast to nearby voluntary donors and blood banks for urgent surgeries and trauma cases.
              </p>
              <span style={{ color: '#ef4444', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Broadcast SOS <ArrowRight size={15} />
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.65rem' }}>Digital QR Donor Pass</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                Every voluntary donor receives a tamper-proof QR pass with real-time donation interval checks and verified honors.
              </p>
              <span style={{ color: '#60a5fa', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Get Donor Pass <ArrowRight size={15} />
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.65rem' }}>Donation Drives & Camps</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                Browse scheduled mobile donation drives in colleges, tech parks, and community centers with instant RSVP slots.
              </p>
              <span style={{ color: '#34d399', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Browse Camps <ArrowRight size={15} />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Steps Donation Flow */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>The 4-Step Safe Donation Journey</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
              Voluntary blood donation takes less than 30 minutes and follows strict clinical guidelines.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'rgba(198, 40, 40, 0.25)', position: 'absolute', top: '1rem', right: '1.25rem' }}>01</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Quick Registration</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Present your Digital QR Donor Pass or fill basic demographics. Free blood pressure and hemoglobin check.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'rgba(198, 40, 40, 0.25)', position: 'absolute', top: '1rem', right: '1.25rem' }}>02</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Safe Donation</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Certified phlebotomist draws 350ml or 450ml with sterile, single-use vacuum kits. Takes 8–10 minutes.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'rgba(198, 40, 40, 0.25)', position: 'absolute', top: '1rem', right: '1.25rem' }}>03</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Rest & Nutrition</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Relax in the refreshment zone with fruit juices and snacks while fluid volume naturally starts replenishing.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'rgba(198, 40, 40, 0.25)', position: 'absolute', top: '1rem', right: '1.25rem' }}>04</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Instant Certificate</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Receive an authenticated Government Certificate of Appreciation on your portal with life-saver badges.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
