const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let database = {
  users: [],
  donorProfiles: [],
  bloodBanks: [],
  stocks: [],
  donationCamps: [],
  emergencyRequests: [],
  donationHistory: []
};

// Safe atomic write to file
const persist = () => {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(database, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error persisting database:', err);
  }
};

// Load database from file
const load = () => {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      database = JSON.parse(content);
      console.log('Database successfully loaded from persistent storage.');
    } catch (err) {
      console.warn('Corrupted database file. Re-initializing...', err);
      seed();
    }
  } else {
    seed();
  }
};

// Seeding initial production-like dataset
const seed = () => {
  console.log('Seeding initial e-RaktKosh database...');

  const donorPasswordHash = bcrypt.hashSync('Donor@123', 10);
  const adminPasswordHash = bcrypt.hashSync('Admin@123', 10);

  const users = [
    {
      id: 'usr-donor-01',
      name: 'Rahul Sharma',
      email: 'donor@eraktkosh.in',
      password: donorPasswordHash,
      role: 'donor',
      phone: '+91 98765 43210',
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-admin-01',
      name: 'Dr. Ananya Sen',
      email: 'admin@aiims.edu',
      password: adminPasswordHash,
      role: 'admin',
      bloodBankId: 'bb-delhi-01',
      phone: '+91 98111 22334',
      createdAt: new Date().toISOString()
    }
  ];

  const donorProfiles = [
    {
      id: 'dp-01',
      userId: 'usr-donor-01',
      name: 'Rahul Sharma',
      bloodGroup: 'O+',
      dob: '1995-04-12',
      gender: 'Male',
      weight: 72,
      state: 'Delhi',
      district: 'Central Delhi',
      city: 'New Delhi',
      pincode: '110001',
      totalDonations: 4,
      lastDonationDate: '2024-11-15',
      eligibilityStatus: 'ELIGIBLE', // ELIGIBLE, TEMPORARY_INELIGIBLE
      badgeLevel: 'Silver LifeSaver', // Bronze, Silver, Gold, Platinum
      registeredCamps: ['camp-delhi-01']
    }
  ];

  const donationHistory = [
    {
      id: 'dh-01',
      donorId: 'usr-donor-01',
      bloodBankId: 'bb-delhi-01',
      bloodBankName: 'AIIMS Central Blood Bank, New Delhi',
      bloodGroup: 'O+',
      component: 'Whole Blood',
      unitsDonated: 1,
      donationDate: '2024-11-15',
      certificateId: 'ERK-CERT-2024-88412',
      verifiedBy: 'Dr. Ananya Sen',
      status: 'VERIFIED'
    },
    {
      id: 'dh-02',
      donorId: 'usr-donor-01',
      bloodBankId: 'bb-delhi-01',
      bloodBankName: 'AIIMS Central Blood Bank, New Delhi',
      bloodGroup: 'O+',
      component: 'Whole Blood',
      unitsDonated: 1,
      donationDate: '2024-07-20',
      certificateId: 'ERK-CERT-2024-41920',
      verifiedBy: 'Dr. Ananya Sen',
      status: 'VERIFIED'
    },
    {
      id: 'dh-03',
      donorId: 'usr-donor-01',
      bloodBankId: 'bb-delhi-02',
      bloodBankName: 'Safdarjung Hospital Regional Blood Centre',
      bloodGroup: 'O+',
      component: 'Platelets',
      unitsDonated: 1,
      donationDate: '2024-03-10',
      certificateId: 'ERK-CERT-2024-19402',
      verifiedBy: 'Dr. P. Verma',
      status: 'VERIFIED'
    },
    {
      id: 'dh-04',
      donorId: 'usr-donor-01',
      bloodBankId: 'bb-delhi-01',
      bloodBankName: 'AIIMS Central Blood Bank, New Delhi',
      bloodGroup: 'O+',
      component: 'Whole Blood',
      unitsDonated: 1,
      donationDate: '2023-11-05',
      certificateId: 'ERK-CERT-2023-99120',
      verifiedBy: 'Dr. Ananya Sen',
      status: 'VERIFIED'
    }
  ];

  const bloodBanks = [
    {
      id: 'bb-delhi-01',
      name: 'AIIMS Central Blood Bank & Transfusion Medicine',
      state: 'Delhi',
      district: 'Central Delhi',
      address: 'Ansari Nagar East, Ring Road, New Delhi',
      pincode: '110029',
      phone: '+91 11 26588500',
      helpline: '1800-11-AIIMS',
      email: 'bloodbank@aiims.edu',
      licenseNumber: 'DL/BLOOD/1996/001',
      category: 'Government / Tertiary Apex',
      is24x7: true,
      hasAphaeresis: true,
      hasComponentFacility: true
    },
    {
      id: 'bb-delhi-02',
      name: 'Safdarjung Hospital Regional Blood Centre',
      state: 'Delhi',
      district: 'South Delhi',
      address: 'Ring Road, Opposite AIIMS, New Delhi',
      pincode: '110029',
      phone: '+91 11 26165060',
      helpline: '011-26707444',
      email: 'transfusion@safdarjung.gov.in',
      licenseNumber: 'DL/BLOOD/1998/014',
      category: 'Government Hospital',
      is24x7: true,
      hasAphaeresis: true,
      hasComponentFacility: true
    },
    {
      id: 'bb-delhi-03',
      name: 'Indian Red Cross Society National Blood Center',
      state: 'Delhi',
      district: 'New Delhi',
      address: '1, Red Cross Road, New Delhi',
      pincode: '110001',
      phone: '+91 11 23711551',
      helpline: '1800-180-1910',
      email: 'bloodbank@indianredcross.org',
      licenseNumber: 'DL/BLOOD/1977/002',
      category: 'Red Cross / Voluntary',
      is24x7: true,
      hasAphaeresis: true,
      hasComponentFacility: true
    },
    {
      id: 'bb-mum-01',
      name: 'KEM Hospital & Blood Centre',
      state: 'Maharashtra',
      district: 'Mumbai',
      address: 'Acharya Donde Marg, Parel, Mumbai',
      pincode: '400012',
      phone: '+91 22 24107000',
      helpline: '022-24136051',
      email: 'bloodbank@kem.edu',
      licenseNumber: 'MH/MUM/1982/005',
      category: 'Municipal / Government',
      is24x7: true,
      hasAphaeresis: true,
      hasComponentFacility: true
    },
    {
      id: 'bb-mum-02',
      name: 'Tata Memorial Centre Blood Bank',
      state: 'Maharashtra',
      district: 'Mumbai',
      address: 'Dr. E Borges Road, Parel, Mumbai',
      pincode: '400012',
      phone: '+91 22 24177000',
      helpline: '022-24177267',
      email: 'blood@tmc.gov.in',
      licenseNumber: 'MH/MUM/1990/012',
      category: 'Apex Cancer Institute',
      is24x7: true,
      hasAphaeresis: true,
      hasComponentFacility: true
    },
    {
      id: 'bb-pune-01',
      name: 'Sassoon General Hospital Blood Bank',
      state: 'Maharashtra',
      district: 'Pune',
      address: 'Station Road, Near Pune Railway Station, Pune',
      pincode: '411001',
      phone: '+91 20 26128000',
      helpline: '020-26123456',
      email: 'sassoon.blood@maharashtra.gov.in',
      licenseNumber: 'MH/PUN/1985/008',
      category: 'Government Hospital',
      is24x7: true,
      hasAphaeresis: false,
      hasComponentFacility: true
    },
    {
      id: 'bb-blr-01',
      name: 'Victoria Hospital Central Blood Bank',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      address: 'Fort Road, Near City Market, Bengaluru',
      pincode: '560002',
      phone: '+91 80 26701150',
      helpline: '080-26703212',
      email: 'victoria.blood@karnataka.gov.in',
      licenseNumber: 'KA/BLR/1984/003',
      category: 'Government Hospital',
      is24x7: true,
      hasAphaeresis: true,
      hasComponentFacility: true
    },
    {
      id: 'bb-blr-02',
      name: 'NIMHANS Blood Center',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      address: 'Hosur Road, Lakkasandra, Bengaluru',
      pincode: '560029',
      phone: '+91 80 26995000',
      helpline: '080-26995180',
      email: 'transfusion@nimhans.ac.in',
      licenseNumber: 'KA/BLR/1995/022',
      category: 'Autonomous Institute',
      is24x7: true,
      hasAphaeresis: true,
      hasComponentFacility: true
    },
    {
      id: 'bb-chn-01',
      name: 'Rajiv Gandhi Government General Hospital Blood Bank',
      state: 'Tamil Nadu',
      district: 'Chennai',
      address: 'EVR Periyar Salai, Park Town, Chennai',
      pincode: '600003',
      phone: '+91 44 25305000',
      helpline: '044-25305138',
      email: 'bloodcenter@rggh.tn.gov.in',
      licenseNumber: 'TN/CHN/1975/001',
      category: 'Government Apex',
      is24x7: true,
      hasAphaeresis: true,
      hasComponentFacility: true
    },
    {
      id: 'bb-kol-01',
      name: 'Medical College & Hospital Blood Bank Kolkata',
      state: 'West Bengal',
      district: 'Kolkata',
      address: '88, College Street, Bowbazar, Kolkata',
      pincode: '700073',
      phone: '+91 33 22551600',
      helpline: '033-22551623',
      email: 'blood@mchkolkata.org',
      licenseNumber: 'WB/KOL/1970/004',
      category: 'Government Hospital',
      is24x7: true,
      hasAphaeresis: true,
      hasComponentFacility: true
    },
    {
      id: 'bb-lko-01',
      name: 'Sanjay Gandhi PGIMS Transfusion Medicine',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      address: 'Raebareli Road, Lucknow',
      pincode: '226014',
      phone: '+91 522 2668700',
      helpline: '0522-2494411',
      email: 'transfusion@sgpgi.ac.in',
      licenseNumber: 'UP/LKO/1989/009',
      category: 'Autonomous Super Specialty',
      is24x7: true,
      hasAphaeresis: true,
      hasComponentFacility: true
    },
    {
      id: 'bb-hyd-01',
      name: 'Gandhi Hospital Regional Blood Center',
      state: 'Telangana',
      district: 'Hyderabad',
      address: 'Musheerabad, Secunderabad, Hyderabad',
      pincode: '500003',
      phone: '+91 40 27505566',
      helpline: '040-27505567',
      email: 'gandhi.blood@telangana.gov.in',
      licenseNumber: 'TS/HYD/1992/015',
      category: 'Government Teaching Hospital',
      is24x7: true,
      hasAphaeresis: true,
      hasComponentFacility: true
    }
  ];

  // Blood groups and components
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const components = ['Whole Blood', 'PRBC', 'FFP', 'Platelets', 'SDP', 'Cryoprecipitate'];

  const stocks = [];
  let stockIdCounter = 1;

  bloodBanks.forEach(bb => {
    bloodGroups.forEach(group => {
      components.forEach(comp => {
        // AIIMS has healthy stock, others have varied realistic amounts
        let units = 0;
        if (bb.id === 'bb-delhi-01') {
          if (group === 'O+' || group === 'B+' || group === 'A+') {
            units = Math.floor(Math.random() * 25) + 15;
          } else if (group === 'AB-' || group === 'B-') {
            units = Math.floor(Math.random() * 6) + 2; // rarer
          } else {
            units = Math.floor(Math.random() * 14) + 6;
          }
        } else {
          units = Math.floor(Math.random() * 20) + 1;
        }

        stocks.push({
          id: `stk-${stockIdCounter++}`,
          bloodBankId: bb.id,
          bloodBankName: bb.name,
          state: bb.state,
          district: bb.district,
          bloodGroup: group,
          component: comp,
          units: units,
          threshold: 5,
          isLow: units <= 5,
          lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 3600000 * 8)).toISOString()
        });
      });
    });
  });

  const donationCamps = [
    {
      id: 'camp-delhi-01',
      name: 'National Voluntary Blood Donation Drive 2025',
      organizer: 'AIIMS Transfusion Medicine & NSS Delhi University',
      bloodBankId: 'bb-delhi-01',
      bloodBankName: 'AIIMS Central Blood Bank, New Delhi',
      state: 'Delhi',
      district: 'Central Delhi',
      venue: 'Faculty Hall, Campus Square, North Campus, Delhi University',
      startDate: '2026-09-18',
      endDate: '2026-09-18',
      timeSlot: '09:00 AM - 05:00 PM',
      contactPerson: 'Dr. Ananya Sen / Prof. Vikas Nair',
      contactPhone: '+91 98111 22334',
      targetUnits: 250,
      collectedUnits: 42,
      registeredDonors: ['usr-donor-01'],
      status: 'UPCOMING'
    },
    {
      id: 'camp-delhi-02',
      name: 'Red Cross Mega Corporate Blood Drive',
      organizer: 'Indian Red Cross Society with Rotary Club Delhi Central',
      bloodBankId: 'bb-delhi-03',
      bloodBankName: 'Indian Red Cross Society National Blood Center',
      state: 'Delhi',
      district: 'New Delhi',
      venue: 'FICCI Auditorium, Tansen Marg, Mandi House, New Delhi',
      startDate: '2026-09-24',
      endDate: '2026-09-24',
      timeSlot: '10:00 AM - 04:30 PM',
      contactPerson: 'Suresh Kumar',
      contactPhone: '+91 98711 00223',
      targetUnits: 180,
      collectedUnits: 0,
      registeredDonors: [],
      status: 'UPCOMING'
    },
    {
      id: 'camp-mum-01',
      name: 'Youth For Life Donation Drive Mumbai',
      organizer: 'KEM Hospital Youth Blood Donation Corps',
      bloodBankId: 'bb-mum-01',
      bloodBankName: 'KEM Hospital & Blood Centre',
      state: 'Maharashtra',
      district: 'Mumbai',
      venue: 'Shivaji Park Gymkhana Ground, Dadar West, Mumbai',
      startDate: '2026-09-20',
      endDate: '2026-09-20',
      timeSlot: '08:30 AM - 04:00 PM',
      contactPerson: 'Dr. Meera Deshmukh',
      contactPhone: '+91 98200 44556',
      targetUnits: 300,
      collectedUnits: 15,
      registeredDonors: [],
      status: 'UPCOMING'
    },
    {
      id: 'camp-blr-01',
      name: 'Tech City Blood Donation Carnival',
      organizer: 'Victoria Hospital & Bengaluru Rotary Tech Chapter',
      bloodBankId: 'bb-blr-01',
      bloodBankName: 'Victoria Hospital Central Blood Bank',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      venue: 'Manyata Tech Park Amphitheatre, Hebbal, Bengaluru',
      startDate: '2026-09-28',
      endDate: '2026-09-28',
      timeSlot: '09:30 AM - 05:30 PM',
      contactPerson: 'Ramesh Gowda',
      contactPhone: '+91 98450 12345',
      targetUnits: 200,
      collectedUnits: 0,
      registeredDonors: [],
      status: 'UPCOMING'
    }
  ];

  const emergencyRequests = [
    {
      id: 'sos-01',
      patientName: 'Kavita Sundaram',
      age: 34,
      bloodGroup: 'O-',
      component: 'PRBC',
      unitsNeeded: 3,
      unitsFulfilled: 1,
      hospitalName: 'AIIMS Trauma Center, New Delhi',
      state: 'Delhi',
      district: 'South Delhi',
      attendantName: 'Arun Sundaram (Husband)',
      contactPhone: '+91 98109 87654',
      urgency: 'CRITICAL',
      reason: 'Emergency Road Traffic Accident - Major Hepatic Trauma',
      status: 'OPEN',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 mins ago
    },
    {
      id: 'sos-02',
      patientName: 'Master Aarav Patel',
      age: 7,
      bloodGroup: 'B-',
      component: 'Platelets',
      unitsNeeded: 2,
      unitsFulfilled: 0,
      hospitalName: 'Tata Memorial Hospital, Parel, Mumbai',
      state: 'Maharashtra',
      district: 'Mumbai',
      attendantName: 'Priya Patel (Mother)',
      contactPhone: '+91 98210 11223',
      urgency: 'CRITICAL',
      reason: 'Pediatric Acute Lymphoblastic Leukemia (Severe Thrombocytopenia)',
      status: 'OPEN',
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hrs ago
    },
    {
      id: 'sos-03',
      patientName: 'Mohammed Zameer',
      age: 52,
      bloodGroup: 'AB-',
      component: 'FFP',
      unitsNeeded: 4,
      unitsFulfilled: 2,
      hospitalName: 'Gandhi Hospital, Musheerabad, Hyderabad',
      state: 'Telangana',
      district: 'Hyderabad',
      attendantName: 'Imran Zameer',
      contactPhone: '+91 98490 99887',
      urgency: 'HIGH',
      reason: 'Complex Emergency Open Heart Bypass Surgery',
      status: 'OPEN',
      createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString()
    }
  ];

  database = {
    users,
    donorProfiles,
    donationHistory,
    bloodBanks,
    stocks,
    donationCamps,
    emergencyRequests
  };

  persist();
  console.log('Database seeded successfully.');
};

