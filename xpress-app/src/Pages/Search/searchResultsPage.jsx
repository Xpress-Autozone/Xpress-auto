import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchProducts } from "../../lib/api";
import SearchBar from "../../Components/Search/searchBar";
import SkeletonLoader from "../../Components/SkeletonLoader/skeletonLoader";
import { ChevronDown, Filter, Check } from "lucide-react";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [parsedEntities, setParsedEntities] = useState({});
  const [filters, setFilters] = useState({
    category: "",
    priceMin: "",
    priceMax: "",
  });
  const [expandedFilters, setExpandedFilters] = useState({
    price: false,
    category: false,
  });
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    if (query) performSearch();
  }, [query, page, filters]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
      );

      console.log(
        "🔍 Starting search with query:",
        query,
        "filters:",
        cleanFilters
      );

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Search request timed out")), 10000)
      );

      const response = await Promise.race([
        searchProducts(query, cleanFilters, page, 20),
        timeoutPromise,
      ]);

      console.log("📡 Frontend received search response:", {
        response: response,
        success: response?.success,
        dataLength: response?.data?.length,
        totalItems: response?.pagination?.totalItems,
        parsedEntities: response?.parsedEntities,
      });

      if (response && response.success !== false) {
        console.log("📦 Setting results:", response.data);
        console.log("📊 Results length:", response.data?.length);
        setResults(response.data || []);
        setPagination(response.pagination || {});
        setParsedEntities(response.parsedEntities || {});
      } else if (!response) {
        console.warn("⚠️ No response received from search");
        setResults([]);
      }
    } catch (err) {
      setError(
        err.message === "Search request timed out"
          ? "Search took too long. Please try again."
          : "Failed to search products. Please try again."
      );
      console.error("❌ Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: "", priceMin: "", priceMax: "" });
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    navigate(`/search?${params.toString()}`);
    window.scrollTo(0, 0);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const toggleFilter = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const FilterSection = ({ title, filterName, children }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleFilter(filterName)}
        className="flex items-center justify-between w-full py-4 hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            expandedFilters[filterName] ? "rotate-180" : ""
          }`}
        />
      </button>
      {expandedFilters[filterName] && <div className="pb-4">{children}</div>}
    </div>
  );

  const renderPagination = () => {
    if (!pagination.totalPages || pagination.totalPages <= 1) return null;
    const { currentPage, totalPages } = pagination;
    const pages = [];

    if (currentPage > 2) {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
    }

    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>

        {pages.map((p, index) => (
          <button
            key={index}
            onClick={() => typeof p === "number" && handlePageChange(p)}
            disabled={p === "..."}
            className={`px-3 py-2 rounded-lg border ${
              p === currentPage
                ? "bg-yellow-500 text-black border-yellow-500"
                : "hover:bg-gray-50"
            } ${p === "..." ? "cursor-default" : ""}`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20">
      <div className="bg-white shadow-sm border-b sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <SearchBar className="max-w-2xl mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {query && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              Search Results for "{query}"
            </h1>
            {(parsedEntities.year ||
              parsedEntities.make ||
              parsedEntities.model ||
              parsedEntities.partType ||
              parsedEntities.brand) && (
              <div className="text-sm text-gray-600">
                {parsedEntities.year && (
                  <span className="mr-4">Year: {parsedEntities.year}</span>
                )}
                {parsedEntities.make && (
                  <span className="mr-4">Make: {parsedEntities.make}</span>
                )}
                {parsedEntities.model && (
                  <span className="mr-4">Model: {parsedEntities.model}</span>
                )}
                {parsedEntities.partType && (
                  <span className="mr-4">Part: {parsedEntities.partType}</span>
                )}
                {parsedEntities.brand && (
                  <span className="mr-4">Brand: {parsedEntities.brand}</span>
                )}
              </div>
            )}
            {pagination.totalItems > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {pagination.totalItems} results found
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
          {showFiltersMobile && (
            <div
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowFiltersMobile(false)}
            />
          )}

          <div
            className={`fixed md:relative md:w-80 md:flex-shrink-0 top-0 left-0 h-screen md:h-auto bg-white p-6 z-50 md:z-auto transition-transform duration-300 w-80 overflow-y-auto ${
              showFiltersMobile
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }`}
          >
            <button
              onClick={() => setShowFiltersMobile(false)}
              className="md:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-6 text-gray-800">Filters</h2>

            <FilterSection title="Price Range" filterName="price">
              <div className="space-y-4 px-4">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) =>
                      handleFilterChange("priceMin", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) =>
                      handleFilterChange("priceMax", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <button
                  onClick={clearFilters}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </FilterSection>

            <FilterSection title="Category" filterName="category">
              <div className="space-y-2 px-4">
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">All Categories</option>
                  <option value="Brakes">Brakes</option>
                  <option value="Engine Parts">Engine Parts</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Exhaust">Exhaust</option>
                </select>
              </div>
            </FilterSection>
          </div>

          {/* Products Grid - 2 Columns */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setShowFiltersMobile(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
            {loading && (
              <div className="grid grid-cols-2 gap-6">
                {[...Array(8)].map((_, i) => (
                  <SkeletonLoader key={i} />
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={performSearch}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && results.length === 0 && query && (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && results.length > 0 && (
              <>
                {console.log("🎨 Rendering", results.length, "products")}
                <div className="grid grid-cols-2 gap-6">
                  {results.map((product) => {
                    console.log(
                      "📋 Rendering product:",
                      product.id,
                      product.itemName
                    );
                    return (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="bg-white hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
                      >
                        <div className="aspect-[4/5] bg-gray-200 flex items-center justify-center p-4">
                          <img
                            src={product.mainImage?.url || "/placeholder.jpg"}
                            alt={product.itemName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-sm text-gray-800 mb-2 line-clamp-2 min-h-10">
                            {product.itemName}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-green-600 mb-3">
                            <Check className="w-3 h-3" />
                            <span>Verified</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-2xl font-bold text-black">
                              ${product.price.toFixed(2)}
                            </span>
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
                                product.quantity > 0
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {product.quantity > 0 ? "In Stock" : "Out"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
