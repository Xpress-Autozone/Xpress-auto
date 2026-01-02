# API Reference Guide - Aligned with Swagger

## Base URL
```
http://localhost:3001/api
```

## Query Parameters (Swagger Spec)

### Common Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 20 | Number of items per page |
| `page` | integer | 1 | Page number |
| `sortBy` | string | createdAt | Field to sort by |
| `sortOrder` | string | desc | Sort order (asc, desc) |
| `isActive` | boolean | true | Filter by active status |
| `displayOnPage` | boolean | true | Filter by display status |

### Optional Filters
| Parameter | Type | Description |
|-----------|------|-------------|
| `vendorId` | string | Filter by vendor ID |
| `category` | string | Filter by category |

## Endpoints

### 1. Get All Products
```
GET /products
```

**Query Parameters:**
- `limit` (default: 20)
- `page` (default: 1)
- `sortBy` (default: createdAt)
- `sortOrder` (default: desc)
- `displayOnPage` (default: true)
- `isActive` (default: true)
- `vendorId` (optional)
- `category` (optional)

**Example:**
```javascript
// Fetch all products
const data = await getAllProducts({
  limit: 20,
  page: 1,
  sortBy: "createdAt",
  sortOrder: "desc",
  displayOnPage: true,
  isActive: true
});

// Fetch with vendor filter
const data = await getAllProducts({
  limit: 20,
  vendorId: "vendor123"
});

// Fetch with category filter
const data = await getAllProducts({
  limit: 20,
  category: "wheels tires rims"
});
```

**Response:**
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

---

### 2. Get Products by Category
```
GET /products/category/:category
```

**Path Parameters:**
- `category` (required) - Category name

**Query Parameters:**
- `limit` (default: 20)
- `page` (default: 1)
- `sortBy` (default: createdAt)
- `sortOrder` (default: desc)
- `isActive` (default: true)

**Example:**
```javascript
// Fetch category products
const data = await getProductsByCategory("wheels tires rims", {
  limit: 20,
  page: 1,
  sortBy: "createdAt",
  sortOrder: "desc"
});

// Fetch with custom sorting
const data = await getProductsByCategory("wheels tires rims", {
  limit: 50,
  sortBy: "price",
  sortOrder: "asc"
});
```

**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully for category: wheels tires rims",
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "limit": 20,
    "totalItems": 50,
    "totalPages": 3
  }
}
```

---

### 3. Get Single Product
```
GET /products/:id
```

**Path Parameters:**
- `id` (required) - Product ID

**Example:**
```javascript
// Fetch single product
const product = await getProductById("product-id");
```

**Response:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
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
}
```

---

### 4. Search Products
```
POST /search
```

**Request Body:**
```json
{
  "query": "search term",
  "filters": {},
  "page": 1,
  "pageSize": 20
}
```

**Example:**
```javascript
// Search products
const data = await searchProducts("wheels", {}, 1, 20);

// Search with filters
const data = await searchProducts("tires", { brand: "Michelin" }, 1, 20);
```

**Response:**
```json
{
  "success": true,
  "message": "Search results",
  "data": [...]
}
```

---

## Service Functions

### getAllProducts(options)
Fetch all products with optional filters.

**Parameters:**
```javascript
{
  limit: 20,              // Items per page
  page: 1,                // Page number
  sortBy: "createdAt",    // Sort field
  sortOrder: "desc",      // Sort direction
  displayOnPage: true,    // Show on page
  isActive: true,         // Active status
  vendorId: null,         // Optional vendor filter
  category: null          // Optional category filter
}
```

**Returns:** Promise with response object

---

### getProductsByCategory(category, options)
Fetch products by category.

**Parameters:**
- `category` (string) - Category name
- `options` (object) - Query options

**Options:**
```javascript
{
  limit: 20,
  page: 1,
  sortBy: "createdAt",
  sortOrder: "desc",
  isActive: true
}
```

**Returns:** Promise with response object

---

### getProductById(productId)
Fetch single product by ID.

**Parameters:**
- `productId` (string) - Product ID

**Returns:** Promise with product object

---

### searchProducts(query, filters, page, pageSize)
Search products.

**Parameters:**
- `query` (string) - Search query
- `filters` (object) - Search filters
- `page` (number) - Page number
- `pageSize` (number) - Items per page

**Returns:** Promise with response object

---

## Usage Examples

### Example 1: Fetch Featured Products
```javascript
import { getAllProducts } from "@/lib/productService";

const data = await getAllProducts({
  limit: 6,
  page: 1,
  sortBy: "priority",
  sortOrder: "desc",
  displayOnPage: true,
  isActive: true
});

const products = data.data.map(p => ({
  id: p.id,
  name: p.itemName,
  price: p.price,
  image: p.mainImage?.url,
  status: p.quantity > 0 ? "In Stock" : "Out of Stock"
}));
```