// Initial load
load();

// Generic ORM-like collection abstraction
const createCollection = (collectionName) => ({
  find: (predicate = () => true) => {
    return (database[collectionName] || []).filter(predicate);
  },
  findOne: (predicate) => {
    return (database[collectionName] || []).find(predicate);
  },
  insert: (item) => {
    if (!database[collectionName]) {
      database[collectionName] = [];
    }
    database[collectionName].push(item);
    persist();
    return item;
  },
  update: (predicate, updater) => {
    const items = database[collectionName] || [];
    let updatedCount = 0;
    const updatedItems = [];
    items.forEach((item, index) => {
      if (predicate(item)) {
        database[collectionName][index] = { ...item, ...updater(item) };
        updatedItems.push(database[collectionName][index]);
        updatedCount++;
      }
    });
    if (updatedCount > 0) {
      persist();
    }
    return updatedItems;
  },
  remove: (predicate) => {
    const beforeCount = (database[collectionName] || []).length;
    database[collectionName] = (database[collectionName] || []).filter(item => !predicate(item));
    if (database[collectionName].length !== beforeCount) {
      persist();
      return true;
    }
    return false;
  },
  count: (predicate = () => true) => {
    return (database[collectionName] || []).filter(predicate).length;
  }
});

module.exports = {
  Users: createCollection('users'),
  DonorProfiles: createCollection('donorProfiles'),
  DonationHistory: createCollection('donationHistory'),
  BloodBanks: createCollection('bloodBanks'),
  Stocks: createCollection('stocks'),
  DonationCamps: createCollection('donationCamps'),
  EmergencyRequests: createCollection('emergencyRequests'),
  getRawData: () => database,
  persist,
  seed,
  reset: seed
};
