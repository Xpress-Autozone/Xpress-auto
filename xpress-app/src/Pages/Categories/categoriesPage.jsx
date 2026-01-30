import React from "react";
import { ArrowRight } from "lucide-react";
import slideImage from "../../assets/productsStrip.jpg";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../Components/Search/searchBar";
import SEO from "../../lib/SEOHelper";
import { getPageMetadata } from "../../data/pageMetadata";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const metadata = getPageMetadata('categories');
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories' }
  ];

  const searchPlaceholders = [
    "Search for auto parts…",
    "Try: 'brake pads for Corolla 2012'",
    "Type: 'Toyota filters under 80 cedis'",
    "Ask like a human… it works."
  ];

  const categories = [
    {
      icon: <img src="/assets/icons/parts.png" alt="Body & Parts" className="h-6 w-6" />,
      name: "Body & Parts",
      id: "body-chassis",
      description: "Brakes, suspension, and body components"
    },
    {
      icon: <img src="/assets/icons/engine.png" alt="Engine & Performance" className="h-6 w-8" />,
      name: "Engine & Performance",
      id: "engine-performance",
      description: "Engine parts and performance upgrades"
    },
    {
      icon: <img src="/assets/icons/wheel.png" alt="Wheels & Tires" className="h-6 w-6" />,
      name: "Wheels & Tires",
      id: "wheels-tires",
      description: "Tires, rims, and wheel accessories"
    },
    {
      icon: <img src="/assets/icons/battery.png" alt="Lighting & Electronics" className="h-6 w-9" />,
      name: "Lighting & Electronics",
      id: "lighting-electronics",
      description: "Lights, audio, and vehicle electronics"
    },
    {
      icon: <img src="/assets/icons/steer.png" alt="Accessories" className="h-6 w-6" />,
      name: "Accessories",
      id: "accessories",
      description: "Interior and exterior vehicle accessories"
    },
    {
      icon: <img src="/assets/icons/tools.png" alt="Automotive Tools" className="h-6 w-6" />,
      name: "Automotive Tools",
      id: "automotive-tools",
      description: "Professional and DIY auto repair tools"
    },
    {
      icon: <img src="/assets/icons/fluids.png" alt="Fluids & Car Care" className="h-8 w-8" />,
      name: "Fluids & Car Care",
      id: "fluids-care",
      description: "Oils, cleaners, and maintenance products"
    },
    {
      icon: <img src="/assets/icons/cooling.png" alt="Cooling & AC" className="h-7 w-7" />,
      name: "Cooling & AC",
      id: "cooling-ac",
      description: "Radiators, compressors, and AC components"
    },
  ];

  const handleCategoryClick = (id) => {
    navigate(`/${id}`);
  };

  return (
    <div className="bg-white min-h-screen w-full">
      <SEO
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
        ogUrl={metadata.url}
        ogImage={metadata.ogImage}
        ogType={metadata.ogType}
        canonicalUrl={metadata.url}
        breadcrumbs={breadcrumbs}
      />
      {/* Hero Section - Consistently Flat & Bold */}
      <section className="relative h-[300px] md:h-[400px] w-full bg-black overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${slideImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center text-white">
          <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Official Catalog</span>
          <h1 className="text-4xl md:text-7xl font-black mb-4 uppercase italic tracking-tighter">
            BROWSE <br />
            <span className="text-gray-300">CATEGORIES</span>
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-lg font-medium border-l-2 border-yellow-500 pl-4">
            Explore our complete selection of verified auto parts.
            Sourced from trusted suppliers and inspected for Ghana's roads.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Main Categories Grid */}
        <div className="border border-gray-100 p-1 md:p-1 mb-16">
          <div className="p-6 md:p-8 bg-white">
            <div className="mb-10">
              <h2 className="text-2xl md:text-4xl font-black text-black tracking-tighter italic uppercase">
                Inventory Index
              </h2>
              <div className="h-1.5 w-20 bg-yellow-500 mt-2"></div>
            </div>

            {/* Flat Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-gray-100">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryClick(category.id)}
                  className="flex flex-col items-start text-left p-8 border-r border-b border-gray-100 hover:bg-gray-50 transition-all group relative overflow-hidden"
                >
                  <div className="text-gray-400 group-hover:text-black group-hover:scale-110 transition-all duration-300 mb-6">
                    {category.icon}
                  </div>
                  <div>
                    <span className="text-black font-black text-sm uppercase tracking-widest block mb-2">
                      {category.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed block max-w-[200px]">
                      {category.description}
                    </span>
                  </div>
                  <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-gray-200 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Xpress Search Integration */}
        <div className="max-w-4xl mx-auto bg-gray-50 border border-gray-100 p-10 md:p-16 text-center">
          <span className="inline-block bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 mb-6">
            Smart Assistant
          </span>
          <h3 className="text-2xl md:text-4xl font-black text-black uppercase italic tracking-tighter mb-4">
            Can't find a specific part?
          </h3>
          <p className="text-gray-500 text-sm md:text-base font-medium mb-10 max-w-xl mx-auto">
            Our <span className="text-black font-bold">Xpress Search</span> understands natural language.
            Try searching by car model, part name, or price range.
          </p>
          <div className="max-w-md mx-auto relative z-20">
            <SearchBar placeholders={searchPlaceholders} />
          </div>
        </div>
      </div>
    </div>
  );
}