const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const pages = [
  { file: 'index.html', name: 'West Bengal', activeUrl: '/', activeText: 'West Bengal' },
  { file: 'maharashtra/index.html', name: 'Maharashtra', activeUrl: '/maharashtra/', activeText: 'Maharashtra' },
  { file: 'chennai/index.html', name: 'Chennai', activeUrl: '/chennai/', activeText: 'Chennai' },
  { file: 'bangalore/index.html', name: 'Bengaluru', activeUrl: '/bangalore/', activeText: 'Bengaluru' },
  { file: 'delhi/index.html', name: 'Delhi', activeUrl: '/delhi/', activeText: 'Delhi' },
  { file: 'about.html', name: 'About (Static)', activeUrl: null },
  { file: 'contact-us.html', name: 'Contact (Static)', activeUrl: null },
  { file: 'disclaimer.html', name: 'Disclaimer (Static)', activeUrl: null },
  { file: 'privacy-policy.html', name: 'Privacy Policy (Static)', activeUrl: null },
  { file: 'terms.html', name: 'Terms of Use (Static)', activeUrl: null },
  { file: 'guides/index.html', name: 'Guides Hub', activeUrl: null },
  { file: 'guides/west-bengal-stamp-duty-guide.html', name: 'WB Guide', activeUrl: '/' },
  { file: 'guides/stamp-duty-calculation-kolkata.html', name: 'Kolkata Flat Guide', activeUrl: '/' },
  { file: 'guides/circle-rates-west-bengal.html', name: 'Circle Rate Guide', activeUrl: '/' },
  { file: 'guides/mutation-west-bengal.html', name: 'Mutation Guide', activeUrl: '/' },
  { file: 'guides/property-registration-documents.html', name: 'Documents Guide', activeUrl: '/' },
  { file: 'guides/west-bengal-stamp-duty-guide-bn.html', name: 'Bengali Guide', activeUrl: '/' }
];

const expectedLinks = [
  { href: '/', text: 'West Bengal' },
  { href: '/maharashtra/', text: 'Maharashtra' },
  { href: '/chennai/', text: 'Chennai' },
  { href: '/bangalore/', text: 'Bengaluru' },
  { href: '/delhi/', text: 'Delhi' }
];

console.log('================================================================');
console.log(' StampDutyCalc.in - Navbar Structure & Active Link Verification');
console.log('================================================================\n');

let totalPassed = 0;
let totalFailed = 0;

for (const p of pages) {
  const filePath = path.join(rootDir, p.file);
  if (!fs.existsSync(filePath)) {
    console.error(`✗ FAIL: File not found: ${p.file}`);
    totalFailed++;
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  // 1. Check for nav-state-bar
  if (!html.includes('<nav class="nav-state-bar" aria-label="States &amp; Regions">')) {
    console.error(`✗ FAIL: ${p.file} missing <nav class="nav-state-bar"> element`);
    totalFailed++;
    continue;
  }

  // 2. Check that old dropdown is completely gone
  if (html.includes('nav-state-select') || html.includes('nav-state-wrap')) {
    console.error(`✗ FAIL: ${p.file} still contains legacy nav-state dropdown`);
    totalFailed++;
    continue;
  }

  // 3. Check all 5 links exist
  let missingLink = false;
  for (const l of expectedLinks) {
    if (!html.includes(`href="${l.href}"`) || !html.includes(`>${l.text}</a>`)) {
      console.error(`✗ FAIL: ${p.file} missing link for ${l.text} (${l.href})`);
      missingLink = true;
      totalFailed++;
    }
  }
  if (missingLink) continue;

  // 4. Check active link
  if (p.activeUrl) {
    const activeRegex = new RegExp(`href="${p.activeUrl}"[^>]*class="[^"]*active[^"]*"[^>]*aria-current="page"`);
    const activeRegexAlt = new RegExp(`class="[^"]*active[^"]*"[^>]*href="${p.activeUrl}"[^>]*aria-current="page"`);
    const activeRegexAlt2 = new RegExp(`href="${p.activeUrl}"[^>]*aria-current="page"[^>]*class="[^"]*active[^"]*"`);
    if (!activeRegex.test(html) && !activeRegexAlt.test(html) && !activeRegexAlt2.test(html)) {
      console.error(`✗ FAIL: ${p.file} active state not properly assigned to ${p.activeUrl}`);
      totalFailed++;
      continue;
    }
  } else {
    // Static pages: ensure no link is active
    if (html.includes('class="nav-state-link active"')) {
      console.error(`✗ FAIL: ${p.file} unexpectedly has active state on a static page`);
      totalFailed++;
      continue;
    }
  }

  console.log(`✓ PASS: ${p.name} (${p.file}) has verified horizontal nav bar and correct active state`);
  totalPassed++;
}

// 5. Verify CSS rules in style.css
const cssContent = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf8');
const requiredCssSelectors = [
  '.nav-state-bar',
  '.nav-state-link',
  '.nav-state-sep',
  '.nav-state-link.active',
  '.nav-state-link[aria-current="page"]',
  '@media (max-width: 959px)',
  'overflow-x: auto',
  'scrollbar-width: none'
];

let missingCss = false;
for (const sel of requiredCssSelectors) {
  if (!cssContent.includes(sel)) {
    console.error(`✗ FAIL: style.css missing selector/rule: ${sel}`);
    missingCss = true;
    totalFailed++;
  }
}

if (!missingCss) {
  console.log('✓ PASS: style.css contains all desktop, mobile scroll, and active state styles');
  totalPassed++;
}

console.log(`\nResults: ${totalPassed} passed, ${totalFailed} failed.`);
if (totalFailed > 0) process.exit(1);