### Example 2: Fetch Category Products
```javascript
import { getProductsByCategory } from "@/lib/productService";

const data = await getProductsByCategory("wheels tires rims", {
  limit: 20,
  page: 1,
  sortBy: "createdAt",
  sortOrder: "desc"
});

const products = data.data.map(p => ({
  id: p.id,
  name: p.itemName,
  price: p.price,
  image: p.mainImage?.url,
  status: p.quantity > 0 ? "In Stock" : "Out of Stock"
}));
```

### Example 3: Fetch Single Product
```javascript
import { getProductById } from "@/lib/productService";

const product = await getProductById("product-id");

console.log({
  name: product.itemName,
  price: product.price,
  description: product.description,
  images: [product.mainImage, ...product.additionalImages],
  quantity: product.quantity
});
```

### Example 4: Search Products
```javascript
import { searchProducts } from "@/lib/productService";

const data = await searchProducts("michelin tires", {}, 1, 20);

const results = data.data.map(p => ({
  id: p.id,
  name: p.itemName,
  price: p.price,
  image: p.mainImage?.url
}));
```

---

## Error Handling

All functions throw errors on failure. Handle with try-catch:

```javascript
try {
  const data = await getProductsByCategory("wheels tires rims");
  // Process data
} catch (error) {
  console.error("Error:", error.message);
  // Show error to user
}
```

---

## Logging

All API calls are logged to console:

```
[2024-01-15T10:30:45.123Z] [INFO] 🔍 Fetching products for category: wheels tires rims
[2024-01-15T10:30:45.234Z] [DEBUG] 📡 Request URL: http://localhost:3001/api/products/category/wheels%20tires%20rims?limit=20&page=1&sortBy=createdAt&sortOrder=desc&isActive=true
[2024-01-15T10:30:45.567Z] [DEBUG] 📊 Response status: 200 OK
[2024-01-15T10:30:45.678Z] [SUCCESS] ✅ Retrieved 15 products for category: wheels tires rims
```

---

## Pagination

All endpoints support pagination:

```javascript
// Get page 2 with 50 items per page
const data = await getAllProducts({
  limit: 50,
  page: 2
});

// Access pagination info
console.log(data.pagination);
// {
//   currentPage: 2,
//   limit: 50,
//   totalItems: 500,
//   totalPages: 10
// }
```

---

## Sorting

All endpoints support sorting:

```javascript
// Sort by price ascending
const data = await getProductsByCategory("wheels tires rims", {
  sortBy: "price",
  sortOrder: "asc"
});

// Sort by priority descending
const data = await getAllProducts({
  sortBy: "priority",
  sortOrder: "desc"
});
```

---

## Filtering

### By Category
```javascript
const data = await getAllProducts({
  category: "wheels tires rims"
});
```

### By Vendor
```javascript
const data = await getAllProducts({
  vendorId: "vendor-id"
});
```

### By Display Status
```javascript
const data = await getAllProducts({
  displayOnPage: true
});
```

### By Active Status
```javascript
const data = await getAllProducts({
  isActive: true
});
```

---

## Response Schema

### Product Object
```javascript
{
  id: string,                    // Product ID
  itemName: string,              // Product name
  price: number,                 // Price
  quantity: number,              // Available quantity
  category: string,              // Category
  mainImage: {
    url: string,                 // Image URL
    filePath: string             // File path
  },
  additionalImages: [            // Additional images
    {
      url: string,
      filePath: string
    }
  ],
  description: string,           // Description
  condition: string,             // new, used, refurbished
  isActive: boolean,             // Active status
  displayOnPage: boolean,        // Display on page
  createdAt: string,             // Creation timestamp
  updatedAt: string              // Update timestamp
}
```

### Pagination Object
```javascript
{
  currentPage: number,           // Current page
  limit: number,                 // Items per page
  totalItems: number,            // Total items
  totalPages: number             // Total pages
}
```

---

## Best Practices

1. **Always handle errors** - Use try-catch blocks
2. **Check pagination** - Use pagination info for UI
3. **Monitor logs** - Check console for debugging
4. **Use appropriate limits** - Balance performance and data
5. **Cache when possible** - Reduce API calls
6. **Validate data** - Check for null/undefined values

---

## Troubleshooting

### Products Not Loading
- Check console logs for errors
- Verify API URL is correct
- Check backend is running
- Verify category name matches backend

### Images Not Showing
- Check if mainImage.url exists
- Verify URL is accessible
- Check for CORS errors

### Slow Performance
- Reduce limit parameter
- Check Network tab for slow requests
- Consider caching

### API Errors
- Check backend logs
- Verify request format
- Check query parameters
- Verify authentication if needed

---

**Last Updated:** December 22, 2025
**Version:** 1.0
**Status:** ✅ Complete
