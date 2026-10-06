import React, { createContext, useContext, useState, useEffect } from 'react';
import { publicApi } from '../api/publicApi';
import { translations, SUPPORTED_LANGUAGES } from '../translations/translations';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('landing');
  const [theme, setTheme] = useState(localStorage.getItem('eraktkosh_theme') || 'dark');
  const [language, setLanguage] = useState(localStorage.getItem('eraktkosh_language') || 'en');
  const [toasts, setToasts] = useState([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [portalStats, setPortalStats] = useState(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('eraktkosh_theme', theme);
  }, [theme]);

  // Persist language
  useEffect(() => {
    localStorage.setItem('eraktkosh_language', language);
  }, [language]);

  // Translation helper function
  const t = (key, fallback = '') => {
    if (!key) return fallback;
    const langDict = translations[language] || translations.en;
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    const defaultDict = translations.en || {};
    return defaultDict[key] !== undefined ? defaultDict[key] : (fallback || key);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch initial emergency alerts and portal statistics
  const refreshEmergencyAlerts = async () => {
    try {
      const data = await publicApi.getEmergencyRequests({ status: 'OPEN' });
      if (data.success) {
        setEmergencyAlerts(data.requests);
      }
    } catch (err) {
      console.warn('Could not fetch emergency alerts:', err.message);
    }
  };

  const refreshStats = async () => {
    try {
      const data = await publicApi.getStats();
      if (data.success) {
        setPortalStats(data.stats);
      }
    } catch (err) {
      console.warn('Could not fetch portal stats:', err.message);
    }
  };

  useEffect(() => {
    refreshEmergencyAlerts();
    refreshStats();
    const interval = setInterval(refreshEmergencyAlerts, 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        language,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
        toasts,
        showToast,
        removeToast,
        emergencyAlerts,
        refreshEmergencyAlerts,
        portalStats,
        refreshStats
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
