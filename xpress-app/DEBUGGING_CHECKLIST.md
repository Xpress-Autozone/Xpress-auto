# Debugging Checklist

## Before Starting
- [ ] Backend running on `http://localhost:3001`
- [ ] Frontend running on `http://localhost:5173` (or configured port)
- [ ] Browser console open (F12)
- [ ] Network tab visible for API monitoring

## API Integration Checklist

### Products Not Loading
- [ ] Check console for `🚀 Fetching products` log
- [ ] Verify API response status is 200 in Network tab
- [ ] Check if `data.success === true` in response
- [ ] Verify `data.data` array is not empty
- [ ] Check if category query matches backend data

**Quick Fix:**
```javascript
// Add to component to debug
console.log("API Response:", data);
console.log("Products Count:", data.data?.length);
```

### Images Not Showing
- [ ] Check if `mainImage.url` exists in product object
- [ ] Verify URL is not empty or null
- [ ] Check Network tab for image requests
- [ ] Look for CORS errors in console
- [ ] Verify image URL is accessible

**Quick Fix:**
```javascript
// Log image URLs
products.forEach(p => {
  console.log(`${p.itemName}: ${p.mainImage?.url}`);
});
```

### Slow Performance
- [ ] Check Network tab for slow API requests
- [ ] Monitor console for performance logs
- [ ] Reduce pagination limit (try limit: 10)
- [ ] Check if images are being optimized
- [ ] Look for unnecessary re-renders

**Quick Fix:**
```javascript
// Reduce data fetched
const data = await getProductsByCategory(category, { limit: 10 });
```

### API Errors (4xx, 5xx)
- [ ] Check backend console for errors
- [ ] Verify endpoint URL is correct
- [ ] Check request payload format
- [ ] Verify category name matches backend
- [ ] Check backend logs for detailed error

**Quick Fix:**
```javascript
// Log full error details
catch (error) {
  console.error("Error:", error);
  console.error("Status:", error.status);
  console.error("Message:", error.message);
}
```

### CORS Errors
- [ ] Verify backend has CORS enabled
- [ ] Check if API URL is correct
- [ ] Verify request headers are correct
- [ ] Check backend CORS configuration

**Quick Fix:**
```javascript
// Verify API URL
console.log("API Base URL:", import.meta.env.VITE_API_URL);
```

## Component Integration Checklist

### Home Page
- [ ] Featured products load on mount
- [ ] Console shows `🚀 Fetching featured products`
- [ ] Products display in grid
- [ ] Clicking product navigates to detail page
- [ ] Fallback to mock data if API fails

### Category Pages
- [ ] Category products load
- [ ] Console shows category query being used
- [ ] Filters work (price, brand, stock)
- [ ] Products update when filters change
- [ ] Pagination works if implemented

### Product Card
- [ ] Product name displays correctly
- [ ] Price displays with GH₵ symbol
- [ ] Stock status shows correct color
- [ ] Image displays or shows placeholder
- [ ] Clicking navigates to product detail

## Logging Verification

### Expected Console Logs
```
✅ Should see these logs:
[timestamp] [INFO] 🚀 Fetching products for category: ...
[timestamp] [DEBUG] 📡 Request URL: ...
[timestamp] [DEBUG] 📊 Response status: 200 OK
[timestamp] [SUCCESS] ✅ Retrieved X products

❌ Should NOT see these logs:
[timestamp] [ERROR] ❌ Error fetching products
[timestamp] [ERROR] ❌ API Error: 404
```

### Enable Verbose Logging
```javascript
// Add to productService.js for more details
console.log("Full Response:", data);
console.log("Product Count:", data.data?.length);
console.log("Pagination:", data.pagination);
```

## Network Tab Checklist

### API Requests
- [ ] Request method is GET or POST (as expected)
- [ ] Status code is 200 (success)
- [ ] Response time is < 1000ms (acceptable)
- [ ] Response size is reasonable
- [ ] Headers include Content-Type: application/json

### Image Requests
- [ ] Status code is 200
- [ ] Content-Type is image/*
- [ ] Size is reasonable (< 500KB)
- [ ] No CORS errors

## Quick Debugging Commands

### Check API Connectivity
```javascript
// In browser console
fetch('http://localhost:3001/api/products?limit=5')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

### Check Product Data Structure
```javascript
// In browser console
// After products load, run:
console.table(products.slice(0, 3))
```

### Monitor API Calls
```javascript
// Add to productService.js
console.log("🔍 API Call:", {
  url,
  method,
  payload,
  timestamp: new Date().toISOString()
});
```

### Check Component State
```javascript
// In React DevTools
// Select component and check:
// - products state
// - loading state
// - error state
// - pagination state
```

## Common Error Messages

### "Failed to fetch products: 404"
- Backend endpoint not found
- Category name doesn't match
- API URL is incorrect

### "Failed to fetch products: 500"
- Backend error
- Check backend logs
- Verify database connection

### "Cannot read property 'url' of undefined"
- mainImage is null/undefined
- Product data structure mismatch
- API response format changed

### "CORS error"
- Backend CORS not configured
- API URL is incorrect
- Request headers issue

## Performance Monitoring

### Check Load Time
```javascript
// Add to component
const startTime = performance.now();
// ... fetch data ...
const endTime = performance.now();
console.log(`Load time: ${endTime - startTime}ms`);
```

### Monitor Memory Usage
```javascript
// In browser console
console.memory
```

### Check Render Performance
```javascript
// In React DevTools Profiler
// Record interactions and check:
// - Component render time
// - Unnecessary re-renders
// - Performance bottlenecks
```

## Reset & Restart

### Clear Cache
```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Restart Backend
```bash
# In backend directory
npm start
# or
node index.js
```

### Restart Frontend
```bash
# In frontend directory
npm run dev
```

## Success Indicators

✅ All of these should be true:
- [ ] Console shows no errors
- [ ] Products load within 1 second
- [ ] Images display correctly
- [ ] Filters work smoothly
- [ ] Navigation works
- [ ] No CORS errors
- [ ] API responses are 200 status
- [ ] Data structure matches expected format
- [ ] Performance logs show reasonable times
- [ ] No memory leaks in DevTools

## Still Having Issues?

1. **Check backend logs** - Most issues are backend-related
2. **Verify data format** - Log API response and compare with expected
3. **Test API directly** - Use Postman or curl to test endpoints
4. **Check network connectivity** - Verify backend is accessible
5. **Review error messages** - Read full error details in console
6. **Check browser console** - Look for all error messages
7. **Verify environment variables** - Check VITE_API_URL is set
8. **Clear browser cache** - Sometimes old data causes issues
9. **Check backend database** - Verify products exist in database
10. **Review recent changes** - Check what was changed recently
