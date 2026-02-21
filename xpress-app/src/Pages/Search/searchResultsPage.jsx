import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchProducts } from "../../lib/api";
import SearchBar from "../../Components/Search/searchBar";
import SkeletonLoader from "../../Components/SkeletonLoader/skeletonLoader";
import { ChevronDown, Filter, Check, X, AlertTriangle, RefreshCw, Home } from "lucide-react";

import SearchResultHero from "../../assets/SearchResultMobile.jpg";

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
const FilterSection = ({ title, children }) => (
  <div className="border-b border-gray-100 last:border-0 pb-6">
    <div className="py-4">
      <span className="text-xs font-black uppercase tracking-widest text-gray-900">
        {title}
      </span>
    </div>
    <div>
      {children}
    </div>
  </div>
);

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [parsedEntities, setParsedEntities] = useState({});
  const [filters, setFilters] = useState({
    category: [],
    priceMin: "",
    priceMax: "",
    condition: "",
  });
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Local state for price inputs to prevent focus loss/flicker during typing
  const [tempMin, setTempMin] = useState(filters.priceMin);
  const [tempMax, setTempMax] = useState(filters.priceMax);

  // Sync temp inputs when filters change (e.g. from presets or Clear All)
  useEffect(() => {
    setTempMin(filters.priceMin);
    setTempMax(filters.priceMax);
  }, [filters.priceMin, filters.priceMax]);

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
        Object.entries(filters).filter(([key, value]) => {
          if (Array.isArray(value)) return value.length > 0;
          return value !== "";
        }).map(([key, value]) => {
          if (key === 'category' && Array.isArray(value)) {
            return [key, value.join(',')]; // Send as comma-separated string for compatibility
          }
          return [key, value];
        })
      );

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Search request timed out")), 10000)
      );

      const response = await Promise.race([
        searchProducts(query, cleanFilters, page, 20),
        timeoutPromise,
      ]);

      // DEFENSIVE FIX: Check for response existence and success before setting data
      if (response && response.success !== false) {
        setResults(Array.isArray(response.data) ? response.data : []);
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

  const handleFilterChange = (filterName, value) => {
    // For price fields, only allow numbers
    if (filterName === "priceMin" || filterName === "priceMax") {
      const numericValue = value.replace(/\D/g, "");
      setFilters((prev) => ({ ...prev, [filterName]: numericValue }));
      return;
    }
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleCategoryToggle = (cat) => {
    setFilters((prev) => {
      const currentCats = prev.category;
      const newCats = currentCats.includes(cat)
        ? currentCats.filter((c) => c !== cat)
        : [...currentCats, cat];
      return { ...prev, category: newCats };
    });
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
            className={`text-xs font-black uppercase italic tracking-widest transition-all ${p === currentPage ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-400 hover:text-black"
              }`}
          >
            {p.toString().padStart(2, '0')}
          </button>
        ))}
      </div>
    );
  };



  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Top Search Header - Refined Height and Visibility */}
      <div className="relative bg-black py-8 px-6 border-b border-white/10 overflow-hidden min-h-[160px] flex items-center">
        {/* Background Image - Descriptive & Visible */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            backgroundImage: `url(${SearchResultHero})`,
            backgroundSize: '100% auto',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: '1'
          }}
        />

        {/* Subtle overlay only if needed for text readability, but remarkably lighter */}
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-start justify-center">
          <div className="text-white space-y-1">
            <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px] drop-shadow-md">Results for</span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none drop-shadow-lg">
              "{query}"
            </h1>
          </div>
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
          {/* Sidebar Filters */}
          <aside className={`${showFiltersMobile ? "fixed inset-0 z-[60] bg-white p-6 overflow-y-auto" : "hidden lg:block lg:w-64 lg:shrink-0"}`}>
            <div className="flex justify-between items-center mb-8 lg:hidden">
              <h2 className="text-2xl font-black italic uppercase">Filters</h2>
              <button onClick={() => setShowFiltersMobile(false)} className="p-2 bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
            </div>

            <div className="sticky top-28 space-y-2">
              <FilterSection title="Price Range">
                <div className="space-y-6">
                  {/* Dual Range Slider Component */}
                  <div className="px-2 pt-2">
                    <div className="relative h-1.5 w-full bg-gray-100 rounded-full">
                      {/* Highlighted track between handles */}
                      <div
                        className="absolute h-full bg-yellow-500 rounded-full"
                        style={{
                          left: `${Math.min((parseInt(filters.priceMin || 0) / 10000) * 100, 100)}%`,
                          right: `${100 - Math.min((parseInt(filters.priceMax || 10000) / 10000) * 100, 100)}%`
                        }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={filters.priceMin || 0}
                        onChange={(e) => {
                          const val = Math.min(parseInt(e.target.value), parseInt(filters.priceMax || 10000) - 100);
                          handleFilterChange("priceMin", val.toString());
                        }}
                        className="absolute inset-0 w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-yellow-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                      />
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={filters.priceMax || 10000}
                        onChange={(e) => {
                          const val = Math.max(parseInt(e.target.value), parseInt(filters.priceMin || 0) + 100);
                          handleFilterChange("priceMax", val.toString());
                        }}
                        className="absolute inset-0 w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-yellow-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400 italic">MIN</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={tempMin}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setTempMin(val);
                        }}
                        onBlur={() => handleFilterChange("priceMin", tempMin)}
                        className="w-full bg-gray-50 border border-gray-100 p-3 pt-5 text-base md:text-[11px] font-black uppercase outline-none focus:border-black text-right"
                        placeholder="0"
                      />
                      <span className="absolute left-3 bottom-2 text-xs md:text-[8px] font-black italic text-black">₵</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400 italic">MAX</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={tempMax}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setTempMax(val);
                        }}
                        onBlur={() => handleFilterChange("priceMax", tempMax)}
                        className="w-full bg-gray-50 border border-gray-100 p-3 pt-5 text-base md:text-[11px] font-black uppercase outline-none focus:border-black text-right"
                        placeholder="10K+"
                      />
                      <span className="absolute left-3 bottom-2 text-xs md:text-[8px] font-black italic text-black">₵</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "Economy", min: "0", max: "1000" },
                      { label: "Performance", min: "1000", max: "5000" },
                      { label: "Premium", min: "5000", max: "99000" }
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => {
                          handleFilterChange("priceMin", preset.min);
                          handleFilterChange("priceMax", preset.max);
                        }}
                        className={`text-[8px] font-black uppercase tracking-tighter px-3 py-1.5 border transition-all italic ${filters.priceMin === preset.min && filters.priceMax === preset.max
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black"
                          }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </FilterSection>

              <FilterSection title="Categories">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "body-chassis", label: "Body & Parts" },
                    { id: "engine-performance", label: "Engine" },
                    { id: "wheels-tires", label: "Wheels & Tires" },
                    { id: "lighting-electronics", label: "Electronics" },
                    { id: "accessories", label: "Accessories" },
                    { id: "automotive-tools", label: "Tools" },
                    { id: "fluids-care", label: "Fluids" },
                    { id: "cooling-ac", label: "Cooling & AC" }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryToggle(cat.id)}
                      className={`block w-full text-center text-[9px] font-black uppercase tracking-tighter py-3 px-1 border transition-all ${filters.category.includes(cat.id) ? "bg-black text-white border-black italic" : "border-gray-100 text-gray-400 hover:border-black hover:text-black"
                        }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Item Condition">
                <div className="grid grid-cols-3 gap-1">
                  {["New", "Used", "Refurbished"].map(cond => (
                    <button
                      key={cond}
                      onClick={() => handleFilterChange("condition", cond)}
                      className={`block w-full text-center text-[8px] font-black uppercase tracking-tighter py-3 px-1 border transition-all ${filters.condition === cond ? "bg-black text-white border-black italic" : "border-gray-100 text-gray-400 hover:border-black hover:text-black"
                        }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <button
                onClick={() => setFilters({ category: [], priceMin: "", priceMax: "", condition: "" })}
                className="w-full mt-6 text-[9px] font-black uppercase tracking-[0.2em] text-red-600 hover:underline pt-4 border-t border-gray-50"
              >
                Reset All Filters
              </button>
            </div>
          </aside>

          {/* Results Area */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b border-gray-50 pb-6 gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <button onClick={() => setShowFiltersMobile(true)} className="lg:hidden flex items-center gap-2 bg-black text-white px-5 py-2.5 text-[10px] font-black uppercase italic">
                  <Filter size={14} /> Filters
                </button>
                <div className="flex items-center gap-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    {pagination?.totalItems || 0} Products Identified
                  </p>
                  {Object.entries(filters).filter(([_, v]) => Array.isArray(v) ? v.length > 0 : v !== "").length > 0 && (
                    <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                      <span className="bg-yellow-500 text-black text-[8px] font-black uppercase px-2 py-1 italic">
                        {Object.entries(filters).reduce((acc, [_, v]) => acc + (Array.isArray(v) ? v.length : (v !== "" ? 1 : 0)), 0)} Filters Applied
                      </span>
                      <button
                        onClick={() => setFilters({ category: [], priceMin: "", priceMax: "", condition: "" })}
                        className="text-[8px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 font-black flex items-center gap-1 transition-colors italic"
                      >
                        <X size={10} /> Clear All Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
                {results.map((product) => (
                  <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="group cursor-pointer">
                    <div className="aspect-[4/5] bg-gray-50 mb-4 overflow-hidden relative border border-gray-50 group-hover:border-black transition-all">
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
                        <div className={`text-[9px] font-black uppercase w-fit px-2 py-0.5 border ${product.quantity > 0 ? "border-green-500 text-green-600" : "border-red-500 text-red-600"
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