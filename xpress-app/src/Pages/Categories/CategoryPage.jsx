import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Filter, Check, X } from "lucide-react";
import SkeletonLoader from "../../Components/SkeletonLoader/skeletonLoader";
import EmptyState from "../../Components/EmptyState/EmptyState";
import CategoryDropdown from "../../Components/CategoryDropdown/CategoryDropdown";
import SEO from "../../lib/SEOHelper";
import { getPageMetadata, pageMetadata } from "../../data/pageMetadata";
import { generateBreadcrumbSchema } from "../../lib/SEOHelper";

export default function CategoryPage({
  title = "Category",
  categoryQuery = "",
  heroImage = "",
  heroDescription = "",
  partTypeFilters = [],
  brandFilters = [],
  metadataKey = null,
}) {
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState(10000);
  const [priceRangeUI, setPriceRangeUI] = useState(10000);
  const [selectedPartTypes, setSelectedPartTypes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    partType: true,
    brand: true,
    availability: true,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: categoryQuery, pageSize: 100 }),
        });
        const data = await response.json();
        if (data.success) {
          setProducts(
            data.data.map((p) => ({
              id: p.id,
              name: p.itemName,
              price: parseFloat(p.price) || 0,
              image: p.mainImage?.url || "/api/placeholder/200/200",
              status: p.quantity > 0 ? "In Stock" : "Out of Stock",
              verified: true,
              partType: p.partType || "",
              brand: p.brand || "",
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [categoryQuery]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPriceRange(priceRangeUI);
    }, 120);

    return () => clearTimeout(t);
  }, [priceRangeUI]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesPrice = p.price <= priceRange;
      const matchesStock = inStockOnly ? p.status === "In Stock" : true;
      const matchesPart = selectedPartTypes.length > 0 ? selectedPartTypes.includes(p.partType) : true;
      const matchesBrand = selectedBrands.length > 0 ? selectedBrands.includes(p.brand) : true;
      return matchesPrice && matchesStock && matchesPart && matchesBrand;
    });
  }, [products, priceRange, inStockOnly, selectedPartTypes, selectedBrands]);

  const FilterSection = ({ title, filterName, children }) => (
    <div className="border-b border-gray-100 last:border-none">
      <button
        onClick={() => setExpandedFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }))}
        className="flex items-center justify-between w-full py-4"
      >
        <span className="text-xs font-black uppercase tracking-widest text-gray-900">{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedFilters[filterName] ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${expandedFilters[filterName] ? "max-h-96 pb-4" : "max-h-0"}`}>
        <div className="space-y-2">{children}</div>
      </div>
    </div>
  );

  // Get SEO metadata for this category
  const categoryMetadata = metadataKey ? getPageMetadata(metadataKey) : null;
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: title, url: window.location.pathname }
  ];

  return (
    <div className="min-h-screen bg-white">
      {categoryMetadata && (
        <SEO
          title={categoryMetadata.title}
          description={categoryMetadata.description}
          keywords={categoryMetadata.keywords}
          ogUrl={categoryMetadata.url}
          ogImage={categoryMetadata.ogImage}
          ogType={categoryMetadata.ogType}
          canonicalUrl={categoryMetadata.url}
          breadcrumbs={breadcrumbs}
        />
      )}
      {/* Hero Section */}
      <section className="relative z-20 overflow-visible h-[300px] md:h-[400px] w-full flex items-center bg-black">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="relative z-30 max-w-7xl mx-auto px-6 w-full text-white">
          <div className="relative flex items-center gap-3">
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-2">{title}</h1>
            <CategoryDropdown currentCategory={title} />
          </div>
          <p className="text-md md:text-lg text-gray-200 max-w-xl font-medium">{heroDescription}</p>
        </div>
      </section>

      <div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Toggle Button */}
        <div className="lg:hidden mb-6">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between bg-gray-900 text-white px-6 py-4 rounded-none font-black uppercase italic tracking-widest text-sm"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </div>
            <span>{filteredProducts.length} Items</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Filters Sidebar - Inline for both Mobile and PC */}
          <aside className={`
            ${showFilters ? "block" : "hidden"} 
            lg:block lg:w-72 lg:shrink-0
            border-b lg:border-none border-gray-100 mb-8 lg:mb-0
          `}>
            <div className="sticky top-24 space-y-2">
              <h2 className="hidden lg:block text-xl font-black uppercase italic mb-6 tracking-tighter">Refine Search</h2>
              
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

              <FilterSection title="Brand" filterName="brand">
                <div className="grid grid-cols-1 gap-2">
                  {brandFilters.map((brand) => (
                    <label key={brand} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 border-gray-300 text-black focus:ring-black"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])}
                      />
                      <span className="text-sm font-bold text-gray-500 group-hover:text-black transition-colors uppercase">{brand}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Stock Status" filterName="availability">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 text-black focus:ring-black"
                    checked={inStockOnly}
                    onChange={() => setInStockOnly(!inStockOnly)}
                  />
                  <span className="text-sm font-bold text-gray-500 group-hover:text-black uppercase">In Stock Only</span>
                </label>
              </FilterSection>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="hidden lg:flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Inventory Catalog</h2>
              <p className="text-xs font-black text-black uppercase">{filteredProducts.length} Units Available</p>
            </div>

            {isLoading ? (
              <SkeletonLoader />
            ) : filteredProducts.length === 0 ? (
              <div className="py-20">
                <EmptyState message="Zero results for current filters." />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[4/5] bg-gray-50 mb-4 overflow-hidden relative border border-gray-50">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xs md:text-sm font-black text-gray-900 uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex flex-col gap-1 pt-1">
                        <span className="text-lg font-black italic tracking-tighter text-black">GH₵{product.price.toFixed(2)}</span>
                        <div className={`text-[9px] font-black uppercase w-fit px-2 py-0.5 border ${
                          product.status === "In Stock" ? "border-green-500 text-green-600" : "border-red-500 text-red-600"
                        }`}>
                          {product.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}