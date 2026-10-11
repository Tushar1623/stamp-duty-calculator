# Maharashtra Stamp Duty Calculator (2025–2026) Architecture

## 📁 Professional Directory & File Structure

```text
public_html/
└── maharashtra/
    ├── index.html                   # Clean, semantic HTML layout & SEO Schema (JSON-LD)
    ├── css/
    │   └── maharashtra.css          # Scoped page styles, typography, and responsive rules
    └── js/
        ├── config/
        │   ├── i18n.js              # Localization dictionaries (English 'en' & Marathi 'mr')
        │   └── rates-data.js        # Statutory rates, zone maps, Metro Cess, LBT, & deed definitions
        ├── core/
        │   └── calculator.js        # Pure, testable computational business logic engine
        ├── ui/
        │   └── ui-controller.js     # DOM state management, validation, dynamic breadcrumbs, & actions
        └── app.js                   # Application lifecycle bootstrapper & event listeners
```

---

## 🏗️ Layer Responsibilities

### 1. `index.html` (Presentation & Structure)
- Stripped of monolithic 430+ line inline `<script>` tags and ad-hoc inline `style="..."` attributes.
- Contains accessible semantic HTML with full SEO schema structured data (`@type: SoftwareApplication`, `FAQPage`, `BreadcrumbList`).
- Connects modular CSS and script bundles in proper dependency order.

### 2. `css/maharashtra.css` (Visual Design & Responsive Layout)
- Scoped CSS rules for the state selector, dynamic breadcrumbs, breakdown details, and sidebar reference card.
- Clean typography bindings for Google Fonts `Noto Sans Devanagari` when toggled to Marathi.

### 3. `js/config/` (Configuration & Data)
- **`i18n.js` (`window.MH_I18N`)**: Complete bilingual translation dictionary (`T.en`, `T.mr`) with share templates and editorial headings.
- **`rates-data.js` (`window.MH_RATES`)**: Statutory slab definitions as per Maharashtra Stamp Act and IGR Maharashtra Annual Statement of Rates (ASR).
  - Navi Mumbai / Thane: 5% Base + 1% Metro Cess + 1% LBT = 7%
  - Mumbai City / Suburban: 5% Base + 1% Metro Cess = 6%
  - Urban / Corporation: 7%
  - Municipal Council: 6%
  - Rural / Gram Panchayat: 5%
  - Female Sole Owner: 1% rebate on base rate
  - Registration Fee: 1% capped at ₹30,000 for properties > ₹30 Lakhs

### 4. `js/core/calculator.js` (Pure Calculation Engine)
- Decoupled from the DOM.
- Exposes `MH_CALCULATOR.computeStampDuty(params)` which takes plain inputs and returns a structured breakdown object.
- Unit-testable in Node.js or browser testing frameworks.

### 5. `js/ui/ui-controller.js` (UI Controller)
- Manages interactive states: language switching, zone buttons, gender toggles, deed notes, and live number-to-words.
- Formats currency into Indian standard notation (`₹50,00,000`).
- Provides fallback wrappers to ensure zero runtime errors.

### 6. `js/app.js` (Entrypoint)
- Listens to `DOMContentLoaded`.
- Initializes the floating mobile calculate button and WhatsApp lead capture pipeline.
