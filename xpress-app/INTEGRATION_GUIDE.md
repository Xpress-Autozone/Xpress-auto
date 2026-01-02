# Xpress AutoZone - Frontend Integration Guide

## Overview
This document outlines the complete integration between the React frontend and the Firebase backend API.

## Architecture

### Backend API Base URL
- **Development**: `http://localhost:3001/api`
- **Environment Variable**: `VITE_API_URL`

### Key Endpoints Used

#### Products
- `GET /products` - Get all products with pagination
- `GET /products/:id` - Get single product by ID
- `GET /products/category/:category` - Get products by category
- `POST /search` - Search products with query

#### Response Format
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "product-id",
      "itemName": "Product Name",
      "price": 99.99,
      "quantity": 10,
      "category": "wheels tires rims",
      "mainImage": {
        "url": "https://...",
        "filePath": "..."
      },
      "additionalImages": [],
      "description": "...",
      "condition": "new",
      "isActive": true,
      "displayOnPage": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "limit": 20,
    "totalItems": 100,
    "totalPages": 5
  }
}
```

## Frontend Structure

### Services

#### `src/lib/productService.js`
Centralized API service with logging for all product-related API calls.

**Functions:**
- `getProductsByCategory(category, options)` - Fetch products by category
- `getProductById(productId)` - Fetch single product
- `searchProducts(query, filters, page, pageSize)` - Search products
- `getAllProducts(options)` - Fetch all products with filters

**Logging:**
All functions include detailed console logging with timestamps and emojis for easy debugging.

```javascript
// Example usage
import { getProductsByCategory } from "@/lib/productService";

const data = await getProductsByCategory("wheels tires rims", { 
  limit: 20, 
  page: 1 
});
```

### Custom Hooks

#### `src/hooks/useProducts.js`
Reusable React hooks for product fetching with state management.

**Hooks:**
- `useProductsByCategory(category, options)` - Hook for category products
- `useAllProducts(options)` - Hook for all products
- `useProduct(productId)` - Hook for single product

**Returns:**
```javascript
{
  products: [],      // Array of products
  loading: boolean,  // Loading state
  error: string,     // Error message if any
  pagination: {}     // Pagination info
}
```

**Example Usage:**
```javascript
import { useProductsByCategory } from "@/hooks/useProducts";

function MyComponent() {
  const { products, loading, error } = useProductsByCategory("wheels tires rims");
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  
  return <ProductList products={products} />;
}
```

### Components

#### `src/Components/ProductCard/ProductCard.jsx`
Reusable product card component with two variants.

**Props:**
```javascript
{
  product: {
    id: string,
    name: string,
    price: number,
    image: string,
    status: "In Stock" | "Out of Stock" | "Low Stock",
    verified: boolean
  },
  variant: "default" | "featured"
}
```

**Variants:**
- `default` - Used in category pages
- `featured` - Used in home page featured section

### Utilities

#### `src/lib/logger.js`
Centralized logging utility for debugging.

**Methods:**
- `debug(message, data)` - Debug level logs
- `info(message, data)` - Info level logs
- `warn(message, data)` - Warning level logs
- `error(message, data)` - Error level logs
- `success(message, data)` - Success level logs
- `logApiCall(method, endpoint, payload)` - Log API calls
- `logApiResponse(status, message, data)` - Log API responses
- `logApiError(error, context)` - Log API errors
- `logPerformance(operation, duration)` - Log performance metrics

**Example Usage:**
```javascript
import Logger from "@/lib/logger";

const logger = new Logger("MyComponent");
logger.info("Component mounted");
logger.logApiCall("GET", "/products");
logger.success("Products loaded", { count: 10 });
```

## Pages Integration

### Home Page (`src/Pages/Home/home.jsx`)
- Fetches featured products using `getAllProducts()`
- Displays 6 featured products sorted by priority
- Falls back to mock data if API fails
- Includes comprehensive logging

**Key Changes:**
- Added `useEffect` to fetch featured products on mount
- Integrated `getAllProducts` service
- Added error handling and fallback

### Category Pages (`src/Pages/Categories/CategoryPage.jsx`)
- Fetches products by category using `getProductsByCategory()`
- Supports filtering by price, brand, and stock status
- Displays products in grid layout
- Includes pagination support

**Key Changes:**
- Replaced hardcoded search endpoint with `getProductsByCategory`
- Added logging for debugging
- Improved error handling

### Individual Category Pages
All category pages pass the appropriate category query to `CategoryPage`:

- `AccessoriesPage` - "car accessories"
- `BodyChassisPage` - "body chassis suspension brakes"
- `WheelsTiresPage` - "wheels tires rims"
- `EnginePerformancePage` - "engine performance"
- `LightingElectronicsPage` - "lighting electronics"
- `FluidsCarePage` - "fluids car care"
- `AutomotiveToolsPage` - "automotive tools"
- `CoolingACPage` - "cooling ac"

## Debugging Guide

### Console Logs
All API calls and component lifecycle events are logged with timestamps and emojis:

```
[2024-01-15T10:30:45.123Z] [INFO] 🚀 Fetching products for category: wheels tires rims
[2024-01-15T10:30:45.234Z] [DEBUG] 📡 Request URL: http://localhost:3001/api/products/category/wheels%20tires%20rims?limit=100&page=1
[2024-01-15T10:30:45.567Z] [DEBUG] 📊 Response status: 200 OK
[2024-01-15T10:30:45.678Z] [SUCCESS] ✅ Retrieved 15 products for category: wheels tires rims
```

### Common Issues

#### 1. Products Not Loading
**Symptoms:** Empty product list, no console errors

**Debug Steps:**
1. Check browser console for API logs
2. Verify backend is running on `http://localhost:3001`
3. Check network tab for failed requests
4. Verify category query matches backend data

