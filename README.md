# e-RaktKosh | Centralized Blood Bank Management & Donor Portal

A modern, responsive, and accessible web application modeled after the national blood bank management initiative. It facilitates real-time blood stock tracking, voluntary donor registration, blood donation camp discovery & booking, and emergency SOS broadcasting.

---

## 🩸 Key Features

- **Real-Time Blood Stock Search**: Filter blood center inventory by State, District, Blood Group (A+, B+, O+, AB+, Bombay Blood Group, etc.), and Component (Whole Blood, PRBC, Platelets/SDP/RDP, FFP).
- **Voluntary Donor Registration**: Eligibility validation (age & weight checks) with automatic **Digital Donor ID Card** generation.
- **Donation Camps & Slot Reservation**: Search nearby voluntary blood donation drives and reserve donation time slots.
- **Emergency SOS Request Desk**: Rapid broadcast form to request emergency blood units at specific hospitals.
- **Interactive Compatibility Matrix**: Visual guide showing donor/recipient compatibility for all major blood types.
- **Hospital Admin Inventory Dashboard**: Simulated admin portal to monitor stock levels and restock blood components.
- **Multi-Language (i18n) Support**: Seamless real-time translation across 6 languages:
  - English, हिन्दी (Hindi), বাংলা (Bengali), தமிழ் (Tamil), తెలుగు (Telugu), and मराठी (Marathi).
- **Theme Customization**: Sleek Light and Dark modes with user preference persistence via `localStorage`.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3
- **Design & Typography**: Modern glassmorphism, responsive CSS Grid/Flexbox, Google Fonts (*Inter* & *Outfit*)
- **Icons**: Lucide Icons CDN

---

## 📁 Project Structure

```text
├── index.html        # Main semantic markup and multi-tab structure
├── styles.css        # Responsive design system, CSS variables & theme tokens
├── app.js            # Core application logic, DOM event listeners & workflows
├── data.js           # Blood bank datasets, camps, compatibility rules & i18n dictionaries
└── README.md         # Project overview and documentation
```

---

## 🚀 How to Run Locally

1. Clone or download this repository.
2. Open `index.html` directly in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari).
3. *(Optional)* Use a local development server like VS Code Live Server or `npx serve .`.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
