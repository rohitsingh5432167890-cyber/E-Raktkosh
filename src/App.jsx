import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EmergencyBanner from './components/EmergencyBanner';

// Public Pages
import Landing from './pages/public/Landing';
import StockSearch from './pages/public/StockSearch';
import BloodBankDirectory from './pages/public/BloodBankDirectory';
import DonationCamps from './pages/public/DonationCamps';
import EmergencySOS from './pages/public/EmergencySOS';
import VerifyCertificate from './pages/public/VerifyCertificate';

// Auth Pages
import Login from './pages/auth/Login';
import RegisterDonor from './pages/auth/RegisterDonor';

// Donor Portal Pages
import DonorDashboard from './pages/donor/DonorDashboard';
import DonationHistory from './pages/donor/DonationHistory';
import DigitalPassView from './pages/donor/DigitalPassView';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StockInventoryManager from './pages/admin/StockInventoryManager';
import VerificationHub from './pages/admin/VerificationHub';

// Icons
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainLayout = () => {
  const { activeTab, setActiveTab, toasts, removeToast } = useApp();
  const { isDonor, isAdmin, isAuthenticated } = useAuth();

  // Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Auto-redirect away from protected tabs when logged out
  useEffect(() => {
    const protectedTabs = [
      'donor-dashboard',
      'donor-pass',
      'donor-history',
      'admin-dashboard',
      'admin-stock',
      'admin-verify'
    ];
    if (!isAuthenticated && protectedTabs.includes(activeTab)) {
      setActiveTab('login');
    }
  }, [isAuthenticated, activeTab, setActiveTab]);

  const renderActiveView = () => {
    switch (activeTab) {
      // Public Views
      case 'landing':
        return <Landing />;
      case 'stock-search':
        return <StockSearch />;
      case 'directory':
        return <BloodBankDirectory />;
      case 'camps':
        return <DonationCamps />;
      case 'emergency-sos':
        return <EmergencySOS />;
      case 'verify-cert':
        return <VerifyCertificate />;

      // Auth Views
      case 'login':
        return <Login />;
      case 'register':
        return <RegisterDonor />;

      // Donor Views
      case 'donor-dashboard':
        return isAuthenticated && isDonor ? <DonorDashboard /> : <Login />;
      case 'donor-pass':
        return isAuthenticated && isDonor ? <DigitalPassView /> : <Login />;
      case 'donor-history':
        return isAuthenticated && isDonor ? <DonationHistory /> : <Login />;

      // Admin Views
      case 'admin-dashboard':
        return isAuthenticated && isAdmin ? <AdminDashboard /> : <Login />;
      case 'admin-stock':
        return isAuthenticated && isAdmin ? <StockInventoryManager /> : <Login />;
      case 'admin-verify':
        return isAuthenticated && isAdmin ? <VerificationHub /> : <Login />;

      default:
        return <Landing />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <EmergencyBanner />

      <main style={{ flex: 1 }}>
        {renderActiveView()}
      </main>

      <Footer />

      {/* Floating Toast Notification Container */}
      <div className="toast-container no-print">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type || 'info'}`}>
            {t.type === 'success' && <CheckCircle2 size={18} color="#10b981" />}
            {t.type === 'error' && <AlertCircle size={18} color="#ef4444" />}
            {t.type === 'info' && <Info size={18} color="#60a5fa" />}

            <span style={{ fontSize: '0.85rem', flex: 1 }}>{t.message}</span>

            <button
              onClick={() => removeToast(t.id)}
              style={{ color: '#9ca3af', padding: '0.2rem' }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
