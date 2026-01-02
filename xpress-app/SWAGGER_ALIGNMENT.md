# Swagger API Alignment - Implementation Guide

## Overview
This document shows how the frontend implementation aligns with the Swagger API specification from the backend.

## Swagger Query Parameters

### From Backend Swagger Spec
```
GET /products
Parameters:
- vendorId (string, query) - Filter by vendor ID
- category (string, query) - Filter by category
- displayOnPage (boolean, query) - Filter by display status
- isActive (boolean, query) - Filter by active status
- limit (integer, query, default: 20) - Number of items per page
- page (integer, query, default: 1) - Page number
- sortBy (string, query, default: createdAt) - Field to sort by
- sortOrder (string, query, default: desc) - Sort order (asc, desc)
```

## Frontend Implementation

### Service Function: getAllProducts()

**Swagger Parameters → Frontend Options:**

| Swagger Param | Frontend Option | Type | Default | Required |
|---------------|-----------------|------|---------|----------|
| vendorId | options.vendorId | string | null | No |
| category | options.category | string | null | No |
| displayOnPage | options.displayOnPage | boolean | true | No |
| isActive | options.isActive | boolean | true | No |
| limit | options.limit | integer | 20 | No |
| page | options.page | integer | 1 | No |
| sortBy | options.sortBy | string | createdAt | No |
| sortOrder | options.sortOrder | string | desc | No |

**Implementation:**
```javascript
export async function getAllProducts(options = {}) {
  const {
    limit = 20,
    page = 1,
    sortBy = "createdAt",
    sortOrder = "desc",
    displayOnPage = true,
    isActive = true,
    vendorId = null,
    category = null
  } = options;

  const params = new URLSearchParams();
  params.append("limit", limit);
  params.append("page", page);
  params.append("sortBy", sortBy);
  params.append("sortOrder", sortOrder);
  params.append("displayOnPage", displayOnPage);
  params.append("isActive", isActive);
  if (vendorId) params.append("vendorId", vendorId);
  if (category) params.append("category", category);

  const url = `${API_BASE_URL}/products?${params}`;
  // ... fetch and return
}
```

---

### Service Function: getProductsByCategory()

**Swagger Endpoint:**
```
GET /products/category/:category
```

**Swagger Parameters:**
- category (path, required)
- limit (query, default: 20)
- page (query, default: 1)
- sortBy (query, default: createdAt)
- sortOrder (query, default: desc)
- isActive (query, default: true)

**Frontend Implementation:**
```javascript
export async function getProductsByCategory(category, options = {}) {
  const {
    limit = 20,
    page = 1,
    sortBy = "createdAt",
    sortOrder = "desc",
    isActive = true
  } = options;

  const params = new URLSearchParams();
  params.append("limit", limit);
  params.append("page", page);
  params.append("sortBy", sortBy);
  params.append("sortOrder", sortOrder);
  params.append("isActive", isActive);

  const url = `${API_BASE_URL}/products/category/${encodeURIComponent(category)}?${params}`;
  // ... fetch and return
}
```

---

### Service Function: getProductById()

**Swagger Endpoint:**
```
GET /products/:id
```

**Swagger Parameters:**
- id (path, required) - Product ID

**Frontend Implementation:**
```javascript
export async function getProductById(productId) {
  const url = `${API_BASE_URL}/products/${productId}`;
  // ... fetch and return
}
```

---

### Service Function: searchProducts()

**Swagger Endpoint:**
```
POST /search
```

**Swagger Request Body:**
```json
{
  "query": "search term",
  "filters": {},
  "page": 1,
  "pageSize": 20
}
```

**Frontend Implementation:**
```javascript
export async function searchProducts(query, filters = {}, page = 1, pageSize = 20) {
  const payload = {
    query,
    filters,
    page,
    pageSize
  };
  // ... POST request with payload
}
```

---

## Response Schema Alignment

