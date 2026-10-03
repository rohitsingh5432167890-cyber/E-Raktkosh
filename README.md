# e-RaktKosh Connect — National Blood Transfusion Service Portal

A modern, responsive, full-featured web portal for the **Ministry of Health and Family Welfare (MoHFW), Government of India**, designed to streamline voluntary blood donations, real-time blood bank inventory monitoring, emergency SOS requests, verifiable digital donor passes, and cryptographically verified donor certificates.

---

## 🚀 Standalone Frontend Architecture (Deployable to Netlify)

This repository is configured as a **100% frontend-only web application** that can be directly deployed to **Netlify**, **Vercel**, **Cloudflare Pages**, or **GitHub Pages** without deploying any backend server or external database.

### Key Capabilities
- **Zero Backend Required**: All API routes (`/api/auth/*`, `/api/donor/*`, `/api/admin/*`, `/api/public/*`) run inside the browser via an embedded simulation layer.
- **Client-Side Persistence**: State changes (new donor registrations, blood stock updates, emergency SOS broadcasts, camp registrations, donations, and newly issued certificates) persist in browser `localStorage`.
- **Pre-Seeded Production Dataset**: Comes with 12 major apex blood bank facilities across Delhi, Mumbai, Pune, Bengaluru, Kolkata, Chennai, Lucknow, and Hyderabad, 570+ blood stock matrix items, active donation camps, and emergency requests.
- **Dynamic QR Code Pass & Certificate Generation**: Generates high-resolution, scannable QR codes for Digital Donor Passes and Ministry of Health Certificates directly in the browser.
- **Remote Backend Ready (Optional)**: If you ever want to connect a live Node/Express/Flask backend in the future, simply define `VITE_API_BASE_URL` in `.env`.

---

## 📦 How to Deploy on Netlify

### Option 1: Git Integration (Recommended)
1. Push this repository to GitHub or GitLab.
2. Log in to [Netlify](https://app.netlify.com/) and click **"Add new site" > "Import an existing project"**.
3. Select this repository.
4. Netlify will automatically detect the settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **"Deploy site"**. Your site will be live instantly!

### Option 2: Drag and Drop (Manual)
1. Run `npm run build` locally.
2. Drag and drop the generated `dist/` folder directly into the Netlify Sites dashboard.

---

## 🔑 Demo Login Accounts

| Role | Email | Password | Features Accessible |
|---|---|---|---|
| **Verified Voluntary Donor** | `donor@eraktkosh.in` | `Donor@123` | Donor Dashboard, Digital QR Pass, Donation History, Certificates, Camp Booking |
| **Hospital / Blood Bank Admin** | `admin@eraktkosh.in` | `Admin@123` | Central Blood Bank Dashboard, Real-time Stock Manager, Verify Donation & Issue Certificate, SOS Emergency Dispatch, Camp Drive Scheduler |

*You can also click **"Register as Voluntary Donor"** to create a new donor account with any custom credentials.*

---

## 🔍 Sample Verifiable Certificates
Test the public certificate verification page (`/verify-cert`) with any of the following registry IDs:
- `ERK-CERT-2024-88412`
- `ERK-CERT-2024-41920`
- `ERK-CERT-2024-19402`
- `ERK-CERT-2023-99120`

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## 📂 Project Structure

```
├── public/
│   └── _redirects              # Netlify SPA redirect rules (/* /index.html 200)
├── src/
│   ├── api/                    # Client API adapters (authApi, donorApi, adminApi, publicApi)
│   ├── components/             # Reusable UI components (Navbar, Footer, Modals, QRCard, EmergencyBanner)
│   ├── context/                # AuthContext and AppContext
│   ├── mockBackend/            # In-browser standalone backend simulation & initial seed data
│   │   ├── initialData.json    # Complete database seed
│   │   └── mockApi.js          # In-browser routing, QR generation, eligibility, and state management
│   ├── pages/                  # Views (Public, Auth, Donor Portal, Admin Portal)
│   ├── App.jsx                 # App router & layout
│   ├── index.css               # Modern design system & responsive styling
│   └── main.jsx                # Application root mount
├── index.html                  # HTML entry point with MoHFW branding & typography
├── netlify.toml                # Netlify deployment configuration
├── package.json                # Project dependencies and build scripts
└── vite.config.js              # Vite configuration
```
