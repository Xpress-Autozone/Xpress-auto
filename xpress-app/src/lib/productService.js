const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpress-backend-eeea.onrender.com";

const log = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;
  if (data) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
};

export async function getProductsByCategory(category, options = {}) {
  const {
    limit = 20,
    page = 1,
    sortBy = "createdAt",
    sortOrder = "desc",
    isActive = "true"
  } = options;

  try {
    log("INFO", `🔍 Fetching products for category: ${category}`, {
      limit,
      page,
      sortBy,
      sortOrder
    });

    const params = new URLSearchParams();
    params.append("limit", limit);
    params.append("page", page);
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);
    params.append("isActive", isActive);

    const url = `${API_BASE_URL}/products/category/${encodeURIComponent(category)}?${params}`;
    log("DEBUG", `📡 Request URL: ${url}`);

    const response = await fetch(url);

    log("DEBUG", `📊 Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      log("ERROR", `❌ API Error: ${response.status}`, errorText);
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    log("SUCCESS", `✅ Retrieved ${data.data?.length || 0} products for category: ${category}`, {
      totalItems: data.pagination?.totalItems,
      totalPages: data.pagination?.totalPages
    });

    return data;
  } catch (error) {
    log("ERROR", `❌ Error fetching products by category: ${error.message}`, error);
    throw error;
  }
}

export async function getProductById(productId) {
  try {
    log("INFO", `🔍 Fetching product by ID: ${productId}`);

    const url = `${API_BASE_URL}/products/${productId}`;
    log("DEBUG", `📡 Request URL: ${url}`);

    const response = await fetch(url);

    log("DEBUG", `📊 Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      log("ERROR", `❌ API Error: ${response.status}`, errorText);
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    const data = await response.json();
    log("SUCCESS", `✅ Retrieved product: ${data.data?.itemName}`, {
      id: data.data?.id,
      price: data.data?.price,
      quantity: data.data?.quantity
    });

    return data.data;
  } catch (error) {
    log("ERROR", `❌ Error fetching product by ID: ${error.message}`, error);
    throw error;
  }
}

export async function searchProducts(query, filters = {}, page = 1, pageSize = 20) {
  try {
    log("INFO", `🔍 Searching products with query: "${query}"`, {
      filters,
      page,
      pageSize
    });

    const url = `${API_BASE_URL}/search`;
    const payload = {
      query,
      filters,
      page,
      pageSize
    };

    log("DEBUG", `📡 Request URL: ${url}`, payload);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    log("DEBUG", `📊 Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      log("ERROR", `❌ API Error: ${response.status}`, errorText);
      throw new Error(`Search failed: ${response.status}`);
    }

    const data = await response.json();
    log("SUCCESS", `✅ Search returned ${data.data?.length || 0} results`, {
      totalResults: data.data?.length,
      query
    });

    return data;
  } catch (error) {
    log("ERROR", `❌ Error searching products: ${error.message}`, error);
    throw error;
  }
}

export async function getAllProducts(options = {}) {
  const {
    limit = 20,
    page = 1,
    sortBy = "createdAt",
    sortOrder = "desc",
    displayOnPage = true,
    isActive = null,
    vendorId = null,
    category = null
  } = options;

  try {
    log("INFO", `🔍 Fetching all products`, {
      limit,
      page,
      sortBy,
      sortOrder,
      displayOnPage,
      isActive
    });

    const params = new URLSearchParams();
    params.append("limit", limit);
    params.append("page", page);
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);
    // params.append("displayOnPage", displayOnPage);
    // params.append("isActive", isActive);
    if (options.vendorId) params.append("vendorId", options.vendorId);
    if (options.category) params.append("category", options.category);

    const url = `${API_BASE_URL}/products?${params}`;
    log("DEBUG", `📡 Request URL: ${url}`);

    const response = await fetch(url);

    log("DEBUG", `📊 Response status FOR GETTING AL PRODUCTS: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      log("ERROR", `❌ API Error: ${response.status}`, errorText);
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    console.log( "this is the data recieved from the backend",data);
    
    log("SUCCESS", `✅ Retrieved ${data.data?.length || 0} products`, {
      totalItems: data.pagination?.totalItems,
      totalPages: data.pagination?.totalPages
    });

    return data;
  } catch (error) {
    log("ERROR", `❌ Error fetching all products: ${error.message}`, error);
    throw error;
  }
}
