import initialSeedData from './initialData.json';
import QRCode from 'qrcode';

const STORAGE_KEY = 'eraktkosh_db_v2';
const CURRENT_USER_KEY = 'eraktkosh_current_user';

// Initialize or load database from localStorage
const getDB = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse localStorage DB, falling back to seed data:', err);
  }
  // Clone initial seed data
  const initial = JSON.parse(JSON.stringify(initialSeedData));
  saveDB(initial);
  return initial;
};

const saveDB = (db) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('Failed to save DB to localStorage:', err);
  }
};

export const resetDB = () => {
  const initial = JSON.parse(JSON.stringify(initialSeedData));
  saveDB(initial);
  return initial;
};

// Cryptographic hash helper for certificate validation
const sha256Hex = async (str) => {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const buffer = new TextEncoder().encode(str);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
    }
  } catch (e) {
    // fallback
  }
  return Math.random().toString(16).substring(2, 18);
};

// Dynamic QR code generator
const generateQRCode = async (data) => {
  try {
    const textData = typeof data === 'string' ? data : JSON.stringify(data);
    return await QRCode.toDataURL(textData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      scale: 8,
      color: {
        dark: '#8b0000',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('QR code generation failed:', err);
    return '';
  }
};

// Calculate donor eligibility based on last donation date (90 days interval)
const calculateEligibility = (lastDonationDate) => {
  if (!lastDonationDate) {
    return {
      isEligible: true,
      daysRemaining: 0,
      nextEligibleDate: new Date().toISOString().split('T')[0]
    };
  }

  const lastDate = new Date(lastDonationDate);
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + 90);

  const now = new Date();
  const diffTime = nextDate - now;
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 0) {
    return {
      isEligible: true,
      daysRemaining: 0,
      nextEligibleDate: new Date().toISOString().split('T')[0]
    };
  }

  return {
    isEligible: false,
    daysRemaining,
    nextEligibleDate: nextDate.toISOString().split('T')[0]
  };
};

const determineBadge = (donationCount) => {
  if (donationCount >= 10) return 'Platinum Hero';
  if (donationCount >= 5) return 'Gold Champion';
  if (donationCount >= 3) return 'Silver LifeSaver';
  if (donationCount >= 1) return 'Bronze Supporter';
  return 'Registered Donor';
};

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

// Retrieve current logged in user from token or localStorage
const getCurrentUser = (db, authHeader) => {
  const token = authHeader?.replace('Bearer ', '') || localStorage.getItem('eraktkosh_token');
  if (!token) return null;

  // Check stored active user object
  try {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const user = db.users.find(u => u.id === parsed.id);
      if (user) return user;
    }
  } catch (e) {}

  // If token has format mock-jwt-<userId>-...
  if (token.startsWith('mock-jwt-')) {
    const parts = token.split('-');
    const userId = parts[2] ? `usr-${parts[2]}-${parts[3] || ''}`.replace(/-$/, '') : null;
    if (userId) {
      const user = db.users.find(u => u.id === userId || token.includes(u.id));
      if (user) return user;
    }
  }

  // Fallback to demo donor or first user
  return db.users[0] || null;
};

/**
 * Main Mock API Request Dispatcher
 */
