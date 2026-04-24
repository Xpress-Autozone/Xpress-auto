import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Filter, X } from "lucide-react";
import SkeletonLoader from "../../Components/SkeletonLoader/skeletonLoader";
import EmptyState from "../../Components/EmptyState/EmptyState";
import { getAllProducts, getProductFacets } from "../../lib/productService";
import ProductCard from "../../Components/ProductCard/ProductCard";
import CategoryDropdown from "../../Components/CategoryDropdown/CategoryDropdown";
import SEO from "../../lib/SEOHelper";

export default function CategoryPage({
  title = "Category",
  categoryQuery = "",
  heroImage = "",
  heroDescription = "",
  categoryId = null,
}) {
  const navigate = useNavigate();

  // Filter state
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPartTypes, setSelectedPartTypes] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // UI state
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    partType: false,
    brand: true,
    condition: false,
    availability: true,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // Dynamic facets from the API
  const [facets, setFacets] = useState({
    brands: [],
    conditions: [],
    partTypes: [],
    priceRange: { min: 0, max: 10000 },
    stockStatus: { inStock: 0, outOfStock: 0 },
    totalProducts: 0,
  });

  // Fetch facets + products in parallel on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch facets and products in parallel
        const [facetData, productData] = await Promise.all([
          getProductFacets(categoryQuery),
          getAllProducts({ limit: 500, page: 1 }),
        ]);

        // Set facets
        if (facetData) {
          setFacets(facetData);
          // Initialize price range to actual data range
          setPriceRange([
            facetData.priceRange?.min || 0,
            facetData.priceRange?.max || 10000,
          ]);
        }

        // Filter products by category
        if (productData.success && productData.data) {
          const allProducts = productData.data;
          const matchedProducts = allProducts.filter(
            (p) =>
              p.categoryId === categoryQuery ||
              p.category === categoryQuery ||
              p.category === title
          );

          setProducts(
            matchedProducts.map((p) => {
              let imageUrl = "https://placehold.co/400x320";
              if (typeof p.mainImage === "string" && p.mainImage.startsWith("http")) {
                imageUrl = p.mainImage;
              } else if (p.mainImage?.url) {
                imageUrl = p.mainImage.url;
              } else if (p.image && typeof p.image === "string" && p.image.startsWith("http")) {
                imageUrl = p.image;
              } else if (p.mainImage?.imageUrl) {
                imageUrl = p.mainImage.imageUrl;
              }

              return {
                id: p.id,
                name: p.itemName || p.name || "Unnamed Product",
                price: parseFloat(p.price) || 0,
                image: imageUrl,
                status: p.quantity > 0 || p.stock > 0 ? "In Stock" : "Out of Stock",
                verified: true,
                partType: p.partType || "",
                brand: p.brand || "",
                condition: (p.condition || "new").toLowerCase(),
                description: p.description,
                specifications: p.specifications,
                compatibility: p.compatibility,
                categoryId: p.categoryId,
                category: p.category,
                additionalImages: p.additionalImages || [],
              };
            })
          );
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error(`[CategoryPage] ❌ Error:`, error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [categoryQuery, title]);

  // Apply all filters to products
  const filteredProducts = products.filter((p) => {
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchesStock = inStockOnly ? p.status === "In Stock" : true;
    const matchesBrand = selectedBrands.length > 0 ? selectedBrands.includes(p.brand) : true;
    const matchesPartType = selectedPartTypes.length > 0 ? selectedPartTypes.includes(p.partType) : true;
    const matchesCondition = selectedConditions.length > 0 ? selectedConditions.includes(p.condition) : true;
    return matchesPrice && matchesStock && matchesBrand && matchesPartType && matchesCondition;
  });

  // Count active filters
  const activeFilterCount =
    selectedBrands.length +
    selectedPartTypes.length +
    selectedConditions.length +
    (inStockOnly ? 1 : 0) +
    (priceRange[0] > (facets.priceRange?.min || 0) || priceRange[1] < (facets.priceRange?.max || 10000) ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedPartTypes([]);
    setSelectedConditions([]);
    setInStockOnly(false);
    setPriceRange([facets.priceRange?.min || 0, facets.priceRange?.max || 10000]);
  };

  const toggleArrayFilter = (setter, value) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const FilterSection = ({ title, filterName, children, badge }) => (
    <div className="border-b border-gray-100 last:border-none">
      <button
        onClick={() =>
          setExpandedFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }))
        }
        className="flex items-center justify-between w-full py-4"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-gray-900">
            {title}
          </span>
          {badge > 0 && (
            <span className="bg-yellow-500 text-black text-[8px] font-black px-1.5 py-0.5 min-w-[18px] text-center">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            expandedFilters[filterName] ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          expandedFilters[filterName] ? "max-h-[500px] pb-4" : "max-h-0"
        }`}
      >
        <div className="space-y-2">{children}</div>
      </div>
    </div>
  );

  const CheckboxItem = ({ label, count, checked, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer group py-1">
      <div className="flex items-center space-x-3">
        <div
          className={`w-4 h-4 border-2 flex items-center justify-center transition-all ${
            checked ? "bg-black border-black" : "border-gray-300 group-hover:border-black"
          }`}
        >
          {checked && (
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L7 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <span
          className={`text-sm font-bold uppercase transition-colors ${
            checked ? "text-black" : "text-gray-500 group-hover:text-black"
          }`}
        >
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-[10px] font-bold text-gray-400">{count}</span>
      )}
    </label>
  );

  const maxPrice = facets.priceRange?.max || 10000;
  const minPrice = facets.priceRange?.min || 0;

  const categoryStructuredData = filteredProducts.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${title} - Xpress Autozone`,
    "description": heroDescription,
    "url": `https://xpressautozone.com/${categoryQuery}`,
    "numberOfItems": filteredProducts.length,
    "itemListElement": filteredProducts.slice(0, 10).map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": p.name,
      "url": `https://xpressautozone.com/product/${p.id}`,
    }))
  } : null;

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={title}
        description={heroDescription || `Shop ${title} at Xpress Autozone — Ghana's premier auto parts marketplace. Browse verified ${title.toLowerCase()} parts and accessories.`}
        keywords={`${title}, auto parts Ghana, ${title.toLowerCase()} parts, Xpress Autozone, car parts`}
        canonicalUrl={`/${categoryQuery}`}
        structuredData={categoryStructuredData}
      />
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] w-full flex items-center bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-2">
              {title}
            </h1>
            <CategoryDropdown currentCategory={categoryId || title} />
          </div>
          <p className="text-sm md:text-lg text-gray-200 max-w-xl font-medium">
            {heroDescription}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Toggle Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between bg-gray-900 text-white px-6 py-4 rounded-none font-black uppercase italic tracking-widest text-sm"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
              {activeFilterCount > 0 && (
                <span className="bg-yellow-500 text-black text-[8px] font-black px-1.5 py-0.5">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <span>{filteredProducts.length} Items</span>
          </button>
        </div>

        {/* Active Filter Pills */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 pb-6 border-b border-gray-100">
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mr-2">
              Active Filters:
            </span>
            {selectedBrands.map((b) => (
              <button
                key={`brand-${b}`}
                onClick={() => toggleArrayFilter(setSelectedBrands, b)}
                className="flex items-center gap-1 bg-black text-white text-[8px] font-black uppercase italic px-3 py-1.5 hover:bg-red-600 transition-colors"
              >
                {b} <X size={10} />
              </button>
            ))}
            {selectedPartTypes.map((pt) => (
              <button
                key={`pt-${pt}`}
                onClick={() => toggleArrayFilter(setSelectedPartTypes, pt)}
                className="flex items-center gap-1 bg-black text-white text-[8px] font-black uppercase italic px-3 py-1.5 hover:bg-red-600 transition-colors"
              >
                {pt} <X size={10} />
              </button>
            ))}
            {selectedConditions.map((c) => (
              <button
                key={`cond-${c}`}
                onClick={() => toggleArrayFilter(setSelectedConditions, c)}
                className="flex items-center gap-1 bg-black text-white text-[8px] font-black uppercase italic px-3 py-1.5 hover:bg-red-600 transition-colors"
              >
                {c} <X size={10} />
              </button>
            ))}
            {inStockOnly && (
              <button
                onClick={() => setInStockOnly(false)}
                className="flex items-center gap-1 bg-black text-white text-[8px] font-black uppercase italic px-3 py-1.5 hover:bg-red-600 transition-colors"
              >
                In Stock Only <X size={10} />
              </button>
            )}
            <button
              onClick={clearAllFilters}
              className="text-[9px] font-black uppercase tracking-widest text-red-600 hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-10">
          <aside
            className={`
            ${showFilters ? "block" : "hidden"} 
            lg:block lg:w-72 lg:shrink-0
            border-b lg:border-none border-gray-100 mb-8 lg:mb-0
          `}
          >
            <div className="lg:sticky lg:top-24 space-y-2">
              <h2 className="hidden lg:block text-xl font-black uppercase italic mb-6 tracking-tighter">
                Refine Search
              </h2>

              {/* Price Range */}
              <FilterSection title="Price Range" filterName="price">
                <div className="space-y-4">
                  <div className="px-1">
                    <div className="relative h-1.5 w-full bg-gray-100 rounded-full">
                      <div
                        className="absolute h-full bg-yellow-500 rounded-full"
                        style={{
                          left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice || 1)) * 100}%`,
                          right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice || 1)) * 100}%`,
                        }}
                      />
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step={Math.max(1, Math.floor((maxPrice - minPrice) / 100))}
                        value={priceRange[0]}
                        onChange={(e) => {
                          const val = Math.min(parseInt(e.target.value), priceRange[1] - 1);
                          setPriceRange([val, priceRange[1]]);
                        }}
                        className="absolute inset-0 w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-yellow-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                      />
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step={Math.max(1, Math.floor((maxPrice - minPrice) / 100))}
                        value={priceRange[1]}
                        onChange={(e) => {
                          const val = Math.max(parseInt(e.target.value), priceRange[0] + 1);
                          setPriceRange([priceRange[0], val]);
                        }}
                        className="absolute inset-0 w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-yellow-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black bg-gray-50 border border-gray-100 px-2 py-1">
                      GH₵{priceRange[0].toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-gray-300">—</span>
                    <span className="text-xs font-black bg-black text-white px-2 py-1">
                      GH₵{priceRange[1].toLocaleString()}
                    </span>
                  </div>
                </div>
              </FilterSection>

              {/* Brand Filter */}
              {facets.brands.length > 0 && (
                <FilterSection
                  title="Brand"
                  filterName="brand"
                  badge={selectedBrands.length}
                >
                  <div className="max-h-48 overflow-y-auto pr-1 space-y-0.5 custom-scrollbar">
                    {facets.brands.map((brand) => (
                      <CheckboxItem
                        key={brand.name}
                        label={brand.name}
                        count={brand.count}
                        checked={selectedBrands.includes(brand.name)}
                        onChange={() => toggleArrayFilter(setSelectedBrands, brand.name)}
                      />
                    ))}
                  </div>
                </FilterSection>
              )}

              {/* Part Type Filter */}
              {facets.partTypes.length > 0 && (
                <FilterSection
                  title="Part Type"
                  filterName="partType"
                  badge={selectedPartTypes.length}
                >
                  <div className="max-h-48 overflow-y-auto pr-1 space-y-0.5 custom-scrollbar">
                    {facets.partTypes.map((pt) => (
                      <CheckboxItem
                        key={pt.name}
                        label={pt.name}
                        count={pt.count}
                        checked={selectedPartTypes.includes(pt.name)}
                        onChange={() => toggleArrayFilter(setSelectedPartTypes, pt.name)}
                      />
                    ))}
                  </div>
                </FilterSection>
              )}

              {/* Condition Filter */}
              {facets.conditions.length > 0 && (
                <FilterSection
                  title="Condition"
                  filterName="condition"
                  badge={selectedConditions.length}
                >
                  <div className="grid grid-cols-3 gap-1">
                    {facets.conditions.map((cond) => (
                      <button
                        key={cond.name}
                        onClick={() => toggleArrayFilter(setSelectedConditions, cond.name)}
                        className={`block w-full text-center text-[8px] font-black uppercase tracking-tighter py-3 px-1 border transition-all ${
                          selectedConditions.includes(cond.name)
                            ? "bg-black text-white border-black italic"
                            : "border-gray-100 text-gray-400 hover:border-black hover:text-black"
                        }`}
                      >
                        {cond.name}
                        <span className="block text-[7px] font-bold mt-0.5 opacity-60">
                          ({cond.count})
                        </span>
                      </button>
                    ))}
                  </div>
                </FilterSection>
              )}

              {/* Stock Status */}
              <FilterSection title="Availability" filterName="availability">
                <CheckboxItem
                  label="In Stock Only"
                  count={facets.stockStatus?.inStock || 0}
                  checked={inStockOnly}
                  onChange={() => setInStockOnly(!inStockOnly)}
                />
              </FilterSection>

              {/* Clear All */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="w-full mt-4 text-[9px] font-black uppercase tracking-[0.2em] text-red-600 hover:underline pt-4 border-t border-gray-50"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1 relative min-h-[400px]">
            <div className="hidden lg:flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                Inventory Catalog
              </h2>
              <p className="text-xs font-black text-black uppercase">
                {filteredProducts.length} Units Available
              </p>
            </div>

            <div className={`transition-all duration-500 ${isLoading ? "opacity-30 pointer-events-none blur-[1px]" : "opacity-100"}`}>
              {products.length === 0 && !isLoading ? (
                <div className="py-20">
                  <EmptyState message="No products listed for this category." />
                </div>
              ) : filteredProducts.length === 0 && !isLoading ? (
                <div className="py-20">
                  <EmptyState message="Zero results for current filters." />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} variant="default" />
                  ))}
                </div>
              )}
            </div>

            {/* Subtle Overlay Loading Indicator */}
            {isLoading && (
              <div className="absolute top-40 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-yellow-500 rounded-full animate-spin" />
                <span className="text-[10px] font-black uppercase italic tracking-widest text-black animate-pulse bg-white/90 px-5 py-2 backdrop-blur-md border border-gray-100 shadow-xl">
                  {products.length === 0 ? "Loading Inventory..." : "Updating Catalog..."}
                </span>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}