**Solution:**
```javascript
// Add this to see what's being fetched
console.log("Category Query:", categoryQuery);
console.log("API Response:", data);
```

#### 2. Images Not Displaying
**Symptoms:** Placeholder images shown instead of product images

**Debug Steps:**
1. Check if `mainImage.url` exists in API response
2. Verify image URLs are accessible
3. Check browser console for CORS errors

**Solution:**
```javascript
// Verify image URL
console.log("Image URL:", product.mainImage?.url);
// Check if URL is valid
fetch(product.mainImage?.url).then(r => console.log("Image accessible:", r.ok));
```

#### 3. Slow Loading
**Symptoms:** Products take long time to load

**Debug Steps:**
1. Check network tab for slow requests
2. Monitor API response times in console
3. Check if pagination limit is too high

**Solution:**
```javascript
// Reduce limit for faster loading
const data = await getProductsByCategory(category, { limit: 20, page: 1 });
```

#### 4. API Errors
**Symptoms:** Error messages in console, failed requests

**Debug Steps:**
1. Check backend logs
2. Verify API endpoint is correct
3. Check request payload format
4. Verify authentication if required

**Solution:**
```javascript
// Check error details
try {
  const data = await getProductsByCategory(category);
} catch (error) {
  console.error("Full error:", error);
  console.error("Error message:", error.message);
}
```

## Testing the Integration

### 1. Test Home Page
```bash
# Navigate to home page
# Check console for:
# - "🚀 Fetching featured products"
# - "✅ Retrieved X products"
# - Featured products should display
```

### 2. Test Category Pages
```bash
# Navigate to any category page (e.g., /wheels-tires)
# Check console for:
# - "🚀 Fetching products for category: wheels tires rims"
# - "✅ Retrieved X products"
# - Products should display in grid
```

### 3. Test Product Navigation
```bash
# Click on any product
# Check console for:
# - "🔗 Navigating to product: [id] - [name]"
# - Should navigate to product detail page
```

### 4. Test Filtering
```bash
# On category page, adjust filters
# Check console for:
# - Filtered products should update
# - No API calls should be made (client-side filtering)
```

## Environment Setup

### Required Environment Variables
Create `.env` file in project root:

```env
VITE_API_URL=http://localhost:3001/api
```

### Backend Requirements
- Backend running on `http://localhost:3001`
- Firebase configured and initialized
- Products collection populated with test data

## Performance Optimization

### Current Optimizations
1. **Pagination** - Products fetched in pages (default 20 per page)
2. **Lazy Loading** - Images loaded on demand
3. **Memoization** - ProductCard component optimized
4. **Conditional Rendering** - Skeleton loaders while fetching

### Future Optimizations
1. Add image optimization/compression
2. Implement infinite scroll
3. Add caching layer
4. Optimize bundle size

## File Structure
```
src/
├── lib/
│   ├── api.js (legacy - can be deprecated)
│   ├── productService.js (NEW - main service)
│   └── logger.js (NEW - logging utility)
├── hooks/
│   ├── useScrollToTop.js
│   └── useProducts.js (NEW - custom hooks)
├── Components/
│   ├── ProductCard/ (NEW)
│   │   └── ProductCard.jsx
│   └── ... (other components)
└── Pages/
    ├── Home/
    │   └── home.jsx (UPDATED)
    └── Categories/
        ├── CategoryPage.jsx (UPDATED)
        └── ... (individual category pages)
```

## Next Steps

1. **Test all category pages** - Verify products load correctly
2. **Test product detail page** - Ensure product data displays
3. **Test search functionality** - Verify search works with new service
4. **Monitor performance** - Check console logs for slow operations
5. **Add error boundaries** - Implement error handling UI
6. **Add loading states** - Improve UX during data fetching

## Support

For debugging issues:
1. Check browser console for detailed logs
2. Check network tab for API requests
3. Verify backend is running and accessible
4. Check backend logs for server-side errors
5. Verify data format matches expected structure
