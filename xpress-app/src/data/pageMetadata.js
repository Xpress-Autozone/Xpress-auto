/**
 * Page Metadata Constants
 * Centralized SEO metadata for all pages in the application
 */

const BASE_URL = 'https://xpressautozone.com';
const BRAND_NAME = 'Xpress Autozone';
const DEFAULT_OG_IMAGE = 'https://xpressautozone.com/assets/og-image.jpg';

export const pageMetadata = {
  home: {
    title: 'Xpress Autozone | Premium Auto Parts & Accessories',
    description: 'Your one-stop shop for quality auto parts and accessories. Find genuine parts, expert advice, and fast delivery with Xpress Search intelligent vehicle search.',
    keywords: 'auto parts, car parts, vehicle accessories, car maintenance, auto repair parts Ghana, Xpress Autozone',
    url: BASE_URL,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  categories: {
    title: 'Shop By Category | Xpress Autozone',
    description: 'Browse our comprehensive collection of auto parts organized by category: Body & Chassis, Engine Performance, Wheels & Tires, Accessories, Lighting, Fluids, Tools, and Cooling Systems.',
    keywords: 'auto parts categories, car parts by category, automotive accessories, vehicle parts shop',
    url: `${BASE_URL}/categories`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  bodyChassisCategory: {
    title: 'Body & Chassis Parts | Xpress Autozone',
    description: 'Premium body and chassis parts for all vehicle types. Fenders, doors, bumpers, and structural components. Quality auto body parts with fast delivery.',
    keywords: 'body parts, chassis parts, fenders, doors, bumpers, auto body components, vehicle structural parts',
    url: `${BASE_URL}/body-chassis`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  enginePerformanceCategory: {
    title: 'Engine Performance Parts | Xpress Autozone',
    description: 'Enhance your engine performance with quality parts: air filters, spark plugs, fuel injectors, timing belts, and more. Premium engine components for all vehicles.',
    keywords: 'engine parts, performance parts, air filters, spark plugs, fuel injectors, timing belts, engine components',
    url: `${BASE_URL}/engine-performance`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  wheelsTiresCategory: {
    title: 'Wheels & Tires | Xpress Autozone',
    description: 'Shop premium wheels and tires for your vehicle. Find the perfect tire size, alloy wheels, and tire accessories. Quality wheels & tires with expert guidance.',
    keywords: 'wheels, tires, alloy wheels, tire size calculator, vehicle tires, automotive wheels, tire accessories',
    url: `${BASE_URL}/wheels-tires`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  accessoriesCategory: {
    title: 'Car Accessories | Xpress Autozone',
    description: 'Upgrade your vehicle with our wide selection of car accessories: floor mats, seat covers, custom parts, and more. Quality automotive accessories.',
    keywords: 'car accessories, vehicle accessories, seat covers, floor mats, car customization, automotive upgrades',
    url: `${BASE_URL}/accessories`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  lightingElectronicsCategory: {
    title: 'Lighting & Electronics | Xpress Autozone',
    description: 'Premium automotive lighting and electrical components. LED headlights, taillights, wiring harnesses, and electronic parts for all vehicles.',
    keywords: 'automotive lighting, LED headlights, vehicle electronics, electrical components, tail lights, lighting systems',
    url: `${BASE_URL}/lighting-electronics`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  fluidsCareCategory: {
    title: 'Fluids & Maintenance | Xpress Autozone',
    description: 'Essential fluids and maintenance products for vehicle care: motor oil, coolant, brake fluid, filters, and more. Keep your vehicle running smoothly.',
    keywords: 'motor oil, coolant, brake fluid, transmission fluid, vehicle maintenance, car fluids, filters',
    url: `${BASE_URL}/fluids-care`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  automotiveToolsCategory: {
    title: 'Automotive Tools | Xpress Autozone',
    description: 'Professional-grade automotive tools for mechanics and DIY enthusiasts. Socket sets, wrenches, diagnostic tools, and more.',
    keywords: 'automotive tools, hand tools, socket sets, wrenches, diagnostic tools, mechanic tools, DIY tools',
    url: `${BASE_URL}/automotive-tools`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  coolingACCategory: {
    title: 'Cooling & AC Systems | Xpress Autozone',
    description: 'Cooling and air conditioning parts for your vehicle. Radiators, water pumps, AC compressors, thermostats, and cooling system components.',
    keywords: 'cooling system, air conditioning parts, radiator, AC compressor, water pump, thermostat, cooling components',
    url: `${BASE_URL}/cooling-ac`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  products: {
    title: 'All Products | Xpress Autozone',
    description: 'Browse all automotive parts and accessories available at Xpress Autozone. Quality products for all vehicle maintenance needs.',
    keywords: 'all auto parts, automotive products, car parts catalog, vehicle parts shop',
    url: `${BASE_URL}/product`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  search: {
    title: 'Search Results | Xpress Autozone',
    description: 'Search results for automotive parts and accessories at Xpress Autozone. Find exactly what you need with our intelligent search.',
    keywords: 'auto parts search, car parts finder, automotive search',
    url: `${BASE_URL}/search`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  cart: {
    title: 'Shopping Cart | Xpress Autozone',
    description: 'Review your shopping cart and proceed to checkout. Quality auto parts ready for fast delivery.',
    keywords: 'shopping cart, checkout, auto parts order',
    url: `${BASE_URL}/cart`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  xplore: {
    title: 'Xplore | Discover Featured & Trending Parts | Xpress Autozone',
    description: 'Discover featured products, trending items, and new arrivals at Xpress Autozone. Find the best deals on quality auto parts.',
    keywords: 'featured products, trending auto parts, new arrivals, best deals, automotive shopping',
    url: `${BASE_URL}/xplore`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  featured: {
    title: 'Featured Products | Xpress Autozone',
    description: 'Shop our handpicked selection of featured automotive parts and accessories. Quality products curated for your vehicle.',
    keywords: 'featured auto parts, recommended products, best sellers, quality parts',
    url: `${BASE_URL}/xplore/featured`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  trending: {
    title: 'Trending Products | Xpress Autozone',
    description: 'Check out trending automotive parts and accessories. Popular products that customers are buying right now.',
    keywords: 'trending auto parts, popular products, best sellers, automotive trends',
    url: `${BASE_URL}/xplore/trending`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  new: {
    title: 'New Arrivals | Xpress Autozone',
    description: 'Discover new automotive parts and accessories just added to our catalog. Stay up-to-date with the latest products.',
    keywords: 'new auto parts, new arrivals, latest products, new automotive parts',
    url: `${BASE_URL}/xplore/new`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  login: {
    title: 'Sign In | Xpress Autozone',
    description: 'Sign in to your Xpress Autozone account to track orders, save favorites, and enjoy faster checkout.',
    keywords: 'sign in, login, account login, user account',
    url: `${BASE_URL}/login`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    noindex: true,
  },

  signup: {
    title: 'Create Account | Xpress Autozone',
    description: 'Create a new Xpress Autozone account to enjoy faster checkout, track orders, and access exclusive deals.',
    keywords: 'sign up, register, create account, new account',
    url: `${BASE_URL}/signup`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    noindex: true,
  },

  account: {
    title: 'My Account | Xpress Autozone',
    description: 'Manage your Xpress Autozone account: view orders, update profile, manage addresses, and track shipments.',
    keywords: 'my account, user profile, order history, account settings',
    url: `${BASE_URL}/account`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    noindex: true,
  },

  partner: {
    title: 'Become a Partner | Xpress Autozone',
    description: 'Partner with Xpress Autozone to grow your business. Learn about our wholesale programs and partnership opportunities.',
    keywords: 'partner with us, wholesale, business partnership, reseller program',
    url: `${BASE_URL}/partner`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  },

  privacyPolicy: {
    title: 'Privacy Policy | Xpress Autozone',
    description: 'Read Xpress Autozone\'s privacy policy to understand how we collect, use, and protect your personal information.',
    keywords: 'privacy policy, data protection, privacy',
    url: `${BASE_URL}/privacy-policy`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    noindex: true,
  },

  termsOfService: {
    title: 'Terms of Service | Xpress Autozone',
    description: 'Review the terms of service for Xpress Autozone. Understand our policies and conditions for using our platform.',
    keywords: 'terms of service, terms and conditions, user agreement',
    url: `${BASE_URL}/terms-of-service`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
    noindex: true,
  },
};

/**
 * Helper function to get metadata for a specific page
 */
export const getPageMetadata = (page) => {
  return pageMetadata[page] || pageMetadata.home;
};

/**
 * Helper function to generate dynamic product metadata
 */
export const getProductMetadata = (product) => {
  return {
    title: `${product.name} | Buy at Xpress Autozone`,
    description: product.description || `Quality ${product.name} at Xpress Autozone. Check price, availability, and fast delivery options.`,
    keywords: `${product.name}, buy ${product.name}, ${product.category}, auto parts`,
    url: `${BASE_URL}/product/${product.id}`,
    ogType: 'product',
    ogImage: product.image || DEFAULT_OG_IMAGE,
    price: product.price,
    availability: product.inStock ? 'In Stock' : 'Out of Stock',
  };
};

/**
 * Helper function to generate search results metadata
 */
export const getSearchMetadata = (query) => {
  const searchQuery = query || 'auto parts';
  return {
    title: `Search Results for "${searchQuery}" | Xpress Autozone`,
    description: `Search results for ${searchQuery} at Xpress Autozone. Find quality auto parts and accessories.`,
    keywords: `${searchQuery}, auto parts search, car parts`,
    url: `${BASE_URL}/search?q=${encodeURIComponent(query || '')}`,
    ogType: 'website',
    ogImage: DEFAULT_OG_IMAGE,
  };
};
