const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://xpress-backend-eeea.onrender.com";

let searchController = null;

export async function searchProducts(
  query,
  filters = {},
  page = 1,
  pageSize = 20
) {
  if (searchController) {
    searchController.abort();
  }

  searchController = new AbortController();

  try {
    console.log("🔍 Making search request to:", `${API_BASE_URL}/search`, {
      query,
      filters,
      page,
      pageSize,
    });

    const response = await fetch(`${API_BASE_URL}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        filters,
        page,
        pageSize,
      }),
      signal: searchController.signal,
    });

    console.log(
      "📡 Search response status:",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Search error response:", errorText);
      throw new Error(`Search failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Search data received:", data);
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("⚠️ Search request was aborted");
      return null;
    }
    console.error("❌ Search error caught:", error.message, error);
    throw error;
  }
}

export async function getSuggestions(query) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search/suggest?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`Suggestions failed: ${response.status}`);
    }

    const data = await response.json();
    return data.suggestions || [];
  } catch (error) {
    console.error("Failed to get suggestions:", error);
    return [];
  }
}

export async function getProductById(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);

    if (!response.ok) {
      throw new Error(`Product fetch failed: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Failed to get product:", error);
    throw error;
  }
}
