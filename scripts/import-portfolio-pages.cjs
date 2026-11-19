// npm run sync:portfolio (uses the public Canva viewing link; no account required).
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { createHash } = require('node:crypto');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const sharp = require('sharp');

const SOURCE = 'https://www.canva.com/design/DAGuYcOTao0/sZzE6Zw97IOtctZjyR4n0w/view';
const MANIFEST = path.resolve('lib/data/portfolioManifest.json');
const DESTINATION = path.resolve('public/images/portfolio-current');

function sourceVersion(html) {
  return html.match(/"height"\s*:\s*\d+\s*,\s*"width"\s*:\s*\d+\s*,\s*"version"\s*:\s*(\d+)\s*,\s*"images"\s*:\s*\[/)?.[1] || null;
}
function needsSync(previous, version, total) {
  return !version || previous?.source !== SOURCE || previous?.sourceVersion !== version || previous?.pages?.length !== total;
}

async function sync() {
  const previous = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : null;
  const browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--no-sandbox'] });
  const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-sync-'));
  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, reducedMotion: 'reduce' });
    const response = await page.goto(`${SOURCE}?embed`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (!response?.ok()) throw new Error('Public Canva viewer could not be loaded');
    const version = sourceVersion(await response.text());
    const slider = page.locator('[aria-label="Design slider"]');
    await slider.waitFor({ timeout: 60000 });
    const total = Number(await slider.getAttribute('aria-valuemax'));
    if (!Number.isInteger(total) || total < 1 || total > 500) throw new Error(`Unexpected page count: ${total}`);
    if (needsSync(previous, version, total) === false && previous.pages.every(src => fs.existsSync(path.join('public', src)))) {
      console.log(`Canva version ${version}: ${total} pages, unchanged. No publication needed.`);
      return;
    }
    console.log(`Synchronizing Canva version ${version || 'unknown'}: ${total} pages`);
    await page.addStyleTag({ content: 'footer{opacity:0!important}[role="navigation"][aria-label="Slide"]{visibility:hidden!important}' });
    const pages = [];
    let previousHash;
    const release = version || String(Date.now());
    for (let i = 1; i <= total; i++) {
      await page.waitForFunction(n => document.querySelector('[aria-label="Design slider"]')?.getAttribute('aria-valuenow') === String(n), i);
      await page.waitForTimeout(i === 1 ? 2200 : 1800);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].filter(image => {
          const rect = image.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && rect.bottom > 50 && rect.top < 950;
        }).map(image => image.decode()));
      });
      let image;
      let hash;
      for (let attempt = 0; attempt < 3; attempt++) {
        image = await page.screenshot({ clip: { x: 0, y: 50, width: 1600, height: 900 } });
        hash = createHash('sha256').update(image).digest('hex');
        if (hash !== previousHash) break;
        // A slider can advance before the next slide finishes rendering.
        await page.waitForTimeout(1500);
      }
      previousHash = hash;
      const file = `v${release}-page-${String(i).padStart(3, '0')}.webp`;
      await sharp(image).webp({ quality: 87 }).toFile(path.join(staging, file));
      pages.push(`/images/portfolio-current/${file}`);
      console.log(`Exported ${i}/${total}`);
      if (i < total) await page.locator('button[aria-label="Next page"]').evaluate(button => button.click());
    }
    // Publish only a complete snapshot. Errors above leave the previous book untouched.
    const manifest = { source: SOURCE, sourceVersion: version, updatedAt: new Date().toISOString(), pages };
    fs.mkdirSync(DESTINATION, { recursive: true });
    fs.cpSync(staging, DESTINATION, { recursive: true });
    fs.writeFileSync(`${MANIFEST}.tmp`, JSON.stringify(manifest, null, 2) + '\n');
    fs.renameSync(`${MANIFEST}.tmp`, MANIFEST);
    for (const file of fs.readdirSync(DESTINATION)) {
      if (!pages.includes(`/images/portfolio-current/${file}`)) fs.rmSync(path.join(DESTINATION, file));
    }
    console.log(`Complete: ${total} pages. New asset URLs prevent stale browser caches.`);
  } finally {
    await browser.close();
    fs.rmSync(staging, { recursive: true, force: true });
  }
}
module.exports = { sourceVersion, needsSync };
if (require.main === module) sync().catch(error => { console.error(error); process.exitCode = 1; });
