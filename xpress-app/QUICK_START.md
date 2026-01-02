# Quick Start Guide - Backend Integration

## Prerequisites
- Backend running on `http://localhost:3001`
- Frontend running on `http://localhost:5173`
- Browser DevTools open (F12)

## 5-Minute Setup

### 1. Verify Backend is Running
```bash
# In backend directory
npm start
# Should see: Server running on port 3001
```

### 2. Verify Frontend is Running
```bash
# In frontend directory
npm run dev
# Should see: Local: http://localhost:5173
```

### 3. Check Console Logs
```javascript
// Open browser console (F12)
// Navigate to home page
// Should see logs like:
// [timestamp] [INFO] 🚀 Fetching featured products
// [timestamp] [SUCCESS] ✅ Retrieved X products
```

### 4. Test Home Page
```
1. Navigate to http://localhost:5173
2. Check console for featured products logs
3. Verify products display in grid
4. Click on a product to navigate to detail page
```

### 5. Test Category Pages
```
1. Click on any category (e.g., Wheels & Tires)
2. Check console for category products logs
3. Verify products display in grid
4. Try adjusting filters (price, brand, stock)
5. Click on a product to navigate to detail page
```

## Common Commands

### View Console Logs
```javascript
// Open browser console (F12)
// Filter by "INFO" to see main operations
// Filter by "ERROR" to see issues
```

