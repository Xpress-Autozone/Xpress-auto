import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Use a hardcoded API URL for build time generation to ensure it works in CI/CD environments
const API_URL = "https://xpress-backend-eeea.onrender.com";
const BASE_URL = "https://xpressautozone.com";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchAllProducts() {
    try {
        console.log("Fetching all products for sitemap...");
        // Fetch with a large limit to get all products
        const response = await fetch(`${API_URL}/products?limit=1000&isActive=true`);
        const data = await response.json();

        if (data.success && data.data) {
            return data.data;
        }
        return [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

const staticPages = [
    '/',
    '/categories',
    '/body-chassis',
    '/engine-performance',
    '/wheels-tires',
    '/lighting-electronics',
    '/accessories',
    '/automotive-tools',
    '/fluids-care',
    '/cooling-ac',
    '/xplore',
    '/xplore/featured',
    '/xplore/trending',
    '/xplore/new',
    '/partner',
    '/privacy-policy',
    '/terms-of-service'
];

function generateSitemapXML(products) {
    const currentDate = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static pages
    staticPages.forEach(page => {
        const priority = page === '/' ? '1.0' : '0.8';
        xml += `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });

    // Add product pages
    products.forEach(product => {
        xml += `
  <url>
    <loc>${BASE_URL}/product/${product.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    return xml;
}

async function main() {
    try {
        const products = await fetchAllProducts();
        console.log(`Found ${products.length} products.`);

        const sitemap = generateSitemapXML(products);

        // Path to public/sitemap.xml
        const publicDir = path.resolve(__dirname, '../public');
        // Ensure public dir exists
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        const sitemapPath = path.join(publicDir, 'sitemap.xml');

        fs.writeFileSync(sitemapPath, sitemap);
        console.log(`Sitemap generated successfully at ${sitemapPath}`);
    } catch (error) {
        console.error("Failed to generate sitemap:", error);
        process.exit(1);
    }
}

main();
