const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const articlesDir = path.join(rootDir, 'Articles MD');

console.log('================================================================');
console.log(' StampDutyCalc.in - Blog Articles & Navigation Verification');
console.log(' Verifying 15 Imported Articles, Landing Page, SEO & Metadata');
console.log('================================================================\n');

let totalPassed = 0;
let totalFailed = 0;

function assert(condition, message) {
  if (condition) {
    totalPassed++;
  } else {
    console.error(`✗ FAIL: ${message}`);
    totalFailed++;
  }
}

// 1. Verify source Markdown directory
assert(fs.existsSync(articlesDir), 'Articles MD directory exists');
const mdFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
assert(mdFiles.length === 15, `Found exactly 15 Markdown files in Articles MD/ (Found: ${mdFiles.length})`);

// 2. Expected 15 Slugs mapping
const expectedArticles = [
  'carpet-area-stamp-duty-west-bengal-2026',
  'gift-deed-stamp-duty-maharashtra-2026',
  'gift-deed-stamp-duty-west-bengal-2026',
  'kolkata-stamp-duty-2026',
  'maharashtra-ready-reckoner-rate-2026-27',
  'maharashtra-stamp-duty-registration-charges-2026',
  'maharashtra-stamp-duty-calculator-2026',
  'power-of-attorney-stamp-duty-west-bengal-2026',
  'property-registration-howrah-siliguri-2026',
  'rent-agreement-stamp-duty-maharashtra-2026',
  'mumbai-stamp-duty-2026',
  'stamp-duty-pune-thane-navi-mumbai-2026',
  'wb-igr-market-value-e-assessment-2026',
  'west-bengal-stamp-duty-registration-charges-2026',
  'women-stamp-duty-rebate-maharashtra-2026'
];

assert(expectedArticles.length === 15, '15 expected slugs defined');

// 3. Verify each article HTML
for (const slug of expectedArticles) {
  const articlePath = path.join(rootDir, 'blogs', slug, 'index.html');
  assert(fs.existsSync(articlePath), `Article file exists: blogs/${slug}/index.html`);

  if (!fs.existsSync(articlePath)) continue;

  const content = fs.readFileSync(articlePath, 'utf8');

  // Verify SEO metadata
  assert(content.includes('<title>') && content.includes('StampDutyCalc.in'), `${slug} has title`);
  assert(content.includes('<meta name="description"'), `${slug} has meta description`);
  assert(content.includes(`<link rel="canonical" href="https://stampdutycalc.in/blogs/${slug}/">`), `${slug} has correct canonical URL`);
  assert(content.includes('<meta property="og:title"'), `${slug} has OG title`);
  assert(content.includes('<meta property="og:type" content="article">'), `${slug} has OG article type`);

  // Verify JSON-LD Schema
  assert(content.includes('"@type": "BlogPosting"'), `${slug} has BlogPosting JSON-LD`);
  assert(content.includes('"@type": "BreadcrumbList"'), `${slug} has BreadcrumbList JSON-LD`);

  // Verify Common Header
  assert(content.includes('<nav class="nav-state-bar" aria-label="States &amp; Regions">'), `${slug} has nav-state-bar`);
  assert(content.includes('href="/blogs/" class="nav-state-link active">Blogs</a>'), `${slug} has active Blogs nav link`);
  assert(content.includes('href="/about.html" class="nav-main-link">About</a>'), `${slug} has About link`);
  assert(content.includes('href="/contact-us.html" class="nav-main-link">Contact</a>'), `${slug} has Contact link`);
  assert(content.includes('class="lang-toggle"') && content.includes('id="lang-en"') && content.includes('id="lang-bn"'), `${slug} has language toggle`);
  assert(content.includes('class="header-cta"') && content.includes('Calculate Now'), `${slug} has Calculate Now button`);

  // Verify Common Breadcrumb & Content integrity
  assert(content.includes('<nav class="breadcrumb-nav"'), `${slug} has breadcrumb nav`);
  assert(content.includes('<h1'), `${slug} has h1 tag`);
  assert(content.includes('<div class="article-content">'), `${slug} has article-content`);
  assert(content.length > 5000, `${slug} has full substantive content (> 5000 chars, not truncated)`);
  assert(content.includes('class="calc-callout-card"'), `${slug} has calculator callout`);
  assert(content.includes('class="related-articles-section"'), `${slug} has related articles`);
  assert(content.includes('<footer>'), `${slug} has footer`);
}

// 4. Verify Blogs Landing Page
const blogsIndexPath = path.join(rootDir, 'blogs', 'index.html');
assert(fs.existsSync(blogsIndexPath), 'blogs/index.html exists');
if (fs.existsSync(blogsIndexPath)) {
  const blogsIndex = fs.readFileSync(blogsIndexPath, 'utf8');
  assert(blogsIndex.includes('Stamp Duty &amp; Property <em>Guides</em>') || blogsIndex.includes('Stamp Duty &amp; Property Guides'), 'Blogs hub has correct H1');
  assert(blogsIndex.includes('id="blogSearchInput"'), 'Blogs hub has client-side search input');
  assert(blogsIndex.includes('id="blogEmptyState"'), 'Blogs hub has zero results empty state');
  assert(blogsIndex.includes('class="lang-toggle"') && blogsIndex.includes('id="lang-en"') && blogsIndex.includes('id="lang-bn"'), 'Blogs hub has language toggle');
  assert(blogsIndex.includes('class="header-cta"') && blogsIndex.includes('Calculate Now'), 'Blogs hub has Calculate Now button');

  // Verify all 15 cards present
  for (const slug of expectedArticles) {
    assert(blogsIndex.includes(`/blogs/${slug}/`), `Blogs hub contains card link to /blogs/${slug}/`);
  }

  // Verify categories
  const categories = ['west-bengal', 'maharashtra', 'property-registration', 'property-documents', 'gift-deeds', 'rent-agreements', 'valuation'];
  for (const cat of categories) {
    assert(blogsIndex.includes(`data-category="${cat}"`), `Blogs hub contains filter button for category: ${cat}`);
  }
}

// 5. Verify Sitemap.xml
const sitemapPath = path.join(rootDir, 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'sitemap.xml exists');
if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  assert(sitemap.includes('<loc>https://stampdutycalc.in/blogs/</loc>'), 'sitemap.xml includes /blogs/');
  for (const slug of expectedArticles) {
    assert(sitemap.includes(`<loc>https://stampdutycalc.in/blogs/${slug}/</loc>`), `sitemap.xml includes /blogs/${slug}/`);
  }
  assert(!sitemap.includes('chennai'), 'sitemap.xml has no chennai links');
  assert(!sitemap.includes('bangalore'), 'sitemap.xml has no bangalore links');
  assert(!sitemap.includes('karnataka'), 'sitemap.xml has no karnataka links');
}

// 6. Verify robots.txt
const robotsPath = path.join(rootDir, 'robots.txt');
assert(fs.existsSync(robotsPath), 'robots.txt exists');
if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  assert(!robots.includes('Disallow: /blogs'), 'robots.txt does not block /blogs/');
}

console.log(`\nBlog Verification Results: ${totalPassed} passed, ${totalFailed} failed.`);

if (totalFailed > 0) {
  process.exit(1);
}
