import React, { useState, useEffect } from "react";
import {
  Car,
  Wrench,
  Circle,
  Zap,
  Settings,
  Droplets,
  Check,
  ArrowRight,
  Snowflake,
  Sparkles
} from "lucide-react";
import slideImage from "../../assets/slide.jpg";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../../Components/SkeletonLoader/skeletonLoader";

function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    {
      icon: <img src="/assets/icons/parts.png" alt="Body & Parts" className="h-6 w-6" />,
      name: "Body & Parts",
      description: "Brakes, suspension, and body components"
    },
    {
      icon: <Settings className="h-6 w-6" />,
      name: "Engine & Performance",
      description: "Engine parts and performance upgrades"
    },
    {
      icon: <Circle className="h-6 w-6" />,
      name: "Wheels & Tires",
      description: "Tires, rims, and wheel accessories"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      name: "Lighting & Electronics",
      description: "Lights, audio, and vehicle electronics"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      name: "Accessories",
      description: "Interior and exterior vehicle accessories"
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      name: "Automotive Tools",
      description: "Professional and DIY auto repair tools"
    },
    {
      icon: <Droplets className="h-6 w-6" />,
      name: "Fluids & Car Care",
      description: "Oils, cleaners, and maintenance products"
    },
    {
      icon: <Snowflake className="h-6 w-6" />,
      name: "Cooling & AC",
      description: "Radiators, compressors, and AC components"
    },
  ];

  const products = [
    { id: 1, name: "Monroe OESpectrum Front Strut Assembly", price: 189.99, status: "In Stock", verified: true },
    { id: 2, name: "KYB Excel-G Gas Strut - Rear Left - Toyota", price: 125.5, status: "In Stock", verified: true },
    { id: 3, name: "Moog K80673 Front Lower Control Arm", price: 245.0, status: "In Stock", verified: true },
    { id: 4, name: "ACDelco Gold 45G0400 Professional Front", price: 38.99, status: "Low Stock", verified: true },
    { id: 5, name: "Gabriel ReadyMount Loaded Strut Assembly", price: 175.75, status: "In Stock", verified: true },
    { id: 6, name: "Bilstein B4 OE Replacement Shock", price: 98.5, status: "In Stock", verified: true },
  ];

  const handleNavigate = () => { navigate("/xplore"); };

  const handleCategoryClick = (categoryName) => {
    const categoryRoutes = {
      "Body & Parts": "/body-chassis",
      "Engine & Performance": "/engine-performance",
      "Wheels & Tires": "/wheels-tires",
      "Lighting & Electronics": "/lighting-electronics",
      "Accessories": "/accessories",
      "Fluids & Car Care": "/fluids-care",
      "Automotive Tools": "/automotive-tools",
      "Cooling & AC": "/cooling-ac"
    };
    navigate(categoryRoutes[categoryName]);
  };

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  if (isLoading) { return <SkeletonLoader />; }

  return (
    <div className="bg-white min-h-screen w-full">
      
      {/* NEW XPLORE-STYLE HERO SECTION */}
      <section className="relative h-[450px] md:h-[550px] w-full bg-black overflow-hidden">
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: `url(${slideImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center text-white">
            <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-xs mb-4">
              Verified by Xpress AutoZone
            </span>
            <h1 className="text-4xl md:text-8xl font-black mb-6 leading-[0.9] uppercase italic tracking-tighter">
                DISCOVER <br/>
                <span className="text-gray-300">QUALITY PARTS</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 mb-10 max-w-2xl font-medium border-l-2 border-yellow-500 pl-4 leading-relaxed">
                Every part goes through a rigorous inspection. Shop with total confidence on 
                Ghana's premier aftermarket platform for authentic vehicle components.
            </p>
            <button
              onClick={handleNavigate}
              className="w-fit bg-yellow-500 hover:bg-black hover:text-white text-black font-black uppercase italic tracking-[0.2em] text-sm py-4 px-10 transition-all duration-300"
            >
              Shop Verified Parts
            </button>
        </div>
      </section>

      {/* REMAINDER OF HOME PAGE */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Categories Section */}
        <div className="bg-white border border-gray-100 p-6 md:p-8 mb-12">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter italic uppercase">
              CATEGORIES
            </h2>
            <div className="h-1.5 w-24 bg-yellow-500 mt-2"></div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category.name)}
                className="flex items-center space-x-4 text-left w-full p-4 h-24 border border-gray-100 hover:border-black transition-all group"
              >
                <span className="text-gray-400 group-hover:text-black transition-colors">
                  {category.icon}
                </span>
                <div>
                  <span className="text-black font-bold text-sm uppercase tracking-tight block">
                    {category.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    {category.description}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Mobile Grid */}
          <div className="md:hidden grid grid-cols-2 gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category.name)}
                className="border border-gray-100 p-4 flex flex-col items-center text-center group"
              >
                <div className="mb-2 text-gray-400 group-hover:text-black">
                  {category.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight text-gray-900 leading-tight">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Parts Section */}
        <div className="bg-white border border-gray-100 p-6 md:p-12 text-center mt-4">
          <div className="max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-black uppercase italic tracking-tighter mb-4">
              Featured Auto Parts
            </h2>
            <div className="h-1 w-32 bg-yellow-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
                className="bg-white border border-gray-100 hover:border-black transition-all cursor-pointer group text-left"
              >
                <div className="aspect-[4/5] bg-gray-50 flex items-center justify-center p-6 border-b border-gray-50">
                   <div className="text-gray-300 font-black uppercase tracking-widest text-xs">Image</div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-xs md:text-sm text-gray-900 uppercase tracking-tight mb-2 line-clamp-2 h-10">
                    {product.name}
                  </h3>
                  {product.verified && (
                    <div className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase mb-3">
                      <Check className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <span className="text-xl font-black italic">GH₵{product.price.toFixed(2)}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 w-fit border ${
                      product.status === "In Stock" ? "border-green-500 text-green-600" : "border-orange-500 text-orange-600"
                    }`}>
                      {product.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/xplore/featured")}
            className="mt-12 flex items-center justify-center gap-3 bg-black text-white font-black uppercase italic tracking-[0.2em] text-xs py-5 px-10 hover:bg-yellow-500 hover:text-black transition-colors mx-auto"
          >
            View All Featured Products <ArrowRight size={16} />
          </button>
        </div>

        {/* CTA Section */}
        <div className="py-20 text-center border-b border-gray-100">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter mb-6">
            Discover More with Xplore
          </h2>
          <p className="text-gray-500 font-medium text-base md:text-lg mb-10 max-w-2xl mx-auto">
            Explore curated collections of trending items and new arrivals. 
            Find exactly what your vehicle needs to perform at its peak.
          </p>
          <button
            onClick={() => navigate("/xplore")}
            className="bg-black text-white font-black uppercase italic tracking-[0.2em] text-sm py-4 px-12 hover:bg-yellow-500 hover:text-black transition-all"
          >
            Xplore Autozone
          </button>
        </div>

        {/* Trust Section */}
        <div className="py-20">
          <h2 className="text-3xl md:text-4xl font-black text-black uppercase italic tracking-tighter text-center mb-16">
            Why choose Xpress AutoZone?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-100">
            <div className="p-10 border-b md:border-b-0 md:border-r border-gray-100 hover:bg-gray-50 transition-colors">
              <h3 className="text-sm font-black text-black uppercase tracking-widest mb-4">Admin Reviewed</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Meticulously inspected and verified by our expert team for authenticity and condition.
              </p>
            </div>
            <div className="p-10 border-b md:border-b-0 md:border-r border-gray-100 hover:bg-gray-50 transition-colors">
              <h3 className="text-sm font-black text-black uppercase tracking-widest mb-4">Uncompromised Quality</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Stringent quality standards, providing you with reliable and durable automotive solutions.
              </p>
            </div>
            <div className="p-10 hover:bg-gray-50 transition-colors">
              <h3 className="text-sm font-black text-black uppercase tracking-widest mb-4">Buyer Protection</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Your satisfaction is our priority. Secure and worry-free purchasing experience guaranteed.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;