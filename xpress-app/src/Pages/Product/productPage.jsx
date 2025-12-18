import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Filter,
  Check,
  X,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import slideImage from "../../assets/ProductsBanner.jpg";
import SkeletonLoader from "../../Components/SkeletonLoader/skeletonLoader";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState(1500);
  const [selectedPartTypes, setSelectedPartTypes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    partType: true,
    brand: true,
    availability: true,
  });
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock Products
  const products = [
    { id: 1, name: "Monroe OESpectrum Front Strut Assembly", price: 189.99, image: "/api/placeholder/200/200", status: "In Stock", verified: true },
    { id: 2, name: "KYB Excel-G Gas Strut - Rear Left - Toyota", price: 125.5, image: "/api/placeholder/200/200", status: "In Stock", verified: true },
    { id: 3, name: "Moog K80673 Front Lower Control Arm", price: 245.0, image: "/api/placeholder/200/200", status: "In Stock", verified: true },
    { id: 4, name: "ACDelco Gold 45G0400 Professional Front", price: 38.99, image: "/api/placeholder/200/200", status: "Low Stock", verified: true },
    { id: 5, name: "Gabriel ReadyMount Loaded Strut Assembly", price: 175.75, image: "/api/placeholder/200/200", status: "In Stock", verified: true },
    { id: 6, name: "Bilstein B4 OE Replacement Shock", price: 98.5, image: "/api/placeholder/200/200", status: "In Stock", verified: true },
  ];

  const partTypes = ["Shock Absorbers", "Coil Springs", "Bushings", "Control Arms", "Ball Joints"];
  const brands = ["Bosch", "ACDelco", "Monroe", "KYB", "Moog", "Delphi"];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const FilterSection = ({ title, filterName, children }) => (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setExpandedFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }))}
        className="flex items-center justify-between w-full py-5 text-left group"
      >
        <span className="text-xs font-black uppercase tracking-widest text-gray-900 group-hover:text-yellow-600 transition-colors">
          {title}
        </span>
        <ChevronDown size={16} className={`transition-transform duration-300 ${expandedFilters[filterName] ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${expandedFilters[filterName] ? "max-h-96 pb-6" : "max-h-0"}`}>
        {children}
      </div>
    </div>
  );

  if (isLoading) return <SkeletonLoader />;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 1. HERO SECTION - High Contrast */}
      <section className="relative h-[300px] md:h-[400px] w-full bg-black flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40" 
          style={{ backgroundImage: `url(${slideImage})` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white">
          <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Official Inventory</span>
          <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
            ENGINEERED <br /> <span className="text-gray-300">PERFORMANCE</span>
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* 2. FILTER SIDEBAR */}
          <aside className={`
            ${showFiltersMobile ? "block" : "hidden"} 
            lg:block lg:w-64 lg:shrink-0
          `}>
            <div className="sticky top-28 space-y-2">
              <h2 className="text-xl font-black uppercase italic mb-8 tracking-tighter">Inventory Filter</h2>
              
              <FilterSection title="Price Limit" filterName="price">
                <input
                  type="range" min="0" max="5000" step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase">Max</span>
                  <span className="text-xs font-black bg-black text-white px-2 py-1 italic">GH₵{priceRange.toLocaleString()}</span>
                </div>
              </FilterSection>

              <FilterSection title="Brand" filterName="brand">
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 border-gray-300 text-black focus:ring-black"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])}
                      />
                      <span className="text-[11px] font-bold text-gray-500 group-hover:text-black uppercase transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Stock" filterName="availability">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 text-black focus:ring-black"
                    checked={inStockOnly}
                    onChange={() => setInStockOnly(!inStockOnly)}
                  />
                  <span className="text-[11px] font-bold text-gray-500 group-hover:text-black uppercase tracking-tight">Show In Stock Only</span>
                </label>
              </FilterSection>

              <button 
                onClick={() => {setSelectedBrands([]); setPriceRange(5000)}}
                className="w-full mt-6 text-[9px] font-black uppercase tracking-[0.2em] text-red-600 hover:underline pt-4 border-t border-gray-50"
              >
                Reset All Filters
              </button>
            </div>
          </aside>

          {/* 3. MAIN CONTENT Area */}
          <main className="flex-1">
            <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
              <button 
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                className="lg:hidden flex items-center gap-2 bg-black text-white px-5 py-2.5 text-[10px] font-black uppercase italic"
              >
                <Filter size={14} /> {showFiltersMobile ? "Hide" : "Show"} Filters
              </button>
              <div className="hidden lg:block">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Inventory Index</h2>
              </div>
              <select className="bg-transparent border-b border-gray-200 text-[10px] font-black uppercase tracking-widest outline-none py-2 cursor-pointer focus:border-black transition-colors">
                <option>Sort: Price Low-High</option>
                <option>Sort: Price High-Low</option>
                <option>Sort: Newest First</option>
              </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/5] bg-gray-50 mb-4 overflow-hidden relative border border-gray-50 group-hover:border-black transition-colors">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-yellow-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex flex-col gap-1 pt-1">
                      <span className="text-lg font-black italic tracking-tighter text-black">GH₵{product.price.toFixed(2)}</span>
                      <div className={`text-[9px] font-black uppercase w-fit px-2 py-0.5 border ${
                        product.status === "In Stock" ? "border-green-500 text-green-600" : "border-orange-500 text-orange-600"
                      }`}>
                        {product.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}