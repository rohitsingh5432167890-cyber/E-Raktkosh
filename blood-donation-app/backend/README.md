# e-RaktKosh Connect - Backend REST API

Production-ready, enterprise-grade backend service powering the **e-RaktKosh Connect** National Blood Transfusion Service web application.

---

## 🏗 Architecture Overview

The backend is built with **Node.js** and **Express.js**, featuring strict separation of concerns and an embedded transactional JSON database that requires zero external infrastructure or native compilers.

```
backend/
├── src/
│   ├── config/
│   │   ├── constants.js       # Centralized domain enums (blood groups, components, roles)
│   │   ├── db.js              # Transactional persistent file-backed database engine
│   │   └── jwt.js             # JWT signing key & token utilities
│   ├── controllers/
│   │   ├── adminController.js     # Stock updates, donation verification, emergency fulfillment
│   │   ├── authController.js      # Register, login, session inspection
│   │   ├── bloodBankController.js # Public search, directories, certificate verification
│   │   └── donorController.js     # Donor profile, passes, donation history
│   ├── data/
│   │   └── database.json      # Persistent atomic JSON storage file
│   ├── middlewares/
│   │   ├── authMiddleware.js  # Bearer JWT verification & context attachment
│   │   ├── errorHandler.js    # Centralized operational & syntax error handler
│   │   ├── roleGuard.js       # Strict RBAC enforcement ('donor' vs 'admin')
│   │   └── validateRequest.js # Schema validation for request payloads
│   ├── models/
│   │   ├── BloodBank.js       # Apex center profiles with license numbers
│   │   ├── DonationCamp.js    # Community blood donation drives
│   │   ├── DonorProfile.js    # Medical eligibility, donation history, badge tiers
│   │   ├── EmergencyRequest.js# Emergency SOS requests with triage statuses
│   │   ├── Stock.js           # 8×6 Blood group & component inventory records
│   │   └── User.js            # User credentials with bcryptjs hashing
│   ├── routes/
│   │   ├── adminRoutes.js     # Protected admin endpoints
│   │   ├── authRoutes.js      # Public authentication endpoints
│   │   ├── donorRoutes.js     # Protected donor endpoints
│   │   └── publicRoutes.js    # Open citizen & hospital discovery endpoints
│   ├── scripts/
│   │   └── seed.js            # CLI database reset and seeder utility
│   ├── utils/
│   │   ├── apiResponse.js     # Uniform API JSON formatters
│   │   ├── certificateHelper.js# Cryptographic certificate payload & QR generator
│   │   ├── errors.js          # Custom application error classes
│   │   ├── notificationService.js# Simulated SOS matching alerts
│   │   └── qrGenerator.js     # High-resolution QR code generator
│   └── server.js              # Server entry point, security headers, graceful shutdown
├── tests/
│   ├── auth.test.js           # Authentication & RBAC integration tests
│   ├── health.test.js         # Public endpoints & discovery tests
│   └── stock.test.js          # Inventory matrix & certificate validation tests
├── .env                       # Environment configuration
├── .env.example               # Example environment variables
└── package.json               # Dependencies and CLI scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### 2. Environment Configuration
Verify your `.env` file exists in `backend/`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=eraktkosh_national_super_secure_jwt_secret_2026_mohfw
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### 3. Available CLI Scripts
```bash
# Start backend server in standard mode
npm start

# Run database seeder / reset
npm run seed

# Execute full automated test suite (18 test suites)
npm test
```

---

## 🔐 Authentication & RBAC

All protected endpoints require an HTTP `Authorization` header formatted as:
```http
Authorization: Bearer <JWT_TOKEN>
```

### Pre-Seeded Demo Credentials

| Role | Email | Password | Assigned Facility / Profile |
| :--- | :--- | :--- | :--- |
| **Voluntary Donor** | `donor@eraktkosh.in` | `Donor@123` | Rahul Sharma (O+ Positive, Gold Champion) |
| **Blood Bank Admin** | `admin@aiims.edu` | `Admin@123` | AIIMS Central Blood Bank, New Delhi |

---

## 📡 Core API Endpoints

### Public Endpoints (`/api/public`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/public/health` | Service health status & uptime |
| `GET` | `/api/public/stats` | National aggregate units, banks, and donor counts |
| `GET` | `/api/public/states` | List of 7 covered Indian states |
| `GET` | `/api/public/districts?state=Delhi` | Districts within a selected state |
| `GET` | `/api/public/stock` | Filterable blood stock matrix (by state, group, component) |
| `GET` | `/api/public/blood-banks` | Directory of 12 licensed apex centers |
| `GET` | `/api/public/blood-banks/:id` | Center profile with real-time stock & camps |
| `GET` | `/api/public/camps` | Scheduled voluntary blood drives |
| `GET` | `/api/public/emergency` | Active emergency SOS alerts |
| `POST`| `/api/public/emergency` | Submit emergency blood SOS broadcast |
| `GET` | `/api/public/verify-certificate/:id` | Public verification for official QR certificates |

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Voluntary donor registration with validation |
| `POST` | `/api/auth/login` | Secure sign in for donors and admins |
| `GET`  | `/api/auth/me` | Current authenticated user context & profile |

### Donor Portal Endpoints (`/api/donor`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET`  | `/api/donor/profile` | Donor medical profile & eligibility dates |
| `PUT`  | `/api/donor/profile` | Update contact & demographic details |
| `GET`  | `/api/donor/history` | Verified donation history ledger |
| `GET`  | `/api/donor/pass` | Generate verified contactless Digital QR Pass |
| `POST` | `/api/donor/camps/:campId/register` | RSVP for scheduled blood donation drive |

### Admin Hub Endpoints (`/api/admin`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET`  | `/api/admin/dashboard` | Apex center metrics, low stock warnings, emergency triage |
| `GET`  | `/api/admin/stock` | Full 8×6 stock matrix for the facility |
| `PUT`  | `/api/admin/stock` | Increment/decrement or set unit counts |
| `POST` | `/api/admin/verify-donation` | Record donor intake & generate verifiable certificate |
| `GET`  | `/api/admin/emergency` | Regional emergency SOS triage list |
| `PUT`  | `/api/admin/emergency/:id/fulfill` | Dispatch units & fulfill emergency requests |
| `GET`  | `/api/admin/camps` | Facility donation camps list |
| `POST` | `/api/admin/camps` | Schedule new voluntary donation camp drive |
