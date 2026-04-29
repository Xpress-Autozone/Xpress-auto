import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml');
const API_BASE_URL = "https://xpress-backend-eeea.onrender.com";

/**
 * Fetches all products from the backend and updates the sitemap.xml
 * to ensure Google can index every individual component.
 */
async function updateSitemap() {
  console.log('--- 🗺️ XPRESS SITEMAP UPDATER ---');

  try {
    // 1. Fetch products
    console.log('🔍 Fetching inventory from backend...');
    const response = await fetch(`${API_BASE_URL}/products?limit=1000`);
    const data = await response.json();

    if (!data.success || !data.data) {
      throw new Error('Failed to fetch products from API');
    }

    const products = data.data;
    console.log(`📦 Found ${products.length} products.`);

    // 2. Read existing sitemap base
    // We'll keep the core pages and only replace/update the product entries
    let sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
    
    // Remove old dynamic product URLs if any exist (marked by comments)
    const productStartTag = '<!-- DYNAMIC_PRODUCTS_START -->';
    const productEndTag = '<!-- DYNAMIC_PRODUCTS_END -->';
    
    const startIndex = sitemap.indexOf(productStartTag);
    const endIndex = sitemap.indexOf(productEndTag);

    let productEntries = `\n  ${productStartTag}\n`;
    
    products.forEach(product => {
      productEntries += `  <url>\n`;
      productEntries += `    <loc>https://xpressautozone.com/product/${product.id}</loc>\n`;
      productEntries += `    <changefreq>weekly</changefreq>\n`;
      productEntries += `    <priority>0.8</priority>\n`;
      productEntries += `  </url>\n`;
    });
    
    productEntries += `  ${productEndTag}`;

    if (startIndex !== -1 && endIndex !== -1) {
      // Replace existing dynamic block
      sitemap = sitemap.slice(0, startIndex) + productEntries + sitemap.slice(endIndex + productEndTag.length);
    } else {
      // Insert before closing tag if tags don't exist yet
      sitemap = sitemap.replace('</urlset>', `${productEntries}\n</urlset>`);
    }

    // 3. Write back to file
    fs.writeFileSync(SITEMAP_PATH, sitemap);
    console.log('✅ sitemap.xml updated successfully with all products.');

  } catch (error) {
    console.error('❌ Sitemap Update Error:', error.message);
  }
}

updateSitemap();