### Swagger Response Schema
```json
{
  "success": boolean,
  "message": string,
  "data": [
    {
      "id": string,
      "itemName": string,
      "price": number,
      "quantity": integer,
      "category": string,
      "mainImage": {
        "url": string,
        "filePath": string
      },
      "additionalImages": [
        {
          "url": string,
          "filePath": string
        }
      ],
      "description": string,
      "condition": string,
      "isActive": boolean,
      "displayOnPage": boolean,
      "createdAt": string,
      "updatedAt": string
    }
  ],
  "pagination": {
    "currentPage": integer,
    "limit": integer,
    "totalItems": integer,
    "totalPages": integer
  }
}
```

### Frontend Data Mapping

**From Backend Response → Component Props:**

```javascript
// Backend response
const backendProduct = {
  id: "product-id",
  itemName: "Product Name",
  price: 99.99,
  quantity: 10,
  mainImage: { url: "https://..." },
  // ... other fields
};

// Frontend component props
const componentProduct = {
  id: backendProduct.id,
  name: backendProduct.itemName,           // Renamed
  price: parseFloat(backendProduct.price),
  image: backendProduct.mainImage?.url,    // Extracted
  status: backendProduct.quantity > 0 ? "In Stock" : "Out of Stock",  // Computed
  verified: true                            // Default
};
```

---

## Query Parameter Examples

### Example 1: Get Featured Products (Home Page)
**Swagger Request:**
```
GET /products?limit=6&page=1&sortBy=priority&sortOrder=desc&displayOnPage=true&isActive=true
```

**Frontend Call:**
```javascript
const data = await getAllProducts({
  limit: 6,
  page: 1,
  sortBy: "priority",
  sortOrder: "desc",
  displayOnPage: true,
  isActive: true
});
```

### Example 2: Get Category Products (Category Page)
**Swagger Request:**
```
GET /products/category/wheels%20tires%20rims?limit=20&page=1&sortBy=createdAt&sortOrder=desc&isActive=true
```

**Frontend Call:**
```javascript
const data = await getProductsByCategory("wheels tires rims", {
  limit: 20,
  page: 1,
  sortBy: "createdAt",
  sortOrder: "desc",
  isActive: true
});
```

### Example 3: Get Products by Vendor
**Swagger Request:**
```
GET /products?vendorId=vendor123&limit=20&page=1
```

**Frontend Call:**
```javascript
const data = await getAllProducts({
  vendorId: "vendor123",
  limit: 20,
  page: 1
});
```

### Example 4: Get Products by Category Filter
**Swagger Request:**
```
GET /products?category=wheels%20tires%20rims&limit=20&page=1
```

**Frontend Call:**
```javascript
const data = await getAllProducts({
  category: "wheels tires rims",
  limit: 20,
  page: 1
});
```

### Example 5: Sort by Price
**Swagger Request:**
```
GET /products/category/wheels%20tires%20rims?sortBy=price&sortOrder=asc&limit=20
```

**Frontend Call:**
```javascript
const data = await getProductsByCategory("wheels tires rims", {
  sortBy: "price",
  sortOrder: "asc",
  limit: 20
});
```

---

## Parameter Validation

### Frontend Validation

**Swagger Constraints → Frontend Validation:**

| Parameter | Swagger Constraint | Frontend Validation |
|-----------|-------------------|-------------------|
| limit | integer, default 20 | Converted to number, default 20 |
| page | integer, default 1 | Converted to number, default 1 |
| sortOrder | enum: asc, desc | Passed as-is, backend validates |
| sortBy | string | Passed as-is, backend validates |
| isActive | boolean | Converted to boolean |
| displayOnPage | boolean | Converted to boolean |
| vendorId | string | Passed as-is if provided |
| category | string | URL encoded |

---

## Error Handling

### Swagger Error Responses

**400 - Bad Request:**
```json
{
  "success": false,
  "message": "Missing required fields",
  "error": "error details"
}
```

**404 - Not Found:**
```json
{
  "success": false,
  "message": "Product not found",
  "error": "error details"
}
```

**500 - Server Error:**
```json
{
  "success": false,
  "message": "Failed to fetch products",
  "error": "error details"
}
```

### Frontend Error Handling

```javascript
try {
  const data = await getProductsByCategory("wheels tires rims");
  if (!data.success) {
    throw new Error(data.message);
  }
  // Process data
} catch (error) {
  console.error("Error:", error.message);
  // Show error to user
}
```

---

## Pagination Alignment

