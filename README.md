# StampDutyCalc.in — Multi-Jurisdiction Property Stamp Duty & Registration Calculator

A lightweight, zero-framework, SEO-optimized web application for calculating property stamp duty, registration fees, municipal cesses, and statutory government charges across three major Indian real estate jurisdictions:
1. **West Bengal** (`/`)
2. **Maharashtra** (`/maharashtra/`)
3. **Delhi (NCT / MCD)** (`/delhi/`)

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
├── terms.html                   # Terms of Use
├── sitemap.xml                  # Canonical XML Sitemap
├── robots.txt                   # Search Engine Directives
├── site.webmanifest             # PWA Manifest
│
├── assets/                      # Consolidated Static Assets
│   ├── css/
│   │   └── style.css            # Master Design System & Scoped Regional Styles
│   ├── js/
│   │   ├── common.js            # Shared Utilities (Formatting, Modals, Accordions, Share)
│   │   └── calculators/
│   │       ├── west-bengal.js   # Unified West Bengal Calculation & UI Module
│   │       ├── maharashtra.js   # Unified Maharashtra Calculation & UI Module
│   │       └── delhi.js         # Unified Delhi Calculation & UI Module
│   └── images/                  # Favicons, Touch & Android App Icons
│
├── guides/                      # Comprehensive Real Estate Guides Hub
│   ├── index.html
│   ├── circle-rates-west-bengal.html
│   ├── mutation-west-bengal.html
│   ├── property-registration-documents.html
│   ├── stamp-duty-calculation-kolkata.html
│   ├── west-bengal-stamp-duty-guide.html
│   └── west-bengal-stamp-duty-guide-bn.html
│
├── west-bengal/                 # Canonical Redirect Stub
│   └── index.html               # 301 Redirect to `/`
│
├── maharashtra/                 # Dedicated Maharashtra Calculator
│   └── index.html               # Accessible at `/maharashtra/`
│
├── delhi/                       # Dedicated Delhi Calculator
│   └── index.html               # Accessible at `/delhi/`
│
├── tests/                       # Headless Regression Test Suite
│   ├── west-bengal.test.js      # West Bengal Unit Tests
│   ├── maharashtra.test.js      # Maharashtra Unit Tests
│   ├── delhi.test.js            # Delhi Unit Tests
│   ├── nav-structure.test.js    # Navbar Structure & Active State Tests
│   └── run-tests.js             # Master Test Runner
│
├── server.js                    # Local Development Server with Clean Routing
├── .htaccess                    # Hostinger Apache Directives (Gzip, Cache, 410 Gone, Aliases)
└── package.json                 # Project Scripts
```

---

## 3. Statutory Jurisdiction Calculations

| Jurisdiction | Route | Key Rules & Statutory Rates |
| :--- | :--- | :--- |
| **West Bengal** | `/` | **Urban**: 6% duty (7% for > ₹1 Cr). **Rural**: 5% duty (6% for > ₹1 Cr). **Women Buyer Rebate**: 1% concession. **Reg Fee**: 1.1% uncapped. **Gift (Blood Relative)**: 0.5% flat duty, exempt from surcharge. **General POA**: ₹1,000 duty + ₹200 reg. |
| **Maharashtra** | `/maharashtra/` | **Municipal Corp**: 5% base + 1% Metro Cess + 1% LBT (7% total in Mumbai/Pune/Thane). **Council**: 6%. **Rural**: 5%. **Female Rebate**: 1% on residential property. **Reg Fee**: 1% capped at ₹30,000 for properties > ₹30L. |
| **Delhi (NCT)** | `/delhi/` | Higher of Agreement Value vs Circle Rate. **Base Duty**: 3% (Female) or 4% (Male/Joint). **MCD Transfer Duty**: 2% (Female) or 3% (Male/Joint) for ≤ ₹25L; 3% (Female) or 4% (Male/Joint) for > ₹25L. **NDMC/Cantonment**: MCD duty exempt. **Reg Fee**: 1% flat. |

---

## 4. How to Add a New Jurisdiction

To add a new state/city calculator (e.g., Karnataka / Bengaluru):

1. **Create Calculator Module**:
   Add `assets/js/calculators/[state].js` as a self-contained UMD module containing statutory rates, localization dictionary, pure computation engine, and UI controller (using the same pattern as `delhi.js` and `maharashtra.js`).
2. **Create Page**:
   Create `[state]/index.html` referencing `/assets/css/style.css`, `/assets/js/common.js`, and `/assets/js/calculators/[state].js`.
3. **Update Navigation**:
   Add `<span class="nav-state-sep">|</span><a href="/[state]/" class="nav-state-link">State Name</a>` to the navbar across all HTML pages.
4. **Add Unit Tests**:
   Create `tests/[state].test.js` importing the pure calculation engine and register it in `tests/run-tests.js`.
5. **Update Sitemap**:
   Add `https://stampdutycalc.in/[state]/` to `sitemap.xml`.

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
Execute the comprehensive test suite across all 3 jurisdictions and navbar structure:
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
   - When a state revenue department issues a new notification (e.g., circle rate revisions or amnesty schemes), modify only the relevant rates section in `assets/js/calculators/[state].js` and add/update regression tests in `tests/`. No HTML modifications required.
