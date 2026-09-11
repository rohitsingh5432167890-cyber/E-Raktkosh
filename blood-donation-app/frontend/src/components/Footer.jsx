import React from 'react';
import { useApp } from '../context/AppContext';
import { Droplets, Heart, Shield, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  const { setActiveTab } = useApp();

  return (
    <footer
      style={{
        backgroundColor: '#090d14',
        color: '#94a3b8',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '3.5rem',
        paddingBottom: '2rem',
        fontSize: '0.85rem'
      }}
    >
      <div className="container">
        {/* Top Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Column 1: Brand & National Council */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Droplets size={20} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                e-Rakt<span style={{ color: '#ef5350' }}>Kosh</span>
              </span>
            </div>
            <p style={{ lineHeight: '1.6', marginBottom: '1.25rem', color: '#94a3b8' }}>
              An initiative of the Ministry of Health and Family Welfare (MoHFW) to connect, digitize, and streamline blood donation services and real-time inventory across India.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: '600' }}>
              <Shield size={16} /> Certified Official Govt Portal
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1.25rem', fontWeight: '700' }}>
              Services & Portals
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <a href="#search" onClick={(e) => { e.preventDefault(); setActiveTab('stock-search'); }}>
                  Real-time Blood Stock Search
                </a>
              </li>
              <li>
                <a href="#banks" onClick={(e) => { e.preventDefault(); setActiveTab('directory'); }}>
                  Licensed Blood Bank Directory
                </a>
              </li>
              <li>
                <a href="#camps" onClick={(e) => { e.preventDefault(); setActiveTab('camps'); }}>
                  Voluntary Blood Donation Camps
                </a>
              </li>
              <li>
                <a href="#sos" onClick={(e) => { e.preventDefault(); setActiveTab('emergency-sos'); }} style={{ color: '#f87171', fontWeight: '600' }}>
                  Emergency SOS Blood Broadcast
                </a>
              </li>
              <li>
                <a href="#register" onClick={(e) => { e.preventDefault(); setActiveTab('register'); }}>
                  Register as a Voluntary Donor
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Blood Compatibility Quick Facts */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1.25rem', fontWeight: '700' }}>
              Compatibility Matrix
            </h4>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '0.85rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.78rem'
              }}
            >
              <div>
                <strong style={{ color: '#f87171' }}>O Negative (O-)</strong>: Universal Red Cell Donor
              </div>
              <div>
                <strong style={{ color: '#60a5fa' }}>AB Positive (AB+)</strong>: Universal Red Cell Recipient
              </div>
              <div>
                <strong style={{ color: '#fbbf24' }}>AB Negative (AB-)</strong>: Universal Plasma Donor
              </div>
              <div style={{ color: '#6ee7b7' }}>
                Donation Interval: Every 90 Days for Whole Blood
              </div>
            </div>
          </div>

          {/* Column 4: National Helpline */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1.25rem', fontWeight: '700' }}>
              Emergency Helpdesk
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="#fbbf24" />
                <span>Toll-Free Helpline: <strong>1910</strong> (24x7)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="#94a3b8" />
                <span>support@eraktkosh.in</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} color="#94a3b8" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                <span>Nirman Bhawan, Maulana Azad Road, New Delhi - 110011</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.75rem',
            color: '#64748b'
          }}
        >
          <div>
            © {new Date().getFullYear()} e-RaktKosh National Blood Transfusion Service. Ministry of Health & Family Welfare, Govt. of India.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built for citizen emergency care with <Heart size={13} color="#ef4444" fill="#ef4444" /> and Digital India standards
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
