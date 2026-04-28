import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml');

/**
 * This script addresses the "404 for SPA routes" issue on GitHub Pages.
 * It reads the sitemap and creates a physical directory/index.html pair for each route.
 * This ensures Googlebot receives a 200 OK status instead of a 404, which is
 * critical for indexing and SEO ranking.
 */
async function generate() {
  console.log('--- 🚀 XPRESS STATIC ROUTE GENERATOR ---');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Error: dist directory not found. Please run "npm run build" first.');
    process.exit(1);
  }

  try {
    const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
    // Extract paths from <loc> tags, filtering out the root and non-site URLs
    const locs = sitemap.match(/<loc>https:\/\/xpressautozone\.com(\/.*?)<\/loc>/g)
      .map(loc => loc.replace(/<\/?loc>/g, '').replace('https://xpressautozone.com', ''))
      .filter(route => route && route !== '/');

    console.log(`📦 Found ${locs.length} unique routes in sitemap.`);

    const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');

    for (const route of locs) {
      // Clean up the route to handle trailing slashes or weird formatting
      const cleanRoute = route.split('?')[0].split('#')[0];
      const routePath = path.join(DIST_DIR, cleanRoute);
      const indexPath = path.join(routePath, 'index.html');

      if (!fs.existsSync(routePath)) {
        fs.mkdirSync(routePath, { recursive: true });
      }

      fs.writeFileSync(indexPath, indexHtml);
      console.log(`  ✅ ${cleanRoute}/index.html`);
    }

    console.log('\n✨ Pipeline Complete: SEO routes are now physically present in /dist');
  } catch (error) {
    console.error('❌ Generator Error:', error.message);
    process.exit(1);
  }
}

generate();