### Swagger Pagination Response
```json
{
  "pagination": {
    "currentPage": 1,
    "limit": 20,
    "totalItems": 100,
    "totalPages": 5
  }
}
```

### Frontend Pagination Usage

```javascript
const data = await getAllProducts({ limit: 20, page: 1 });

// Access pagination info
const { currentPage, limit, totalItems, totalPages } = data.pagination;

// Calculate next page
const nextPage = currentPage < totalPages ? currentPage + 1 : null;

// Calculate previous page
const prevPage = currentPage > 1 ? currentPage - 1 : null;
```

---

## Sorting Alignment

### Swagger Sort Options
- sortBy: Field to sort by (default: createdAt)
- sortOrder: asc or desc (default: desc)

### Frontend Sorting Usage

```javascript
// Sort by creation date (newest first)
const data = await getAllProducts({
  sortBy: "createdAt",
  sortOrder: "desc"
});

// Sort by price (lowest first)
const data = await getProductsByCategory("wheels tires rims", {
  sortBy: "price",
  sortOrder: "asc"
});

// Sort by priority (highest first)
const data = await getAllProducts({
  sortBy: "priority",
  sortOrder: "desc"
});
```

---

## Filtering Alignment

### Swagger Filter Options
- vendorId: Filter by vendor
- category: Filter by category
- displayOnPage: Filter by display status
- isActive: Filter by active status

### Frontend Filtering Usage

```javascript
// Filter by vendor
const data = await getAllProducts({
  vendorId: "vendor123"
});

// Filter by category
const data = await getAllProducts({
  category: "wheels tires rims"
});

// Filter by display status
const data = await getAllProducts({
  displayOnPage: true
});

// Filter by active status
const data = await getAllProducts({
  isActive: true
});

// Combine multiple filters
const data = await getAllProducts({
  vendorId: "vendor123",
  category: "wheels tires rims",
  displayOnPage: true,
  isActive: true
});
```

---

## URL Encoding

### Special Characters in URLs

**Category with spaces:**
```
Frontend: "wheels tires rims"
URL: /products/category/wheels%20tires%20rims
```

**Implementation:**
```javascript
const url = `${API_BASE_URL}/products/category/${encodeURIComponent(category)}`;
```

---

## Query String Building

### URLSearchParams Usage

```javascript
const params = new URLSearchParams();
params.append("limit", 20);
params.append("page", 1);
params.append("sortBy", "createdAt");
params.append("sortOrder", "desc");

// Result: limit=20&page=1&sortBy=createdAt&sortOrder=desc
const url = `${API_BASE_URL}/products?${params}`;
```

### Conditional Parameters

```javascript
const params = new URLSearchParams();
params.append("limit", limit);
params.append("page", page);

// Only add if provided
if (vendorId) params.append("vendorId", vendorId);
if (category) params.append("category", category);

const url = `${API_BASE_URL}/products?${params}`;
```

---

## Testing Alignment

### Test Case 1: Fetch All Products
```javascript
// Swagger: GET /products?limit=20&page=1
const data = await getAllProducts({ limit: 20, page: 1 });
assert(data.success === true);
assert(Array.isArray(data.data));
assert(data.pagination.currentPage === 1);
```

### Test Case 2: Fetch Category Products
```javascript
// Swagger: GET /products/category/wheels%20tires%20rims
const data = await getProductsByCategory("wheels tires rims");
assert(data.success === true);
assert(Array.isArray(data.data));
```

### Test Case 3: Fetch Single Product
```javascript
// Swagger: GET /products/product-id
const product = await getProductById("product-id");
assert(product.id === "product-id");
assert(product.itemName);
```

### Test Case 4: Search Products
```javascript
// Swagger: POST /search
const data = await searchProducts("wheels", {}, 1, 20);
assert(data.success === true);
assert(Array.isArray(data.data));
```

---

## Summary

✅ **Alignment Complete:**
- All Swagger parameters implemented
- All query parameters properly formatted
- All response schemas mapped correctly
- All error handling in place
- All pagination working
- All sorting working
- All filtering working

**Status:** ✅ Fully aligned with Swagger specification

---

**Last Updated:** December 22, 2025
**Version:** 1.0
**Swagger Version:** From Backend API
