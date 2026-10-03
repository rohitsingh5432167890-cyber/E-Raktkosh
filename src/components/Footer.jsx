import React from 'react';
import { useApp } from '../context/AppContext';
import { Droplets, Heart, Shield, Phone, Mail, MapPin, ExternalLink, Activity } from 'lucide-react';

export const Footer = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="footer-main">
      <div className="container">
        {/* Top Grid */}
        <div className="footer-grid">
          {/* Column 1: Brand & National Council */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(198, 40, 40, 0.35)',
                  flexShrink: 0
                }}
              >
                <Droplets size={22} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
                e-Rakt<span style={{ color: 'var(--primary-light)' }}>Kosh</span>
              </span>
            </div>
            <p style={{ lineHeight: '1.6', marginBottom: '1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              A centralized digital platform to connect, digitize, and streamline blood donation services, real-time inventory verification, and emergency response across India.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: '#10b981', fontWeight: '600', fontSize: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <Shield size={15} color="#10b981" />
              <span>Certified Official Blood Portal</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Services & Portals</h4>
            <ul className="footer-links-list">
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => setActiveTab('stock-search')}
                >
                  Real-time Blood Stock Search
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => setActiveTab('directory')}
                >
                  Licensed Blood Bank Directory
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => setActiveTab('camps')}
                >
                  Voluntary Blood Donation Camps
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => setActiveTab('emergency-sos')}
                  style={{ color: '#ef4444', fontWeight: '700' }}
                >
                  Emergency SOS Blood Broadcast
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => setActiveTab('verify-cert')}
                >
                  Verify QR Donor Certificate
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => setActiveTab('register')}
                >
                  Register as Voluntary Donor
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Blood Compatibility Quick Facts (Clean Solid Card) */}
          <div className="footer-col">
            <h4 className="footer-col-title">Compatibility Matrix</h4>
            <div className="footer-solid-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.2rem', fontWeight: '700', color: 'var(--text-main)', fontSize: '0.82rem' }}>
                <Activity size={14} color="var(--primary-light)" />
                <span>Quick Transfusion Guide</span>
              </div>
              <div style={{ lineHeight: '1.4' }}>
                <span style={{ color: '#ef4444', fontWeight: '700' }}>O Negative (O-)</span>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Universal Red Cell Donor</span>
              </div>
              <div style={{ lineHeight: '1.4' }}>
                <span style={{ color: '#60a5fa', fontWeight: '700' }}>AB Positive (AB+)</span>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Universal Red Cell Recipient</span>
              </div>
              <div style={{ lineHeight: '1.4' }}>
                <span style={{ color: '#fbbf24', fontWeight: '700' }}>AB Negative (AB-)</span>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Universal Plasma Donor</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', paddingTop: '0.35rem', borderTop: '1px solid var(--border-color)', fontWeight: '600' }}>
                Interval: Every 90 Days (Whole Blood)
              </div>
            </div>
          </div>

          {/* Column 4: National Helpline & Emergency */}
          <div className="footer-col">
            <h4 className="footer-col-title">Emergency Helpdesk</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="footer-contact-item">
                <Phone size={17} color="#fbbf24" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Toll-Free Helpline (24x7)</div>
                  <a
                    href="tel:1910"
                    className="footer-contact-link"
                    style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fbbf24' }}
                    title="Tap to call 1910"
                  >
                    1910
                  </a>
                </div>
              </div>

              <div className="footer-contact-item">
                <Mail size={16} color="var(--primary-light)" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Support Email</div>
                  <a
                    href="mailto:support@eraktkosh.in"
                    className="footer-contact-link"
                    title="Tap to email support"
                  >
                    support@eraktkosh.in
                  </a>
                </div>
              </div>

              <div className="footer-contact-item">
                <MapPin size={16} color="var(--text-dim)" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                <div style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                  <span>National Transfusion Network Headquarters, Nirman Bhawan, New Delhi - 110011</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} e-RaktKosh National Blood Transfusion Service. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span>Built for citizen emergency care with</span>
            <Heart size={14} color="#ef4444" fill="#ef4444" />
            <span>and Digital Health Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
