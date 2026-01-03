import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchProducts } from "../../lib/api";
import { useSearch } from "../../Context/SearchContext";
import CATEGORIES from "../../data/categories";
import SkeletonLoader from "../../Components/SkeletonLoader/skeletonLoader";
import { ChevronDown, Filter, AlertTriangle, RefreshCw, Home } from "lucide-react";

// --- 1. INTEGRATED ERROR BOUNDARY ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, errorInfo) {
    console.error("Search Page Crash:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
          <div className="max-w-md w-full border-2 border-black p-10 text-center space-y-6">
            <AlertTriangle size={48} className="text-red-600 mx-auto" />
            <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
              Search <span className="text-red-600">Engine Error</span>
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 leading-relaxed">
              A critical error occurred while processing the search data. This may be due to an incompatible API response or data formatting.
            </p>
            <div className="flex flex-col gap-3 pt-4">
              <button onClick={() => window.location.reload()} className="bg-black text-white py-4 font-black uppercase italic tracking-widest flex items-center justify-center gap-2 hover:bg-yellow-500 hover:text-black transition-all">
                <RefreshCw size={16} /> Reboot Search
              </button>
              <a href="/" className="border border-gray-200 py-4 font-black uppercase italic tracking-widest flex items-center justify-center gap-2 text-[10px]">
                <Home size={14} /> Return to Base
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- 2. MAIN PAGE COMPONENT ---
const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openSearch } = useSearch();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [parsedEntities, setParsedEntities] = useState({});
  const [filters, setFilters] = useState({
    category: [], // allow multi-select
    priceMax: 10000,
  });
  const [priceRangeUI, setPriceRangeUI] = useState(10000);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortMode, setSortMode] = useState("featured"); // "featured" | "relevance"
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    category: true,
  });

  const query = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  // Debounce price slider updates
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters(prev => ({ ...prev, priceMax: priceRangeUI }));
    }, 120);
    return () => clearTimeout(t);
  }, [priceRangeUI]);

  useEffect(() => {
    if (query) performSearch();
  }, [query, page, filters]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend supports single category equality only. If user selected multiple categories,
      // omit category from backend filters and apply client-side filtering instead.
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => {
          if (Array.isArray(value) && value.length === 0) return false;
          if (value === "" || value == null) return false;
          if (key === "priceMax" && value === 10000) return false; // Don't send max price if default
          return true;
        })
      );
      let fetchPageSize = 20;
      if (Array.isArray(filters.category) && filters.category.length > 1) {
        // request more items so client-side filtering has higher chance of results
        fetchPageSize = 60;
        delete cleanFilters.category;
      } else if (Array.isArray(filters.category) && filters.category.length === 1) {
        cleanFilters.category = filters.category[0];
      }

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Search request timed out")), 10000)
      );

      const response = await Promise.race([
        searchProducts(query, cleanFilters, page, fetchPageSize),
        timeoutPromise,
      ]);

      // DEFENSIVE FIX: Check for response existence and success before setting data
      if (response && response.success !== false) {
        const raw = Array.isArray(response.data) ? response.data : [];
        setResults(raw);
        setPagination(response.pagination || {});
        setParsedEntities(response.parsedEntities || {});
      } else {
        setResults([]);
      }
    } catch (err) {
      setError(err.message === "Search request timed out" 
        ? "Search took too long. Please try again." 
        : "Failed to fetch results. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const promoteFeatured = (items) => {
    if (!Array.isArray(items) || items.length === 0) return items;
    // Featured items have displayPriority > 0. Keep stable ordering otherwise.
    const featured = items.filter((p) => Number(p.displayPriority) > 0);
    const rest = items.filter((p) => Number(p.displayPriority) <= 0 || p.displayPriority == null);
    // sort featured by displayPriority desc (higher priority first)
    featured.sort((a, b) => (Number(b.displayPriority) || 0) - (Number(a.displayPriority) || 0));
    return [...featured, ...rest];
  };

  const displayedResults = React.useMemo(() => {
    // Apply category multi-select filter client-side (backend supports single category equality only)
    let items = results;
    if (Array.isArray(filters.category) && filters.category.length > 0) {
      const cats = filters.category;
      items = items.filter((p) => {
        const pc = (p.category && String(p.category)) || "";
        return cats.includes(pc) || cats.includes(p.category?.slug) || cats.includes(p.category?.name);
      });
    }

    return sortMode === "featured" ? promoteFeatured(items) : items;
  }, [results, sortMode, filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleCategoryToggle = (categoryName) => {
    setFilters((prev) => {
      const prevCats = Array.isArray(prev.category) ? prev.category : (prev.category ? [prev.category] : []);
      const exists = prevCats.includes(categoryName);
      const nextCats = exists ? prevCats.filter((c) => c !== categoryName) : [...prevCats, categoryName];
      return { ...prev, category: nextCats };
    });
  };

  const toggleFilter = (filterName) => {
    setExpandedFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  const renderPagination = () => {
    if (!pagination?.totalPages || pagination.totalPages <= 1) return null;
    const { currentPage, totalPages } = pagination;
    const pages = [];
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-4 mt-12 border-t border-gray-100 pt-8">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set("page", p.toString());
              navigate(`/search?${params.toString()}`);
            }}
            className={`text-xs font-black uppercase italic tracking-widest transition-all ${
              p === currentPage ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-400 hover:text-black"
            }`}
          >
            {p.toString().padStart(2, '0')}
          </button>
        ))}
      </div>
    );
  };

  const FilterSection = ({ title, filterName, children }) => (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => toggleFilter(filterName)}
        className="flex items-center justify-between w-full py-4 text-left group"
      >
        <span className="text-xs font-black uppercase tracking-widest text-gray-900 group-hover:text-yellow-600 transition-colors">
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            expandedFilters[filterName] ? "rotate-180" : ""
          }`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${expandedFilters[filterName] ? "max-h-96 pb-4" : "max-h-0"}`}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Top Search Header */}
      <div className="bg-black pt-20 pb-6 md:pt-20 md:pb-8 px-3 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white space-y-2">
            <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px]">Showing search results for</span>
            <h1 className="text-2xl md:text-2xl font-black   leading-none">
              "{query}"
            </h1>
          </div>
          <button 
            onClick={openSearch}
            className="bg-black text-white px-2 py-1 md:px-3 md:py-2 font-black uppercase italic tracking-widest text-[10px] md:text-xs hover:bg-yellow-500 transition-all whitespace-nowrap"
          >
            Try another Search
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* DEFENSIVE: Only map entities if parsedEntities exists and has keys */}
        {parsedEntities && Object.keys(parsedEntities).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-100">
            {Object.entries(parsedEntities).map(([key, value]) => value && (
              <span key={key} className="bg-gray-50 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 border border-gray-100 italic">
                {key}: <span className="text-black font-black italic">{value}</span>
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters (desktop) */}
          <aside className={"hidden lg:block lg:w-64 lg:shrink-0"}>
            <div className="sticky top-28 space-y-2">
              <FilterSection title="Price Limit" filterName="price">
                <input
                  type="range" min="0" max="10000" step="100"
                  value={priceRangeUI}
                  onChange={(e) => setPriceRangeUI(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Max Price</span>
                  <span className="text-xs font-black bg-black text-white px-2 py-1">GH₵{priceRangeUI.toLocaleString()}</span>
                </div>
              </FilterSection>

              <FilterSection title="Categories" filterName="category">
                <div className="grid grid-cols-2 lg:space-y-2 lg:grid-cols-1 gap-2 lg:gap-0">
                  {CATEGORIES.map((cat) => {
                    const checked = Array.isArray(filters.category) && filters.category.includes(cat);
                    return (
                      <label key={cat} className="flex items-start gap-2 py-2 px-2 border border-transparent hover:border-gray-100">
                        <input type="checkbox" checked={checked} onChange={() => handleCategoryToggle(cat)} className="mt-0.5" />
                        <span className="text-[11px] font-black uppercase tracking-tight text-gray-900">{cat}</span>
                      </label>
                    );
                  })}
                </div>
              </FilterSection>

              <button 
                onClick={() => { setFilters({ category: [], priceMax: 10000 }); setPriceRangeUI(10000); }}
                className="w-full mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-red-600 hover:underline pt-4 border-gray-50"
              >
                Reset All Filters
              </button>
            </div>
          </aside>

          {/* Mobile Filters Toggle Button */}
          <div className="lg:hidden mb-">
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-between bg-black text-white px- py-3 font-black uppercase italic tracking-widest text-sm"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>{showMobileFilters ? "Hide Filters" : "Show Filters"}</span>
              </div>
              <span>{displayedResults.length} Items</span>
            </button>
          </div>

          {/* Mobile Filters Accordion (inline accordion, not overlay) */}
          {showMobileFilters && (
            <div className="lg:hidden mb-1 border-b border-gray-100 pb-6">
              <div className="space-y-2">
                <FilterSection title="Price Limit" filterName="price">
                  <input
                    type="range" min="0" max="10000" step="100"
                    value={priceRangeUI}
                    onChange={(e) => setPriceRangeUI(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Max Price</span>
                    <span className="text-xs font-black bg-black text-white px-2 py-1">GH₵{priceRangeUI.toLocaleString()}</span>
                  </div>
                </FilterSection>

              <FilterSection title="Categories" filterName="category">
                <div className="grid grid-cols-2 lg:space-y-2 lg:grid-cols-1 gap-2 lg:gap-0">
                  {CATEGORIES.map((cat) => {
                    const checked = Array.isArray(filters.category) && filters.category.includes(cat);
                    return (
                      <label key={cat} className="flex items-start gap-2 py-2 px-2 border border-transparent hover:border-gray-100">
                        <input type="checkbox" checked={checked} onChange={() => handleCategoryToggle(cat)} className="mt-0.5" />
                        <span className="text-[9px] font-black uppercase tracking-tight text-gray-900">{cat}</span>
                      </label>
                    );
                  })}
                </div>
              </FilterSection>                <button 
                  onClick={() => { setFilters({ category: [], priceMax: 10000 }); setPriceRangeUI(10000); }}
                  className="w-full mt-6 text-[9px] font-black uppercase tracking-[0.2em] text-red-600 hover:underline pt-4 border-t border-gray-50"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}

          {/* Results Area */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-10 border-b border-gray-50 pb-4">
              <div className="hidden lg:flex items-center gap-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sort by</label>
                <select value={sortMode} onChange={(e) => setSortMode(e.target.value)} className="text-[10px] font-black uppercase tracking-widest bg-white border border-gray-100 p-2">
                  <option value="featured">Featured First</option>
                  <option value="relevance">Relevance</option>
                </select>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                {pagination?.totalItems || 0} Products Identified
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => <SkeletonLoader key={i} />)}
              </div>
            ) : error ? (
              <div className="text-center py-20 border-2 border-dashed border-red-50">
                <p className="text-red-500 font-black uppercase tracking-widest">{error}</p>
                <button onClick={performSearch} className="mt-4 bg-black text-white px-8 py-3 text-xs font-black uppercase italic transition-all hover:bg-yellow-500 hover:text-black">Retry Fetch</button>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-32 border border-gray-100">
                <p className="text-gray-400 font-black uppercase tracking-widest">Zero Matches Found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                {displayedResults.map((product) => (
                  <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="group cursor-pointer">
                    <div className="aspect-[4/5] bg-gray-50 mb-4 overflow-hidden relative border border-gray-50 group-hover:border-black transition-all">
                      {Number(product.displayPriority) > 0 && (
                        <span className="absolute top-3 left-3 bg-yellow-500 text-black text-[10px] font-black uppercase px-2 py-1 z-10">FEATURED</span>
                      )}
                      <img
                        src={product.mainImage?.url || "/placeholder.jpg"}
                        alt={product.itemName}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-yellow-600 transition-colors italic">
                        {product.itemName}
                      </h3>
                      <div className="flex flex-col gap-1 pt-1">
                        <span className="text-lg font-black italic tracking-tighter text-black">GH₵{(product.price || 0).toFixed(2)}</span>
                        <div className={`text-[9px] font-black uppercase w-fit px-2 py-0.5 border ${
                          product.quantity > 0 ? "border-green-500 text-green-600" : "border-red-500 text-red-600"
                        }`}>
                          {product.quantity > 0 ? "In Stock" : "Sold Out"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-20">
              {renderPagination()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// --- 3. WRAPPED EXPORT ---
const SearchResultsWithBoundary = () => (
  <ErrorBoundary>
    <SearchResultsPage />
  </ErrorBoundary>
);

export default SearchResultsWithBoundary;