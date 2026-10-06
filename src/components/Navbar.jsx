import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Modal from './Modal';
import {
  Droplets,
  Search,
  Building2,
  Calendar,
  AlertCircle,
  User,
  LogOut,
  QrCode,
  LayoutDashboard,
  Boxes,
  CheckCircle,
  Sun,
  Moon,
  PhoneCall,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Shield,
  FileText,
  Lock,
  Globe
} from 'lucide-react';

export const Navbar = () => {
  const { user, profile, bloodBank, isDonor, isAdmin, isAuthenticated, logout } = useAuth();
  const { activeTab, setActiveTab, theme, toggleTheme, language, setLanguage, t, supportedLanguages, showToast } = useApp();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on tab change
  const navigateTo = (tab) => {
    setActiveTab(tab);
    setDropdownOpen(false);
    setLangDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    setActiveTab('login');
    showToast('You have been securely signed out.', 'info');
  };

  const currentLangObj = supportedLanguages.find(l => l.code === language) || supportedLanguages[0];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      {/* Brand accent stripe */}
      <div className="brand-accent-stripe" />

      {/* Official Helpline & Controls Bar */}
      <div className="gov-top-bar">
        <div className="container gov-top-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontWeight: '700' }}>
            <PhoneCall size={13} />
            <a href="tel:1910" style={{ color: '#fbbf24', textDecoration: 'none' }} title="Call Blood Helpline 1910">
              {t('helpline')}
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Language Selector Dropdown */}
            <div style={{ position: 'relative' }} ref={langDropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(prev => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: 'var(--text-main)',
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
                title="Change Application Language"
              >
                <Globe size={13} color="var(--primary-light)" />
                <span>{currentLangObj.native}</span>
                <ChevronDown size={11} />
              </button>

              {langDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: 'var(--shadow-lg)',
                    minWidth: '150px',
                    zIndex: 1100,
                    padding: '0.3rem 0'
                  }}
                >
                  {supportedLanguages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0.45rem 0.85rem',
                        fontSize: '0.8rem',
                        color: language === lang.code ? 'var(--primary-light)' : 'var(--text-main)',
                        fontWeight: language === lang.code ? '700' : '500',
                        backgroundColor: language === lang.code ? 'rgba(198, 40, 40, 0.12)' : 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{lang.native}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-tertiary)',
                cursor: 'pointer'
              }}
              title="Toggle Dark / Light Theme"
            >
              {theme === 'dark' ? <Sun size={13} color="#f59e0b" /> : <Moon size={13} />}
              <span>{theme === 'dark' ? t('light') : t('dark')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        style={{
          background: 'var(--bg-nav)',
          borderBottom: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '68px',
            position: 'relative'
          }}
        >
          {/* Logo & Branding */}
          <div
            onClick={() => navigateTo('landing')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none', flexShrink: 0 }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(198, 40, 40, 0.4)'
              }}
            >
              <Droplets size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  Blood<span style={{ color: 'var(--primary-light)' }}>Buddy</span>
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    background: 'rgba(198, 40, 40, 0.2)',
                    color: '#ef5350',
                    fontWeight: '700',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(198, 40, 40, 0.4)'
                  }}
                >
                  CONNECT
                </span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {t('brandSubtitle')}
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="nav-desktop-links">
            <button
              className={`btn btn-sm ${activeTab === 'landing' ? 'btn-secondary' : ''}`}
              style={{ color: activeTab === 'landing' ? 'var(--primary-light)' : 'var(--text-muted)' }}
              onClick={() => navigateTo('landing')}
            >
              {t('navHome')}
            </button>

            <button
              className={`btn btn-sm ${activeTab === 'stock-search' ? 'btn-secondary' : ''}`}
              style={{ color: activeTab === 'stock-search' ? 'var(--primary-light)' : 'var(--text-muted)' }}
              onClick={() => navigateTo('stock-search')}
            >
              <Search size={14} /> {t('navStockSearch')}
            </button>

            <button
              className={`btn btn-sm ${activeTab === 'directory' ? 'btn-secondary' : ''}`}
              style={{ color: activeTab === 'directory' ? 'var(--primary-light)' : 'var(--text-muted)' }}
              onClick={() => navigateTo('directory')}
            >
              <Building2 size={14} /> {t('navBloodBanks')}
            </button>

            <button
              className={`btn btn-sm ${activeTab === 'camps' ? 'btn-secondary' : ''}`}
              style={{ color: activeTab === 'camps' ? 'var(--primary-light)' : 'var(--text-muted)' }}
              onClick={() => navigateTo('camps')}
            >
              <Calendar size={14} /> {t('navCamps')}
            </button>

            <button
              className={`btn btn-sm ${activeTab === 'verify-cert' ? 'btn-secondary' : ''}`}
              style={{ color: activeTab === 'verify-cert' ? 'var(--primary-light)' : 'var(--text-muted)' }}
              onClick={() => navigateTo('verify-cert')}
            >
              <ShieldCheck size={14} /> {t('navVerifyCert')}
            </button>

            <button
              className="btn btn-danger-sos btn-sm"
              onClick={() => navigateTo('emergency-sos')}
              style={{ fontWeight: '700' }}
            >
              <AlertCircle size={14} /> {t('navEmergency')}
            </button>
          </div>

          {/* User / Authentication Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} ref={dropdownRef}>
                {/* Primary Portal Shortcut */}
                {isDonor && (
                  <button
                    className={`btn btn-sm ${activeTab === 'donor-dashboard' ? 'btn-primary' : 'btn-secondary'} nav-desktop-shortcut`}
                    onClick={() => navigateTo('donor-dashboard')}
                    title="Open Donor Portal"
                  >
                    <LayoutDashboard size={14} />
                    <span>{t('navDashboard')}</span>
                  </button>
                )}

                {isAdmin && (
                  <button
                    className={`btn btn-sm ${activeTab === 'admin-dashboard' ? 'btn-primary' : 'btn-secondary'} nav-desktop-shortcut`}
                    onClick={() => navigateTo('admin-dashboard')}
                    title="Open Admin Hub"
                  >
                    <LayoutDashboard size={14} />
                    <span>Admin Hub</span>
                  </button>
                )}

                {/* User Profile Dropdown Trigger */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDropdownOpen(prev => !prev)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: dropdownOpen ? 'var(--bg-card)' : 'var(--bg-tertiary)',
                      padding: '0.35rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    title="Open Account Menu"
                    aria-expanded={dropdownOpen}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isDonor ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        flexShrink: 0
                      }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    <div className="nav-user-label" style={{ textAlign: 'left', lineHeight: 1.15 }}>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          color: 'var(--text-main)',
                          maxWidth: '95px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: isDonor ? '#34d399' : '#60a5fa', fontWeight: '700', textTransform: 'uppercase' }}>
                        {isDonor ? 'Donor' : 'Admin'}
                      </div>
                    </div>

                    <ChevronDown size={14} color="var(--text-muted)" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                  </button>

                  {/* Dropdown Menu Popup */}
                  {dropdownOpen && (
                    <div className="user-dropdown-menu">
                      <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span className={`badge ${isDonor ? 'badge-success' : 'badge-gov'}`}>
                            {isDonor ? (
                              <>
                                <User size={12} /> {t('registeredDonors')}
                              </>
                            ) : (
                              <>
                                <Shield size={12} /> Admin
                              </>
                            )}
                          </span>
                          {isDonor && profile?.bloodGroup && (
                            <span className="badge badge-blood">{profile.bloodGroup}</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.email}
                        </div>
                      </div>

                      <div style={{ padding: '0.35rem 0' }}>
                        {isDonor ? (
                          <>
                            <button className="user-dropdown-item" onClick={() => navigateTo('donor-dashboard')}>
                              <LayoutDashboard size={15} /> {t('navDashboard')}
                            </button>
                            <button className="user-dropdown-item" onClick={() => navigateTo('donor-pass')}>
                              <QrCode size={15} /> {t('navDonorPass')}
                            </button>
                            <button className="user-dropdown-item" onClick={() => navigateTo('donor-history')}>
                              <FileText size={15} /> {t('featPassTitle')}
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="user-dropdown-item" onClick={() => navigateTo('admin-dashboard')}>
                              <LayoutDashboard size={15} /> Admin Hub
                            </button>
                            <button className="user-dropdown-item" onClick={() => navigateTo('admin-stock')}>
                              <Boxes size={15} /> Stock Matrix
                            </button>
                            <button className="user-dropdown-item" onClick={() => navigateTo('admin-verify')}>
                              <CheckCircle size={15} /> Verification Hub
                            </button>
                          </>
                        )}

                        <div className="dropdown-divider" />

                        <button
                          className="user-dropdown-item danger-item"
                          onClick={() => {
                            setDropdownOpen(false);
                            setLogoutModalOpen(true);
                          }}
                        >
                          <LogOut size={15} /> {t('navLogout')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Compact Sign Out Icon Button for wide desktop */}
                <button
                  onClick={() => setLogoutModalOpen(true)}
                  className="btn btn-secondary btn-sm nav-desktop-logout"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#ef4444',
                    borderColor: 'rgba(239, 68, 68, 0.4)',
                    fontWeight: '700',
                    padding: '0.35rem 0.6rem',
                    fontSize: '0.8rem'
                  }}
                  title="Sign out of your session"
                >
                  <LogOut size={14} />
                  <span>{t('navLogout')}</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigateTo('login')}
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
                >
                  {t('navLogin')}
                </button>
                <button
                  className="btn btn-primary btn-sm nav-btn-hide-xs"
                  onClick={() => navigateTo('register')}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
                >
                  {t('registerAsDonor')}
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              className="nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="nav-mobile-drawer">
            {/* Mobile Language Selector */}
            <div style={{ padding: '0.6rem 0.8rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Globe size={13} color="var(--primary-light)" /> {t('language')}
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {supportedLanguages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: language === l.code ? 'var(--primary-red)' : 'var(--bg-card)',
                      color: language === l.code ? '#ffffff' : 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      fontWeight: language === l.code ? '700' : '500'
                    }}
                  >
                    {l.native}
                  </button>
                ))}
              </div>
            </div>

            {isAuthenticated ? (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{user.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email} ({isDonor ? 'Donor' : 'Admin'})</div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', fontWeight: '700' }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setLogoutModalOpen(true);
                  }}
                >
                  <LogOut size={14} /> {t('navLogout')}
                </button>
              </div>
            ) : (
              <div
                style={{
                  padding: '0.85rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '0.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem'
                }}
              >
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigateTo('login')}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {t('navLogin')}
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigateTo('register')}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {t('registerAsDonor')}
                </button>
              </div>
            )}

            <button
              className={`btn btn-sm ${activeTab === 'landing' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => navigateTo('landing')}
            >
              {t('navHome')}
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'stock-search' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => navigateTo('stock-search')}
            >
              <Search size={14} /> {t('navStockSearch')}
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'directory' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => navigateTo('directory')}
            >
              <Building2 size={14} /> {t('navBloodBanks')}
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'camps' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => navigateTo('camps')}
            >
              <Calendar size={14} /> {t('navCamps')}
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'verify-cert' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => navigateTo('verify-cert')}
            >
              <ShieldCheck size={14} /> {t('navVerifyCert')}
            </button>
            <button
              className="btn btn-danger-sos btn-sm"
              style={{ justifyContent: 'flex-start' }}
              onClick={() => navigateTo('emergency-sos')}
            >
              <AlertCircle size={14} /> {t('navEmergency')}
            </button>

            {isAuthenticated && isDonor && (
              <>
                <button
                  className={`btn btn-sm ${activeTab === 'donor-dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => navigateTo('donor-dashboard')}
                >
                  <LayoutDashboard size={14} /> {t('navDashboard')}
                </button>
                <button
                  className={`btn btn-sm ${activeTab === 'donor-pass' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => navigateTo('donor-pass')}
                >
                  <QrCode size={14} /> {t('navDonorPass')}
                </button>
                <button
                  className={`btn btn-sm ${activeTab === 'donor-history' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => navigateTo('donor-history')}
                >
                  <FileText size={14} /> History & Certificates
                </button>
              </>
            )}

            {isAuthenticated && isAdmin && (
              <>
                <button
                  className={`btn btn-sm ${activeTab === 'admin-dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => navigateTo('admin-dashboard')}
                >
                  <LayoutDashboard size={14} /> Admin Hub
                </button>
                <button
                  className={`btn btn-sm ${activeTab === 'admin-stock' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => navigateTo('admin-stock')}
                >
                  <Boxes size={14} /> Stock Matrix
                </button>
                <button
                  className={`btn btn-sm ${activeTab === 'admin-verify' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => navigateTo('admin-verify')}
                >
                  <CheckCircle size={14} /> Verification Hub
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Dedicated Logout Confirmation Modal */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Confirm Secure Sign Out"
        maxWidth="460px"
      >
        <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              color: '#ef4444'
            }}
          >
            <LogOut size={28} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Sign out of your account?
          </h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
            You are currently signed in as <strong>{user?.name || 'User'}</strong> ({isDonor ? 'Voluntary Donor' : 'Blood Bank Admin'}).
          </p>

          <div
            style={{
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem',
              fontSize: '0.8rem',
              color: 'var(--text-dim)',
              marginBottom: '1.5rem',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Lock size={16} color="var(--primary-light)" style={{ flexShrink: 0 }} />
            <span>All your certificates, donation passes, and stock records remain securely saved.</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => setLogoutModalOpen(false)}
            >
              Stay Signed In
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
    </header>
  );
};

export default Navbar;
