# StampDutyCalc.in — Multi-Jurisdiction Property Stamp Duty & Registration Calculator

A lightweight, zero-framework, SEO-optimized web application for calculating property stamp duty, registration fees, municipal cesses, and statutory government charges across five major Indian real estate jurisdictions:
1. **West Bengal** (`/`)
2. **Maharashtra** (`/maharashtra/`)
3. **Chennai (Tamil Nadu)** (`/chennai/`)
4. **Bengaluru (Karnataka)** (`/bangalore/`)
5. **Delhi (NCT / MCD)** (`/delhi/`)

Live website: [https://stampdutycalc.in/](https://stampdutycalc.in/)  
Repository: [https://github.com/Tushar1623/stamp-duty-calculator](https://github.com/Tushar1623/stamp-duty-calculator)

---

## 1. Technologies & Architecture Principles

- **Core**: Vanilla HTML5, CSS3, and JavaScript (ES6+).
- **Design System**: Tailored CSS tokens in `style.css` (Gold & Forest palette, responsive breakpoints, accessible focus rings).
- **Zero Heavy Frameworks**: No React, Next.js, or client-side build tools required. Fast, static HTML serving compatible with Apache, Nginx, Hostinger, cPanel, and Node.js reverse proxies.
- **Decoupled Architecture**: Every state/city calculator cleanly separates:
  - **Rates Configuration** (`rates-data.js`): Legal statutory formulas, fee caps, exemptions.
  - **Core Calculation Engine** (`calculator.js`): Headless, pure mathematical logic testable under Node.js and browser.
  - **Localization & Copy** (`i18n.js`): Bilingual dictionaries (EN + regional language).
  - **UI Controller** (`ui-controller.js`): DOM rendering, live number-to-words, validation, results card display.
  - **Lifecycle Bootstrap** (`app.js`): Event listeners, lead capture, mobile widgets.

---

## 2. Directory Structure

```text
public_html/
├── index.html                   # West Bengal Calculator Page (Canonical `/`)
├── about.html                   # About Us
├── contact-us.html              # Contact Us
├── disclaimer.html              # Legal Disclaimer
├── privacy-policy.html          # Privacy Policy
├── sitemap.xml                  # Canonical XML Sitemap
├── robots.txt                   # Search Engine Directives
├── style.css                    # Unified Design System & Shared Calculator Styles
├── app-utility.js               # Shared Utilities (Formatting, Modals, Accordions, Share)
│
├── west-bengal/                 # West Bengal Calculator Module
│   ├── index.html               # 301 Redirect to `/`
│   └── js/
│       ├── config/rates-data.js # WB Stamp Act Rates & Deed Rules
│       ├── config/i18n.js       # English & Bengali Strings
│       ├── core/calculator.js   # Pure WB Computation Engine
│       ├── ui/ui-controller.js  # West Bengal DOM Controller
│       └── app.js               # Application Bootstrap
│
├── maharashtra/                 # Maharashtra Calculator Module
│   ├── index.html               # Dedicated Maharashtra Page (`/maharashtra/`)
│   ├── css/maharashtra.css      # Marathi Typography & Scoped Widgets
│   └── js/
│       ├── config/rates-data.js # Mumbai, Pune, Thane Municipal Corporation/Council Rates
│       ├── config/i18n.js       # English & Marathi Strings
│       ├── core/calculator.js   # Maharashtra Computation Engine
│       ├── ui/ui-controller.js  # Maharashtra DOM Controller
│       └── app.js               # Application Bootstrap
│
├── chennai/                     # Chennai (Tamil Nadu) Calculator Module
│   ├── index.html               # Dedicated Chennai Page (`/chennai/`)
│   ├── css/chennai.css          # Tamil Typography
│   └── js/
│       ├── config/rates-data.js # TN Stamp Act & Registration Department Rates
│       ├── config/i18n.js       # English & Tamil Strings
│       ├── core/calculator.js   # Chennai Computation Engine
│       ├── ui/ui-controller.js  # Chennai DOM Controller
│       └── app.js               # Application Bootstrap
│
├── bangalore/                   # Bengaluru (Karnataka) Calculator Module
│   ├── index.html               # Dedicated Bengaluru Page (`/bangalore/`)
│   ├── css/bangalore.css        # Kannada Typography
│   └── js/
│       ├── config/rates-data.js # Karnataka Slabs (2%, 3%, 5%), Cesses & Sur.
│       ├── config/i18n.js       # English & Kannada Strings
│       ├── core/calculator.js   # Bengaluru Computation Engine
│       ├── ui/ui-controller.js  # Bengaluru DOM Controller
│       └── app.js               # Application Bootstrap
│
├── delhi/                       # Delhi (NCT) Calculator Module
│   ├── index.html               # Dedicated Delhi Page (`/delhi/`)
│   ├── css/delhi.css            # Hindi Typography
│   └── js/
│       ├── config/rates-data.js # Delhi Stamp Act + MCD Transfer Duty Rates
│       ├── config/i18n.js       # English & Hindi Strings
│       ├── core/calculator.js   # Delhi Computation Engine
│       ├── ui/ui-controller.js  # Delhi DOM Controller
│       └── app.js               # Application Bootstrap
│
├── tests/                       # Headless Regression Test Suite
│   ├── west-bengal.test.js      # West Bengal Unit Tests
│   ├── maharashtra.test.js      # Maharashtra Unit Tests
│   ├── chennai.test.js          # Chennai Unit Tests
│   ├── bangalore.test.js        # Bengaluru Unit Tests
│   ├── delhi.test.js            # Delhi Unit Tests
│   ├── nav-structure.test.js    # Navbar Structure & Active State Tests
│   └── run-tests.js             # Master Test Runner
│
├── server.js                    # Local Development Server with Clean Routing
└── package.json                 # Project Scripts
```

---

## 3. Statutory Jurisdiction Calculations

| Jurisdiction | Route | Key Rules & Statutory Rates |
| :--- | :--- | :--- |
| **West Bengal** | `/` | **Urban**: 6% duty (7% for > ₹1 Cr). **Rural**: 5% duty (6% for > ₹1 Cr). **Women Buyer Rebate**: 1% concession. **Reg Fee**: 1.1% uncapped. **Gift (Blood Relative)**: 0.5% flat duty, exempt from surcharge. **General POA**: ₹1,000 duty + ₹200 reg. |
| **Maharashtra** | `/maharashtra/` | **Municipal Corp**: 5% base + 1% Metro Cess + 1% LBT (7% total in Mumbai/Pune/Thane). **Council**: 6%. **Rural**: 5%. **Female Rebate**: 1% on residential property. **Reg Fee**: 1% capped at ₹30,000 for properties > ₹30L. |
| **Chennai (TN)** | `/chennai/` | Higher of Agreement Value vs Guideline Value. **Sale Deed**: 7% duty + 4% reg fee (11% total). **Female Concession**: 3% reg fee for properties ≤ ₹10L. **Family Gift**: 1% duty (capped at ₹40k) + 1% reg fee (capped at ₹10k) = ₹50k max. **TDS**: 1% Section 194-IA alert for ≥ ₹50L. |
| **Bengaluru (KA)** | `/bangalore/` | Higher of Agreement Value vs Guidance Value. **Slab 1 (≤ ₹20L)**: 2% base + 10% cess + 2% surcharge = 2.24% duty + 2% reg = 4.24%. **Slab 2 (₹20L–₹45L)**: 3% base + cesses = 3.36% duty + 2% reg = 5.36%. **Slab 3 (> ₹45L)**: 5% base + cesses = 5.60% duty + 2% reg = 7.60%. **Family Gift**: Fixed ₹5,600 duty in BBMP, ₹3,360 in Panchayat. |
| **Delhi (NCT)** | `/delhi/` | Higher of Agreement Value vs Circle Rate. **Base Duty**: 3% (Female) or 4% (Male/Joint). **MCD Transfer Duty**: 2% (Female) or 3% (Male/Joint) for ≤ ₹25L; 3% (Female) or 4% (Male/Joint) for > ₹25L. **NDMC/Cantonment**: MCD duty exempt. **Reg Fee**: 1% flat. |

---

## 4. How to Add a New Jurisdiction

To add a new state/city calculator (e.g., Hyderabad / Telangana):

1. **Create Directory**:
   Create `hyderabad/` with subdirectories `css/` and `js/config/`, `js/core/`, `js/ui/`.
2. **Configure Rates**:
   Add `hyderabad/js/config/rates-data.js` containing statutory rates, slabs, and deed exemptions.
3. **Implement Core Engine**:
   Add `hyderabad/js/core/calculator.js` implementing a pure computation function exportable to Node and window.
4. **Add Translations**:
   Add `hyderabad/js/config/i18n.js` with English and Telugu strings.
5. **Build Page**:
   Create `hyderabad/index.html` referencing `/style.css`, `/app-utility.js`, and the modular JS scripts.
6. **Update Navigation**:
   Add `<span class="nav-state-sep">|</span><a href="/hyderabad/" class="nav-state-link">Hyderabad</a>` to the navbar in all pages.
7. **Add Unit Tests**:
   Create `tests/hyderabad.test.js` and register it in `tests/run-tests.js`.
8. **Update Sitemap**:
   Add `https://stampdutycalc.in/hyderabad/` to `sitemap.xml`.

---

## 5. Development & Testing Commands

### Prerequisites
- Node.js (v18+)

### Running Locally
```bash
node server.js
```
The server will start at `http://localhost:3000/`.

### Running Tests
Execute the comprehensive test suite across all 5 jurisdictions and navbar structure:
```bash
node tests/run-tests.js
```
Or via npm:
```bash
npm test
```

---

## 6. Deployment Guidelines

1. **Static Web Hosts (cPanel, Hostinger, Apache, Nginx)**:
   - Upload the entire contents of `public_html/` to your web server root.
   - The included `.htaccess` file handles caching, compression (Brotli/Gzip), and clean trailing slash normalization.
2. **Redirect Preservation**:
   - `/west-bengal/` contains a meta-refresh and JS redirect to `/`, and `server.js` issues a 301 permanent redirect to protect SEO rankings.
3. **Updating Government Rates**:
   - When a state revenue department issues a new notification (e.g., circle rate revisions or amnesty schemes), modify only the relevant `rates-data.js` file and add/update regression tests in `tests/`. No HTML modifications required.
