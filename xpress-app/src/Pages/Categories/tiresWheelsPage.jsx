import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Grid3x3,
  List,
  Home,
  ChevronRight,
  Filter,
  Check,
} from "lucide-react";
import slideImage from "../../assets/tyres.jpg";
import SkeletonLoader from "../../Components/SkeletonLoader/skeletonLoader";

export default function TiresWheelsPage() {
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [selectedPartTypes, setSelectedPartTypes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [expandedFilters, setExpandedFilters] = useState({
    price: false,
    partType: false,
    brand: false,
    availability: false,
  });
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);

  const products = [
    {
      id: 1,
      name: "Monroe OESpectrum Front Strut Assembly",
      price: 189.99,
      image: "/api/placeholder/200/200",
      status: "In Stock",
      verified: true,
    },
    {
      id: 2,
      name: "KYB Excel-G Gas Strut - Rear Left - Toyota",
      price: 125.5,
      image: "/api/placeholder/200/200",
      status: "In Stock",
      verified: true,
    },
    {
      id: 3,
      name: "Moog K80673 Front Lower Control Arm",
      price: 245.0,
      image: "/api/placeholder/200/200",
      status: "In Stock",
      verified: true,
    },
    {
      id: 4,
      name: "ACDelco Gold 45G0400 Professional Front",
      price: 38.99,
      image: "/api/placeholder/200/200",
      status: "Low Stock",
      verified: true,
    },
    {
      id: 5,
      name: "Gabriel ReadyMount Loaded Strut Assembly",
      price: 175.75,
      image: "/api/placeholder/200/200",
      status: "In Stock",
      verified: true,
    },
    {
      id: 6,
      name: "Bilstein B4 OE Replacement Shock",
      price: 98.5,
      image: "/api/placeholder/200/200",
      status: "In Stock",
      verified: true,
    },
    {
      id: 7,
      name: "TRW JTC1440 Suspension Control Arm",
      price: 210.2,
      image: "/api/placeholder/200/200",
      status: "In Stock",
      verified: true,
    },
    {
      id: 8,
      name: "Dorman OE Solutions Suspension Stabilizer",
      price: 48.0,
      image: "/api/placeholder/200/200",
      status: "Low Stock",
      verified: true,
    },
  ];

  const partTypes = [
    "Shock Absorbers",
    "Coil Springs",
    "Bushings",
    "Control Arms",
    "Ball Joints",
  ];

  const brands = ["Bosch", "ACDelco", "Monroe", "KYB", "Moog", "Delphi"];

  const toggleFilter = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const togglePartType = (type) => {
    setSelectedPartTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
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

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      {/* Hero Image Section with Overlay */}
      <div className="max-w-7xl mx-auto mb-12 ">
        <div className="relative h-34 md:h-30 lg:h-100 w-full overflow-hidden ">
          <img
            src={slideImage}
            alt="Tires & Wheels Hero"
            className="w-full h-full object-cover"
          />
          {/* Black Overlay */}
          <div className="absolute inset-0 bg-black opacity-50"></div>

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col items-start justify-center text-left px-6 md:px-12">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Tires & Wheels
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-100 max-w-2xl leading-relaxed">
              Find premium tires and wheels to upgrade your vehicle's
              performance and appearance. Browse our selection of quality brands
              for all seasons and vehicle types.
            </p>
          </div>
        </div>
      </div>

      {/* Header Controls */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4 flex gap-2">
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex-1"
            >
              <Filter className="w-4 h-4" />
              {showFiltersMobile ? "Hide" : "Show"} Filters
            </button>
          </div>

          <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
            <div className="hidden md:block">
              <button
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <Filter className="w-4 h-4" />
                {showFiltersMobile ? "Hide" : "Show"} Filters
              </button>
            </div>

            <div className="flex items-center gap-2 md:gap-4 ml-auto">
              <select className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm md:text-base hover:border-gray-400">
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Name: A to Z</option>
                <option>Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Sidebar Filters - Mobile Drawer Style */}
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
            {/* Close button for mobile */}
            <button
              onClick={() => setShowFiltersMobile(false)}
              className="md:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-6 text-gray-800">Filters</h2>

            {/* Price Range Filter */}
            <FilterSection title="Price Range" filterName="price">
              <div className="space-y-4 px-4">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([+e.target.value, priceRange[1]])
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], +e.target.value])
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Max"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1500"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], +e.target.value])
                  }
                  className="w-full accent-yellow-500"
                />
                <p className="text-sm text-gray-600">
                  ${priceRange[0]} - ${priceRange[1]}
                </p>
                <button className="w-full bg-yellow-500 hover:bg-yellow-500 text-black font-semibold py-2 md:py-3 rounded-lg transition-colors">
                  Apply Filters
                </button>
              </div>
            </FilterSection>

            {/* Part Type Filter */}
            <FilterSection title="Part Type" filterName="partType">
              <div className="space-y-2 px-4">
                {partTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPartTypes.includes(type)}
                      onChange={() => togglePartType(type)}
                      className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Brand Filter */}
            <FilterSection title="Brand" filterName="brand">
              <div className="space-y-3 px-4">
                <input
                  type="text"
                  placeholder="Search brands..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </FilterSection>

            {/* Availability Filter */}
            <FilterSection title="Availability" filterName="availability">
              <div className="px-4">
                <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={() => setInStockOnly(!inStockOnly)}
                    className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>
            </FilterSection>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() =>
                    navigate(`/product/${product.id}`, { state: { product } })
                  }
                  className="bg-white hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="aspect-[4/5] bg-gray-200 flex items-center justify-center p-4">
                    <div className="w-full h-full bg-gray-300 rounded flex items-center justify-center text-gray-500 text-xs md:text-sm">
                      Image
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-semibold text-xs md:text-sm text-gray-800 mb-2 line-clamp-2 min-h-8 md:min-h-10">
                      {product.name}
                    </h3>
                    {product.verified && (
                      <div className="flex items-center gap-1 text-xs text-green-600 mb-3">
                        <Check className="w-3 h-3" />
                        <span className="hidden md:inline">
                          Verified by Xpress Autozone
                        </span>
                        <span className="md:hidden">Verified</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-lg md:text-2xl font-bold text-black">
                        GH₵{product.price.toFixed(2)}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
                          product.status === "In Stock"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {product.status === "In Stock"
                          ? "In Stock"
                          : "Low Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
