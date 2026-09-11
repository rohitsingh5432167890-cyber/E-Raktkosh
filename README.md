# e-RaktKosh Connect | National Voluntary Blood Donation & Transfusion Network

An enterprise-grade, full-stack web application modeled after the Ministry of Health & Family Welfare (MoHFW) e-RaktKosh initiative. It provides a nationwide digital platform for voluntary blood donation, real-time inventory management across licensed apex blood centers, emergency SOS broadcasts, verifiable digital donor passes, and cryptographically signed certificates of appreciation.

---

## 🌟 Key Capabilities

- **Real-Time Blood Stock Search**: Filter inventory across 8 blood groups (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`) and 6 components (`Whole Blood`, `PRBC`, `FFP`, `Platelets`, `SDP`, `Cryoprecipitate`) across 7 Indian states.
- **Licensed Apex Center Directory**: Access 12 apex transfusion facilities (AIIMS, Safdarjung, Red Cross, Tata Memorial, KEM, Victoria Hospital, Gandhi Hospital) with 24x7 operational indicators, license numbers, and direct contacts.
- **Role-Based Access Control (RBAC)**:
  - **Voluntary Blood Donors**: Personal donation tracker, next eligible donation countdown, medical pre-screening eligibility validation, donation camp RSVPs, and donation ledger.
  - **Blood Bank Administrators**: Center command center, 8×6 stock matrix manager with inline unit controls (`+`/`-`), donation verification hub, and emergency request fulfillment.
- **Official Digital QR Donor Pass**: Contactless, high-resolution QR pass generated with cryptographic donor credentials for fast-track intake at donation drives.
- **Publicly Verifiable QR Certificates**: Generates official Certificates of Appreciation with unique SHA-256 verification hashes and scannable QR codes, verifiable through the public registry endpoint (`/api/public/verify-certificate/:id`).
- **Emergency SOS Broadcasting**: Citizens and hospitals can submit urgent blood requests with real-time urgency triage (`CRITICAL`, `HIGH`, `MEDIUM`) and nearby donor alerting.
- **Voluntary Donation Camps**: Discover community blood donation drives and reserve donation time slots with instant confirmation.
- **High-Contrast Government Design System**: Clean, solid, opaque aesthetics honoring official MoHFW standards with Dark/Light theme toggle and mobile responsive drawer.

---

## 🏗 Architecture

```text
blood/
├── blood-donation-app/
│   ├── backend/               # Node.js + Express REST API
│   │   ├── src/
│   │   │   ├── config/        # Database engine (db.js), constants, JWT config
│   │   │   ├── controllers/   # Auth, Donor, Admin, Public controllers
│   │   │   ├── data/          # Persistent atomic JSON storage (database.json)
│   │   │   ├── middlewares/   # JWT auth, role guards, validation, error handler
│   │   │   ├── models/        # User, DonorProfile, BloodBank, Stock, Camp, SOS
│   │   │   ├── routes/        # Modular API routes
│   │   │   ├── scripts/       # CLI database seeder (seed.js)
│   │   │   ├── utils/         # QR generator, certificate helper, apiResponse, errors
│   │   │   └── server.js      # Express server with security headers & graceful shutdown
│   │   ├── tests/             # Automated test suite (node:test)
│   │   ├── .env.example       # Example environment configuration
│   │   └── package.json       # Backend dependencies & CLI scripts
│   │
│   └── frontend/              # React 18 + Vite Web Application
│       ├── src/
│       │   ├── api/           # API clients for auth, donor, admin, and public routes
│       │   ├── components/    # Navbar, Footer, Modal, QRCard, CertificateModal, SOS Banner
│       │   ├── context/       # AuthContext (session) & AppContext (theme, tabs, toasts)
│       │   ├── pages/
│       │   │   ├── admin/     # AdminDashboard, StockInventoryManager, VerificationHub
│       │   │   ├── auth/      # Login (with 1-click demo fill), RegisterDonor
│       │   │   ├── donor/     # DonorDashboard, DigitalPassView, DonationHistory
│       │   │   └── public/    # Landing, StockSearch, BloodBankDirectory, Camps, SOS, Verify
│       │   ├── App.jsx        # Root orchestrator with route synchronization
│       │   ├── index.css      # Solid, high-contrast design system & responsive drawer
│       │   └── main.jsx       # React DOM root
│       ├── index.html         # HTML entry point with MoHFW metadata
│       ├── vite.config.js     # Vite dev server with proxy to backend
│       └── package.json       # Frontend dependencies & build scripts
├── .gitignore                 # Root Git ignore rules
└── README.md                  # Project documentation
```

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### 2. Backend Setup
```bash
cd blood-donation-app/backend

# Install dependencies
npm install

# Run database seeder (seeds 12 centers, 576 stock items, camps, demo accounts)
npm run seed

# Run automated tests (18 integration tests)
npm test

# Start backend server (runs on port 5000)
npm start
```
API Health Check: `http://localhost:5000/api/public/health`

### 3. Frontend Setup
In a separate terminal:
```bash
cd blood-donation-app/frontend

# Install dependencies
npm install

# Start Vite development server (runs on port 5173)
npm run dev
```
Open your browser at: **`http://localhost:5173`**

---

## 🔑 Demo Credentials (with 1-Click Fill in UI)

| Role | Email | Password | Assigned Facility / Profile |
| :--- | :--- | :--- | :--- |
| **Voluntary Donor** | `donor@eraktkosh.in` | `Donor@123` | Rahul Sharma (O+ Positive, Gold Champion) |
| **Blood Bank Admin** | `admin@aiims.edu` | `Admin@123` | AIIMS Central Blood Bank, New Delhi |

*Tip: On the login page, simply click the **"Demo Donor"** or **"Demo Admin (AIIMS)"** button to instantly populate credentials.*

---

## 🧪 Automated Testing

The backend includes a comprehensive automated test suite powered by Node's native test runner (`node:test`):

```bash
cd blood-donation-app/backend
npm test
```
```text
✔ POST /api/auth/login succeeds with valid donor credentials
✔ POST /api/auth/login succeeds with valid admin credentials
✔ POST /api/auth/login rejects incorrect password with 401
✔ POST /api/auth/login rejects mismatched role portal with 403
✔ POST /api/auth/register rejects invalid email and blood group
✔ GET /api/auth/me rejects unauthenticated requests with 401
✔ GET /api/auth/me succeeds with valid Bearer token
✔ GET /api/public/health returns 200 and UP status
✔ GET /api/public/stats returns national metrics
✔ GET /api/public/states returns list of Indian states
✔ GET /api/public/districts?state=Delhi returns districts
✔ GET /api/public/camps returns scheduled donation drives
✔ GET /api/public/emergency returns emergency blood requests
✔ GET /api/public/stock returns enriched inventory with blood bank details
✔ GET /api/public/stock?state=Delhi&bloodGroup=O+ filters accurately
✔ GET /api/public/blood-banks returns licensed facilities
✔ GET /api/public/verify-certificate/:id verifies pre-seeded authentic certificate
✔ GET /api/public/verify-certificate/:id rejects invalid certificate

18 tests, 0 failures (100% pass rate)
```

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