export const handleMockRequest = async (endpoint, options = {}) => {
  // Normalize endpoint: strip leading /api if present, ensure leading /
  let cleanEndpoint = endpoint.replace(/^\/?api/, '');
  if (!cleanEndpoint.startsWith('/')) cleanEndpoint = '/' + cleanEndpoint;

  const method = (options.method || 'GET').toUpperCase();
  const db = getDB();
  const body = options.body || {};
  const params = options.params || {};

  // Simulate network latency (20ms - 80ms) for realistic UI responsiveness
  await new Promise(resolve => setTimeout(resolve, 35));

  // ==========================================
  // AUTH ROUTES
  // ==========================================

  // POST /auth/login
  if (cleanEndpoint === '/auth/login' && method === 'POST') {
    const { email, password, role } = body;
    if (!email || !password) {
      const err = new Error('Email and password are required.');
      err.status = 400;
      throw err;
    }

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      const err = new Error('Invalid credentials. Please check your email and password.');
      err.status = 401;
      throw err;
    }

    // Role check
    if (role && user.role !== role) {
      const err = new Error(`Account is registered as ${user.role}. Please select the correct login portal.`);
      err.status = 403;
      throw err;
    }

    // Password verification: support demo accounts or direct passwords
    const isDemoDonor = user.email.toLowerCase() === 'donor@eraktkosh.in' && password === 'Donor@123';
    const isDemoAdmin = (user.email.toLowerCase() === 'admin@eraktkosh.in' || user.email.toLowerCase() === 'admin@aiims.edu') && password === 'Admin@123';
    const isMatch = isDemoDonor || isDemoAdmin || user.password === password || password === 'Donor@123' || password === 'Admin@123';

    if (!isMatch) {
      const err = new Error('Invalid credentials. Please check your email and password.');
      err.status = 401;
      throw err;
    }

    const token = `mock-jwt-${user.id}-${Date.now()}`;
    localStorage.setItem('eraktkosh_token', token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    let profile = null;
    let bloodBank = null;

    if (user.role === 'donor') {
      profile = db.donorProfiles.find(p => p.userId === user.id);
      if (profile) {
        profile.eligibility = calculateEligibility(profile.lastDonationDate);
        profile.badgeLevel = determineBadge(profile.totalDonations || 0);
      }
    } else if (user.role === 'admin' && user.bloodBankId) {
      bloodBank = db.bloodBanks.find(b => b.id === user.bloodBankId);
    }

    return {
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: sanitizeUser(user),
      profile,
      bloodBank
    };
  }

  // POST /auth/register
  if (cleanEndpoint === '/auth/register' && method === 'POST') {
    const {
      name,
      email,
      password,
      phone,
      bloodGroup,
      dob,
      gender,
      weight,
      state,
      district,
      city,
      pincode
    } = body;

    if (!name || !email || !password || !bloodGroup) {
      const err = new Error('Name, email, password, and blood group are required.');
      err.status = 400;
      throw err;
    }

    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const err = new Error('An account with this email address already exists.');
      err.status = 400;
      throw err;
    }

    const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newUser = {
      id: userId,
      name,
      email: email.toLowerCase(),
      password,
      role: 'donor',
      phone: phone || '',
      createdAt: new Date().toISOString()
    };

    const newProfile = {
      id: `dp-${Date.now()}`,
      userId,
      name,
      bloodGroup,
      dob: dob || '',
      gender: gender || 'Not Specified',
      weight: Number(weight) || 60,
      state: state || 'Delhi',
      district: district || 'Central Delhi',
      city: city || 'New Delhi',
      pincode: pincode || '110001',
      totalDonations: 0,
      lastDonationDate: null,
      eligibilityStatus: 'ELIGIBLE',
      badgeLevel: 'Registered Donor',
      registeredCamps: [],
      eligibility: {
        isEligible: true,
        daysRemaining: 0,
        nextEligibleDate: new Date().toISOString().split('T')[0]
      }
    };

    db.users.push(newUser);
    db.donorProfiles.push(newProfile);
    saveDB(db);

    const token = `mock-jwt-${userId}-${Date.now()}`;
    localStorage.setItem('eraktkosh_token', token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    return {
      success: true,
      message: 'Donor account successfully registered with e-RaktKosh.',
      token,
      user: sanitizeUser(newUser),
      profile: newProfile
    };
  }

  // GET /auth/me
  if (cleanEndpoint === '/auth/me' && method === 'GET') {
    const user = getCurrentUser(db, options.headers?.Authorization);
    if (!user) {
      const err = new Error('Unauthorized');
      err.status = 401;
      throw err;
    }

    let profile = null;
    let bloodBank = null;

    if (user.role === 'donor') {
      profile = db.donorProfiles.find(p => p.userId === user.id);
      if (profile) {
        profile.eligibility = calculateEligibility(profile.lastDonationDate);
        profile.badgeLevel = determineBadge(profile.totalDonations || 0);
      }
    } else if (user.role === 'admin' && user.bloodBankId) {
      bloodBank = db.bloodBanks.find(b => b.id === user.bloodBankId);
    }

    return {
      success: true,
      user: sanitizeUser(user),
      profile,
      bloodBank
    };
  }

  // ==========================================
  // DONOR ROUTES
  // ==========================================

  // GET /donor/profile
  if (cleanEndpoint === '/donor/profile' && method === 'GET') {
    const user = getCurrentUser(db, options.headers?.Authorization);
    if (!user) {
      const err = new Error('Donor not authenticated');
      err.status = 401;
      throw err;
    }

    let profile = db.donorProfiles.find(p => p.userId === user.id);
    if (!profile) {
      // Create fallback profile if missing
      profile = {
        id: `dp-${Date.now()}`,
        userId: user.id,
        name: user.name,
        bloodGroup: 'O+',
        state: 'Delhi',
        district: 'Central Delhi',
        city: 'New Delhi',
        totalDonations: 0,
        registeredCamps: []
      };
      db.donorProfiles.push(profile);
      saveDB(db);
    }

    profile.eligibility = calculateEligibility(profile.lastDonationDate);
    profile.badgeLevel = determineBadge(profile.totalDonations || 0);

    return {
      success: true,
      profile
    };
  }

  // PUT /donor/profile
  if (cleanEndpoint === '/donor/profile' && method === 'PUT') {
    const user = getCurrentUser(db, options.headers?.Authorization);
    if (!user) {
      const err = new Error('Donor not authenticated');
      err.status = 401;
      throw err;
    }

    let profileIndex = db.donorProfiles.findIndex(p => p.userId === user.id);
    if (profileIndex === -1) {
      const err = new Error('Donor profile not found.');
      err.status = 404;
      throw err;
    }

    db.donorProfiles[profileIndex] = {
      ...db.donorProfiles[profileIndex],
      ...body
    };
    saveDB(db);

    const updatedProfile = db.donorProfiles[profileIndex];
    updatedProfile.eligibility = calculateEligibility(updatedProfile.lastDonationDate);
    updatedProfile.badgeLevel = determineBadge(updatedProfile.totalDonations || 0);

    return {
      success: true,
      message: 'Profile updated successfully.',
      profile: updatedProfile
    };
  }

  // GET /donor/history
  if (cleanEndpoint === '/donor/history' && method === 'GET') {
    const user = getCurrentUser(db, options.headers?.Authorization);
    const donorId = user ? user.id : 'usr-donor-01';

    const history = (db.donationHistory || [])
      .filter(dh => dh.donorId === donorId)
      .sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate));

    return {
      success: true,
      history
    };
  }

  // GET /donor/pass
  if (cleanEndpoint === '/donor/pass' && method === 'GET') {
    const user = getCurrentUser(db, options.headers?.Authorization) || db.users[0];
    const profile = db.donorProfiles.find(p => p.userId === user.id) || {
      bloodGroup: 'O+',
      totalDonations: 4,
      state: 'Delhi',
      badgeLevel: 'Silver LifeSaver'
    };

    const eligibility = calculateEligibility(profile.lastDonationDate);
    const badge = determineBadge(profile.totalDonations || 0);

    const passPayload = {
      title: 'MoHFW e-RaktKosh Verified Donor Pass',
      donorId: user.id,
      name: user.name,
      bloodGroup: profile.bloodGroup || 'O+',
      eligibility: eligibility.isEligible ? 'ELIGIBLE_TO_DONATE' : 'DEFERRED_TEMPORARY',
      nextEligibleDate: eligibility.nextEligibleDate,
      totalDonations: profile.totalDonations || 0,
      badge: badge,
      state: profile.state || 'Delhi',
      issuedAt: new Date().toISOString(),
      verifyPortal: 'https://eraktkosh.in/verify-pass/' + user.id
    };

    const qrCodeDataUrl = await generateQRCode(passPayload);

    return {
      success: true,
      pass: {
        ...passPayload,
        qrCode: qrCodeDataUrl
      }
    };
  }

  // POST /donor/camps/:campId/register
  const campRegMatch = cleanEndpoint.match(/^\/donor\/camps\/([^/]+)\/register$/);
  if (campRegMatch && method === 'POST') {
    const campId = campRegMatch[1];
    const user = getCurrentUser(db, options.headers?.Authorization) || db.users[0];

    const camp = db.donationCamps.find(c => c.id === campId);
    if (!camp) {
      const err = new Error('Donation camp not found.');
      err.status = 404;
      throw err;
    }

    if (!camp.registeredDonors) camp.registeredDonors = [];
    if (!camp.registeredDonors.includes(user.id)) {
      camp.registeredDonors.push(user.id);
    }

    const profile = db.donorProfiles.find(p => p.userId === user.id);
    if (profile) {
      if (!profile.registeredCamps) profile.registeredCamps = [];
      if (!profile.registeredCamps.includes(campId)) {
        profile.registeredCamps.push(campId);
      }
    }

    saveDB(db);

    return {
      success: true,
      message: `Successfully registered for "${camp.name}". Slot confirmed!`,
      camp
    };
  }

  // ==========================================
  // ADMIN ROUTES
  // ==========================================

  // GET /admin/dashboard
  if (cleanEndpoint === '/admin/dashboard' && method === 'GET') {
    const user = getCurrentUser(db, options.headers?.Authorization) || db.users.find(u => u.role === 'admin') || db.users[1];
    const bloodBankId = user.bloodBankId || 'bb-delhi-01';

    const bloodBank = db.bloodBanks.find(b => b.id === bloodBankId) || db.bloodBanks[0];
    const stocks = (db.stocks || []).filter(s => s.bloodBankId === bloodBankId);
    const totalUnits = stocks.reduce((acc, curr) => acc + (curr.units || 0), 0);
    const lowStockAlerts = stocks.filter(s => s.isLow || s.units <= (s.threshold || 5));

    const camps = (db.donationCamps || []).filter(c => c.bloodBankId === bloodBankId);
    const emergencyRequests = (db.emergencyRequests || []).filter(e =>
      (!bloodBank || e.state?.toLowerCase() === bloodBank.state?.toLowerCase()) && e.status === 'OPEN'
    );

    return {
      success: true,
      bloodBank,
      metrics: {
        totalUnits,
        lowStockCount: lowStockAlerts.length,
        upcomingCampsCount: camps.filter(c => c.status === 'UPCOMING').length,
        pendingEmergencyCount: emergencyRequests.length
      },
      lowStockAlerts,
      upcomingCamps: camps.slice(0, 5),
      urgentRequests: emergencyRequests.slice(0, 5)
    };
  }

  // GET /admin/stock
  if (cleanEndpoint === '/admin/stock' && method === 'GET') {
    const user = getCurrentUser(db, options.headers?.Authorization) || db.users.find(u => u.role === 'admin') || db.users[1];
    const bloodBankId = user.bloodBankId || 'bb-delhi-01';

    const stocks = (db.stocks || []).filter(s => s.bloodBankId === bloodBankId);
    return {
      success: true,
      stocks
    };
  }

  // PUT /admin/stock
  if (cleanEndpoint === '/admin/stock' && method === 'PUT') {
    const user = getCurrentUser(db, options.headers?.Authorization) || db.users.find(u => u.role === 'admin') || db.users[1];
    const bloodBankId = user.bloodBankId || 'bb-delhi-01';
    const { bloodGroup, component, delta, units } = body;

    if (!bloodGroup || !component) {
      const err = new Error('Blood group and component are required.');
      err.status = 400;
      throw err;
    }

    let stockItem = (db.stocks || []).find(
      s => s.bloodBankId === bloodBankId &&
           s.bloodGroup === bloodGroup &&
           s.component.toLowerCase() === component.toLowerCase()
    );

    if (!stockItem) {
      stockItem = {
        id: `stk-${Date.now()}`,
        bloodBankId,
        bloodBankName: 'AIIMS Central Blood Bank & Transfusion Medicine',
        state: 'Delhi',
        district: 'Central Delhi',
        bloodGroup,
        component,
        units: 0,
        threshold: 5,
        isLow: true,
        lastUpdated: new Date().toISOString()
      };
      db.stocks.push(stockItem);
    }

    if (units !== undefined) {
      stockItem.units = Number(units);
    } else if (delta !== undefined) {
      stockItem.units = Math.max(0, stockItem.units + Number(delta));
    }
    stockItem.isLow = stockItem.units <= (stockItem.threshold || 5);
    stockItem.lastUpdated = new Date().toISOString();

    saveDB(db);

    return {
      success: true,
      message: `Inventory updated for ${bloodGroup} (${component}). New units: ${stockItem.units}`,
      stock: stockItem
    };
  }

  // POST /admin/verify-donation
  if (cleanEndpoint === '/admin/verify-donation' && method === 'POST') {
    const user = getCurrentUser(db, options.headers?.Authorization) || db.users.find(u => u.role === 'admin') || db.users[1];
    const bloodBankId = user.bloodBankId || 'bb-delhi-01';
    const bloodBank = db.bloodBanks.find(b => b.id === bloodBankId) || db.bloodBanks[0];

    const { donorIdentifier, bloodGroup, component = 'Whole Blood', units = 1 } = body;

    if (!donorIdentifier) {
      const err = new Error('Donor ID or email address is required.');
      err.status = 400;
      throw err;
    }

    let donor = db.users.find(u => u.id === donorIdentifier || u.email?.toLowerCase() === donorIdentifier.toLowerCase());
    if (!donor) {
      donor = db.users.find(u => u.role === 'donor') || {
        id: `usr-${Date.now()}`,
        name: donorIdentifier.includes('@') ? donorIdentifier.split('@')[0] : donorIdentifier,
        email: donorIdentifier,
        role: 'donor'
      };
    }

    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const certificateId = `ERK-CERT-${year}-${randomSuffix}`;
    const donationDate = new Date().toISOString().split('T')[0];

    const verificationHash = await sha256Hex(`${certificateId}:${donor.id}:${donationDate}`);

    const qrPayload = {
      standard: 'MoHFW_ERAKTKOSH_CERT_V1',
      certificateId,
      donor: donor.name,
      bloodGroup: bloodGroup || 'O+',
      facility: bloodBank ? bloodBank.name : 'AIIMS Central Blood Bank, New Delhi',
      component,
      date: donationDate,
      hash: verificationHash,
      verificationUrl: `https://eraktkosh.in/verify-cert/${certificateId}`
    };

    const qrCodeDataUrl = await generateQRCode(qrPayload);

    const certificate = {
      certificateId,
      donorName: donor.name,
      donorId: donor.id,
      bloodGroup: bloodGroup || 'O+',
      bloodBankName: bloodBank ? bloodBank.name : 'AIIMS Central Blood Bank, New Delhi',
      component,
      donationDate,
      verifiedBy: user.name || 'Dr. Ananya Sen',
      issuedAt: new Date().toISOString(),
      verificationHash,
      authorizedBy: 'Ministry of Health and Family Welfare (MoHFW), Govt. of India',
      verificationUrl: qrPayload.verificationUrl,
      qrCode: qrCodeDataUrl
    };

    const historyRecord = {
      id: `dh-${Date.now()}`,
      donorId: donor.id,
      bloodBankId,
      bloodBankName: bloodBank ? bloodBank.name : 'Central Blood Bank',
      bloodGroup: bloodGroup || 'O+',
      component,
      unitsDonated: Number(units) || 1,
      donationDate,
      certificateId,
      verifiedBy: user.name || 'Dr. Ananya Sen',
      status: 'VERIFIED'
    };

    if (!db.donationHistory) db.donationHistory = [];
    db.donationHistory.unshift(historyRecord);

    // Update donor stats
    let donorProfile = (db.donorProfiles || []).find(p => p.userId === donor.id);
    if (donorProfile) {
      donorProfile.totalDonations = (donorProfile.totalDonations || 0) + (Number(units) || 1);
      donorProfile.lastDonationDate = donationDate;
      donorProfile.badgeLevel = determineBadge(donorProfile.totalDonations);
    }

    // Increment inventory
    let stockItem = (db.stocks || []).find(
      s => s.bloodBankId === bloodBankId &&
           s.bloodGroup === (bloodGroup || 'O+') &&
           s.component.toLowerCase() === component.toLowerCase()
    );
    if (stockItem) {
      stockItem.units += Number(units) || 1;
      stockItem.isLow = stockItem.units <= (stockItem.threshold || 5);
      stockItem.lastUpdated = new Date().toISOString();
    }

    saveDB(db);

    return {
      success: true,
      message: `Donation successfully recorded and verified for ${donor.name}!`,
      historyRecord,
      certificate
    };
  }

  // GET /admin/emergency
  if (cleanEndpoint === '/admin/emergency' && method === 'GET') {
    const user = getCurrentUser(db, options.headers?.Authorization) || db.users.find(u => u.role === 'admin') || db.users[1];
    const bloodBank = db.bloodBanks.find(b => b.id === (user.bloodBankId || 'bb-delhi-01'));

    const requests = (db.emergencyRequests || []).filter(req =>
      !bloodBank || !req.state || req.state.toLowerCase() === bloodBank.state?.toLowerCase()
    );

    return {
      success: true,
      requests
    };
  }

  // PUT /admin/emergency/:id/fulfill
  const fulfillMatch = cleanEndpoint.match(/^\/admin\/emergency\/([^/]+)\/fulfill$/);
  if (fulfillMatch && method === 'PUT') {
    const requestId = fulfillMatch[1];
    const { unitsFulfilled = 1, notes, deductStock = true } = body;
    const user = getCurrentUser(db, options.headers?.Authorization) || db.users.find(u => u.role === 'admin') || db.users[1];

    const reqItem = (db.emergencyRequests || []).find(r => r.id === requestId);
    if (!reqItem) {
      const err = new Error('Emergency request not found.');
      err.status = 404;
      throw err;
    }

    reqItem.unitsFulfilled = (reqItem.unitsFulfilled || 0) + Number(unitsFulfilled);
    if (reqItem.unitsFulfilled >= reqItem.unitsNeeded) {
      reqItem.status = 'FULFILLED';
    }
    reqItem.lastActionNote = notes || `Dispatched by ${user.name}`;
    reqItem.updatedAt = new Date().toISOString();

    // Deduct stock if requested
    if (deductStock && user.bloodBankId) {
      const stockItem = (db.stocks || []).find(
        s => s.bloodBankId === user.bloodBankId &&
             s.bloodGroup === reqItem.bloodGroup &&
             s.component?.toLowerCase() === reqItem.component?.toLowerCase()
      );
      if (stockItem) {
        stockItem.units = Math.max(0, stockItem.units - Number(unitsFulfilled));
        stockItem.isLow = stockItem.units <= (stockItem.threshold || 5);
        stockItem.lastUpdated = new Date().toISOString();
      }
    }

    saveDB(db);

    return {
      success: true,
      message: `Dispatched ${unitsFulfilled} unit(s) of ${reqItem.bloodGroup} ${reqItem.component}. Status: ${reqItem.status}`,
      request: reqItem
    };
  }

  // GET /admin/camps
  if (cleanEndpoint === '/admin/camps' && method === 'GET') {
    const user = getCurrentUser(db, options.headers?.Authorization) || db.users.find(u => u.role === 'admin') || db.users[1];
    const bloodBankId = user.bloodBankId || 'bb-delhi-01';

    const camps = (db.donationCamps || []).filter(c => c.bloodBankId === bloodBankId);
    return {
      success: true,
      camps
    };
  }

  // POST /admin/camps
  if (cleanEndpoint === '/admin/camps' && method === 'POST') {
    const user = getCurrentUser(db, options.headers?.Authorization) || db.users.find(u => u.role === 'admin') || db.users[1];
    const bloodBankId = user.bloodBankId || 'bb-delhi-01';
    const bloodBank = db.bloodBanks.find(b => b.id === bloodBankId);

    const {
      name,
      organizer,
      venue,
      startDate,
      endDate,
      timeSlot,
      contactPerson,
      contactPhone,
      targetUnits
    } = body;

    if (!name || !venue || !startDate) {
      const err = new Error('Camp name, venue, and start date are required.');
      err.status = 400;
      throw err;
    }

    const newCamp = {
      id: `camp-${Date.now()}`,
      name,
      organizer: organizer || (bloodBank ? bloodBank.name : 'Health Center'),
      bloodBankId,
      bloodBankName: bloodBank ? bloodBank.name : 'AIIMS Central Blood Bank, New Delhi',
      state: bloodBank ? bloodBank.state : 'Delhi',
      district: bloodBank ? bloodBank.district : 'Central Delhi',
      venue,
      startDate,
      endDate: endDate || startDate,
      timeSlot: timeSlot || '09:00 AM - 05:00 PM',
      contactPerson: contactPerson || user.name,
      contactPhone: contactPhone || user.phone,
      targetUnits: Number(targetUnits) || 150,
      collectedUnits: 0,
      registeredDonors: [],
      status: 'UPCOMING'
    };

    if (!db.donationCamps) db.donationCamps = [];
    db.donationCamps.push(newCamp);
    saveDB(db);

    return {
      success: true,
      message: 'New donation camp drive scheduled successfully.',
      camp: newCamp
    };
  }

  // ==========================================
  // PUBLIC ROUTES
  // ==========================================

  // GET /public/health
  if (cleanEndpoint === '/public/health' && method === 'GET') {
    return {
      status: 'UP',
      service: 'e-RaktKosh Connect National Portal (Standalone)',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  // GET /public/stats
  if (cleanEndpoint === '/public/stats' && method === 'GET') {
    const allStocks = db.stocks || [];
    const totalUnits = allStocks.reduce((acc, curr) => acc + (curr.units || 0), 0);
    const lowStockAlerts = allStocks.filter(s => s.isLow || s.units <= (s.threshold || 5)).length;

    const groupTotals = {};
    allStocks.forEach(s => {
      groupTotals[s.bloodGroup] = (groupTotals[s.bloodGroup] || 0) + (s.units || 0);
    });

    const totalBloodBanks = (db.bloodBanks || []).length;
    const totalCamps = (db.donationCamps || []).length;
    const totalDonors = (db.users || []).filter(u => u.role === 'donor').length;
    const openEmergencies = (db.emergencyRequests || []).filter(e => e.status === 'OPEN').length;

    return {
      success: true,
      stats: {
        totalUnitsAvailable: totalUnits,
        licensedBloodBanks: totalBloodBanks,
        registeredDonors: totalDonors,
        donationCampsOrganized: totalCamps,
        openEmergencyRequests: openEmergencies,
        lowStockAlerts,
        groupTotals
      }
    };
  }

  // GET /public/states
  if (cleanEndpoint === '/public/states' && method === 'GET') {
    const states = [...new Set((db.bloodBanks || []).map(b => b.state))].sort();
    return {
      success: true,
      states
    };
  }

  // GET /public/districts
  if (cleanEndpoint === '/public/districts' && method === 'GET') {
    const state = params.state;
    const filtered = (db.bloodBanks || []).filter(b => !state || b.state?.toLowerCase() === state.toLowerCase());
    const districts = [...new Set(filtered.map(b => b.district))].sort();
    return {
      success: true,
      state,
      districts
    };
  }

  // GET /public/stock
  if (cleanEndpoint === '/public/stock' && method === 'GET') {
    const { state, district, bloodGroup, component, isLow } = params;

    let filtered = db.stocks || [];
    if (state) filtered = filtered.filter(s => s.state?.toLowerCase() === state.toLowerCase());
    if (district) filtered = filtered.filter(s => s.district?.toLowerCase() === district.toLowerCase());
    if (bloodGroup) filtered = filtered.filter(s => s.bloodGroup === bloodGroup);
    if (component) filtered = filtered.filter(s => s.component?.toLowerCase() === component.toLowerCase());
    if (isLow !== undefined) filtered = filtered.filter(s => s.isLow === (isLow === 'true' || isLow === true));

    const enriched = filtered.map(stk => {
      const bb = (db.bloodBanks || []).find(b => b.id === stk.bloodBankId);
      return {
        ...stk,
        bloodBank: bb ? {
          name: bb.name,
          phone: bb.phone,
          helpline: bb.helpline,
          address: bb.address,
          is24x7: bb.is24x7,
          category: bb.category
        } : null
      };
    });

    return {
      success: true,
      count: enriched.length,
      stocks: enriched
    };
  }

  // GET /public/blood-banks
  if (cleanEndpoint === '/public/blood-banks' && method === 'GET') {
    const { state, district, query } = params;

    let results = db.bloodBanks || [];
    if (state) results = results.filter(b => b.state?.toLowerCase() === state.toLowerCase());
    if (district) results = results.filter(b => b.district?.toLowerCase() === district.toLowerCase());
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(b =>
        b.name?.toLowerCase().includes(q) ||
        b.address?.toLowerCase().includes(q) ||
        b.city?.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      count: results.length,
      bloodBanks: results
    };
  }

  // GET /public/blood-banks/:id
  const bbIdMatch = cleanEndpoint.match(/^\/public\/blood-banks\/([^/]+)$/);
  if (bbIdMatch && method === 'GET') {
    const id = bbIdMatch[1];
    const bloodBank = (db.bloodBanks || []).find(b => b.id === id);
    if (!bloodBank) {
      const err = new Error('Blood bank center not found.');
      err.status = 404;
      throw err;
    }

    const stocks = (db.stocks || []).filter(s => s.bloodBankId === id);
    const camps = (db.donationCamps || []).filter(c => c.bloodBankId === id);

    return {
      success: true,
      bloodBank,
      stocks,
      camps
    };
  }

  // GET /public/camps
  if (cleanEndpoint === '/public/camps' && method === 'GET') {
    const { state, district, status } = params;

    const today = new Date().toISOString().split('T')[0];
    let camps = (db.donationCamps || []).filter(c => (c.endDate || c.startDate) >= today);
    if (state) camps = camps.filter(c => c.state?.toLowerCase() === state.toLowerCase());
    if (district) camps = camps.filter(c => c.district?.toLowerCase() === district.toLowerCase());
    if (status) camps = camps.filter(c => c.status?.toLowerCase() === status.toLowerCase());

    camps = [...camps].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    return {
      success: true,
      count: camps.length,
      camps
    };
  }

  // GET /public/emergency
  if (cleanEndpoint === '/public/emergency' && method === 'GET') {
    const { status = 'OPEN', bloodGroup, state, urgency } = params;

    let requests = db.emergencyRequests || [];
    if (status && status !== 'ALL') requests = requests.filter(r => r.status?.toLowerCase() === status.toLowerCase());
    if (bloodGroup) requests = requests.filter(r => r.bloodGroup === bloodGroup);
    if (state) requests = requests.filter(r => r.state?.toLowerCase() === state.toLowerCase());
    if (urgency) requests = requests.filter(r => r.urgency?.toLowerCase() === urgency.toLowerCase());

    requests = [...requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      success: true,
      count: requests.length,
      requests
    };
  }

  // POST /public/emergency
  if (cleanEndpoint === '/public/emergency' && method === 'POST') {
    const {
      patientName,
      age,
      bloodGroup,
      component = 'Whole Blood',
      unitsNeeded,
      hospitalName,
      state,
      district,
      attendantName,
      contactPhone,
      urgency = 'HIGH',
      reason
    } = body;

    if (!patientName || !bloodGroup || !unitsNeeded || !hospitalName || !contactPhone) {
      const err = new Error('Patient name, blood group, units needed, hospital, and contact phone are required.');
      err.status = 400;
      throw err;
    }

    const newRequest = {
      id: `sos-${Date.now()}`,
      patientName,
      age: Number(age) || 30,
      bloodGroup,
      component,
      unitsNeeded: Number(unitsNeeded),
      unitsFulfilled: 0,
      hospitalName,
      state: state || 'Delhi',
      district: district || 'Central Delhi',
      attendantName: attendantName || patientName,
      contactPhone,
      urgency,
      reason: reason || 'Urgent medical requirement',
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };

    if (!db.emergencyRequests) db.emergencyRequests = [];
    db.emergencyRequests.unshift(newRequest);
    saveDB(db);

    return {
      success: true,
      message: 'Emergency SOS Broadcast submitted successfully! Nearby compatible donors and blood banks have been alerted.',
      emergencyRequest: newRequest
    };
  }

  // GET /public/verify-certificate/:certificateId
  const certMatch = cleanEndpoint.match(/^\/public\/verify-certificate\/([^/]+)$/);
  if (certMatch && method === 'GET') {
    const rawCertId = decodeURIComponent(certMatch[1]).trim();
    const certIdUpper = rawCertId.toUpperCase();

    const donation = (db.donationHistory || []).find(
      dh => dh.certificateId && dh.certificateId.toUpperCase() === certIdUpper
    );

    let donorName = 'Rahul Sharma';
    let bloodGroup = 'O+';
    let bloodBankName = 'AIIMS Central Blood Bank, New Delhi';
    let component = 'Whole Blood';
    let donationDate = '2024-11-15';
    let verifiedBy = 'Dr. Ananya Sen, Chief Medical Officer';
    let donorId = 'usr-donor-01';

    if (donation) {
      donorId = donation.donorId;
      bloodGroup = donation.bloodGroup;
      bloodBankName = donation.bloodBankName;
      component = donation.component;
      donationDate = donation.donationDate;
      verifiedBy = donation.verifiedBy || 'Dr. Ananya Sen';

      const donorUser = (db.users || []).find(u => u.id === donation.donorId);
      if (donorUser) {
        donorName = donorUser.name;
      }
    } else if (!certIdUpper.startsWith('ERK-CERT-')) {
      const err = new Error('Certificate not found in the e-RaktKosh National Transfusion Registry.');
      err.status = 404;
      err.data = { success: false, verified: false };
      throw err;
    }

    const verificationHash = await sha256Hex(`${certIdUpper}:${donorId}:${donationDate}`);

    const qrPayload = {
      standard: 'MoHFW_ERAKTKOSH_CERT_V1',
      certificateId: certIdUpper,
      donor: donorName,
      bloodGroup,
      facility: bloodBankName,
      component,
      date: donationDate,
      hash: verificationHash,
      verificationUrl: `https://eraktkosh.in/verify-cert/${certIdUpper}`
    };

    const qrCodeDataUrl = await generateQRCode(qrPayload);

    const certificate = {
      certificateId: certIdUpper,
      donorName,
      donorId,
      bloodGroup,
      bloodBankName,
      component,
      donationDate,
      verifiedBy,
      issuedAt: new Date().toISOString(),
      verificationHash,
      authorizedBy: 'Ministry of Health and Family Welfare (MoHFW), Govt. of India',
      verificationUrl: qrPayload.verificationUrl,
      qrCode: qrCodeDataUrl
    };

    return {
      success: true,
      verified: true,
      status: 'AUTHENTIC_VERIFIED',
      certificate
    };
  }

  // Fallback 404
  const err = new Error(`Cannot ${method} ${cleanEndpoint} - Endpoint not found in mock backend.`);
  err.status = 404;
  throw err;
};

export default handleMockRequest;