### Test API Directly
```javascript
// In browser console
fetch('http://localhost:3001/api/products?limit=5')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Check Product Data
```javascript
// In browser console (after products load)
console.table(products.slice(0, 3))
```

### Monitor Network Requests
```
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Look for requests to /api/products
5. Check status and response
```

## Troubleshooting

### Products Not Loading?
```javascript
// Check console for errors
// Look for ❌ ERROR messages
// Verify backend is running
// Check Network tab for failed requests
```

### Images Not Showing?
```javascript
// Check if mainImage.url exists
// Verify image URL is accessible
// Look for CORS errors in console
```

### Slow Loading?
```javascript
// Check Network tab for slow requests
// Look for performance logs in console
// Try reducing pagination limit
```

### API Errors?
```javascript
// Check backend console for errors
// Verify endpoint URL is correct
// Check request format in Network tab
```

## File Locations

### Services
- `src/lib/productService.js` - API calls with logging

### Hooks
- `src/hooks/useProducts.js` - React hooks for fetching

### Components
- `src/Components/ProductCard/ProductCard.jsx` - Product card component

### Pages
- `src/Pages/Home/home.jsx` - Home page (UPDATED)
- `src/Pages/Categories/CategoryPage.jsx` - Category page (UPDATED)

### Documentation
- `INTEGRATION_GUIDE.md` - Detailed documentation
- `DEBUGGING_CHECKLIST.md` - Debugging guide
- `INTEGRATION_SUMMARY.md` - Summary of changes

## Key Features

### Logging
Every API call is logged with:
- Timestamp
- Operation type (INFO, DEBUG, SUCCESS, ERROR)
- Emoji indicator
- Relevant data

### Error Handling
- Try-catch blocks on all API calls
- Fallback to mock data if API fails
- Detailed error messages in console

### Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interactions

### Performance
- Pagination support
- Lazy image loading
- Optimized re-renders

## Testing Scenarios

### Scenario 1: Load Home Page
```
1. Navigate to http://localhost:5173
2. Check console for "🚀 Fetching featured products"
3. Verify 6 products display
4. Check console for "✅ Retrieved X products"
```

### Scenario 2: Browse Category
```
1. Click on "Wheels & Tires" category
2. Check console for category query
3. Verify products load
4. Try adjusting price filter
5. Verify products update
```

### Scenario 3: View Product Details
```
1. Click on any product
2. Check console for navigation log
3. Verify product detail page loads
4. Check if all product info displays
```

### Scenario 4: Test Filters
```
1. On category page, adjust price slider
2. Verify products update (client-side)
3. Check/uncheck brand filters
4. Verify products update
5. Check "In Stock Only" checkbox
6. Verify only in-stock products show
```

## Performance Targets

- Home page load: < 2 seconds
- Category page load: < 2 seconds
- Product detail load: < 1 second
- Filter response: < 100ms (client-side)
- Image load: < 500ms per image

## Success Indicators

✅ All of these should be true:
- [ ] Console shows no errors
- [ ] Products load within 2 seconds
- [ ] Images display correctly
- [ ] Filters work smoothly
- [ ] Navigation works
- [ ] No CORS errors
- [ ] API responses are 200 status
- [ ] Performance logs show reasonable times

## Next Steps

1. **Test all pages** - Verify everything works
2. **Monitor console** - Check for any errors
3. **Check performance** - Look for slow operations
4. **Review logs** - Understand the data flow
5. **Explore code** - Understand the implementation

## Getting Help

### Check Documentation
- `INTEGRATION_GUIDE.md` - Detailed docs
- `DEBUGGING_CHECKLIST.md` - Troubleshooting

### Check Console Logs
- Look for error messages
- Check timestamps
- Review data being logged

### Check Network Tab
- Verify API requests
- Check response status
- Review response payload

### Check Backend Logs
- Look for server errors
- Verify database queries
- Check data being returned

## Quick Reference

### API Endpoints
- `GET /products` - All products
- `GET /products/:id` - Single product
- `GET /products/category/:category` - Category products
- `POST /search` - Search products

### Service Functions
- `getProductsByCategory(category, options)`
- `getProductById(productId)`
- `searchProducts(query, filters, page, pageSize)`
- `getAllProducts(options)`

### React Hooks
- `useProductsByCategory(category, options)`
- `useAllProducts(options)`
- `useProduct(productId)`

### Components
- `ProductCard` - Product display component

## Tips & Tricks

### Tip 1: Use Console Logs
```javascript
// All operations are logged
// Check console for detailed information
// Use filter to find specific logs
```

### Tip 2: Monitor Network
```javascript
// Open Network tab
// Filter by "api"
// Watch requests in real-time
```

### Tip 3: Use React DevTools
```javascript
// Install React DevTools extension
// Inspect component state
// Check props and hooks
```

### Tip 4: Test API Directly
```javascript
// Use browser console
// Test endpoints directly
// Verify data format
```

### Tip 5: Check Performance
```javascript
// Use DevTools Performance tab
// Record interactions
// Identify bottlenecks
```

## Common Patterns

### Fetching Products
```javascript
import { getProductsByCategory } from "@/lib/productService";

const data = await getProductsByCategory("wheels tires rims", {
  limit: 20,
  page: 1
});
```

### Using Hooks
```javascript
import { useProductsByCategory } from "@/hooks/useProducts";

const { products, loading, error } = useProductsByCategory("wheels tires rims");
```

### Rendering Products
```javascript
import ProductCard from "@/Components/ProductCard/ProductCard";

{products.map(product => (
  <ProductCard key={product.id} product={product} variant="default" />
))}
```

## Debugging Flow

1. **Check Console** - Look for error messages
2. **Check Network** - Verify API requests
3. **Check Backend** - Look for server errors
4. **Check Data** - Verify data format
5. **Check Component** - Use React DevTools
6. **Check Performance** - Use Performance tab

## Resources

- Backend API: `http://localhost:3001/api`
- Frontend: `http://localhost:5173`
- Documentation: `INTEGRATION_GUIDE.md`
- Debugging: `DEBUGGING_CHECKLIST.md`
- Summary: `INTEGRATION_SUMMARY.md`

## Support

For issues:
1. Check console logs
2. Check network tab
3. Check backend logs
4. Review documentation
5. Check debugging checklist

---

**Ready to go!** 🚀

Start by navigating to the home page and checking the console logs.
