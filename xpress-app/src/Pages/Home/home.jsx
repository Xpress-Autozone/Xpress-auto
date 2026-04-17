import React, { useState, useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import slideImage from "../../assets/slide.webp";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../../Components/SkeletonLoader/skeletonLoader";
import { getAllProducts } from "../../lib/productService";
import ProductCard from "../../Components/ProductCard/ProductCard";

function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    {
      icon: (
        <img
          src="/assets/category-icons/body-parts.webp"
          alt="Body & Parts"
          className="h-12 w-12 object-contain"
        />
      ),
      name: "Body & Parts",
      description: "Brakes, suspension, and body components",
    },
    {
      icon: (
        <img
          src="/assets/category-icons/engine-performance.webp"
          alt="Engine & Performance"
          className="h-12 w-12 object-contain"
        />
      ),
      name: "Engine & Performance",
      description: "Engine parts and performance upgrades",
    },
    {
      icon: (
        <img
          src="/assets/category-icons/wheels-tires.webp"
          alt="Wheels & Tires"
          className="h-12 w-12 object-contain"
        />
      ),
      name: "Wheels & Tires",
      description: "Tires, rims, and wheel accessories",
    },
    {
      icon: (
        <img
          src="/assets/category-icons/lighting-electronics.webp"
          alt="Lighting & Electronics"
          className="h-12 w-12 object-contain"
        />
      ),
      name: "Lighting & Electronics",
      description: "Lights, audio, and vehicle electronics",
    },
    {
      icon: (
        <img
          src="/assets/category-icons/accessories.webp"
          alt="Accessories"
          className="h-12 w-12 object-contain"
        />
      ),
      name: "Accessories",
      description: "Interior and exterior vehicle accessories",
    },
    {
      icon: (
        <img
          src="/assets/category-icons/automotive-tools.webp"
          alt="Automotive Tools"
          className="h-12 w-12 object-contain"
        />
      ),
      name: "Automotive Tools",
      description: "Professional and DIY auto repair tools",
    },
    {
      icon: (
        <img
          src="/assets/category-icons/fluids-car-care.webp"
          alt="Fluids & Car Care"
          className="h-12 w-12 object-contain"
        />
      ),
      name: "Fluids & Car Care",
      description: "Oils, cleaners, and maintenance products",
    },
    {
      icon: (
        <img
          src="/assets/category-icons/cooling-ac.webp"
          alt="Cooling & AC"
          className="h-12 w-12 object-contain"
        />
      ),
      name: "Cooling & AC",
      description: "Radiators, compressors, and AC components",
    },
  ];

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setProductsLoading(true);
      try {
        console.log("[Home] 🚀 Fetching featured products");
        const data = await getAllProducts({
          limit: 6,
          page: 1,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        console.log("[Home] 📦 API response:", data);
        if (data.success && data.data && data.data.length > 0) {
          setFeaturedProducts(
            data.data.map((p) => ({
              id: p.id,
              name: p.itemName,
              price: parseFloat(p.price) || 0,
              status: p.quantity > 0 ? "In Stock" : "Low Stock",
              verified: true,
              image: p.mainImage?.url || p.imageUrl || "/api/placeholder/200/200",
              additionalImages: p.additionalImages || []
            })),
          );
        } else {
          console.warn("[Home] ⚠️ No featured products found, using fallback");
          setFeaturedProducts([]);
        }
      } catch (error) {
        console.error("[Home] ❌ Error fetching featured products:", error);
        setFeaturedProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const products = featuredProducts;

  const handleNavigate = () => {
    navigate("/xplore");
  };

  const handleCategoryClick = (categoryName) => {
    const categoryRoutes = {
      "Body & Parts": "/body-chassis",
      "Engine & Performance": "/engine-performance",
      "Wheels & Tires": "/wheels-tires",
      "Lighting & Electronics": "/lighting-electronics",
      Accessories: "/accessories",
      "Fluids & Car Care": "/fluids-care",
      "Automotive Tools": "/automotive-tools",
      "Cooling & AC": "/cooling-ac",
    };
    navigate(categoryRoutes[categoryName]);
  };

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  // --- HERO SEQUENCE CONFIGURATION ---
  const heroSequence = [
    {
      id: "phase-0",
      mediaType: "image",
      mediaSrc: slideImage,
      h1: (
        <>
          DISCOVER <br />
          <span className="text-gray-300">QUALITY PARTS</span>
        </>
      ),
      subtitle: "Ghana's premier marketplace for authentic, admin-verified automotive components.",
      durationMs: 5000, // Updated to 5 seconds
    },
    {
      id: "phase-1",
      mediaType: "video",
      mediaBase: "1. 3d-rendered-orange-colored-super-car-running-on-street-at_34634300",
      h1: (
        <>
          ELEVATE <br />
          <span className="text-gray-300">PERFORMANCE</span>
        </>
      ),
      subtitle: "High-octane upgrades and elite body parts designed for the modern driving experience.",
      durationMs: 6000,
    },
    {
      id: "phase-2",
      mediaType: "video",
      mediaBase: "2. yellow car engine video upclose",
      h1: (
        <>
          PRECISION <br />
          <span className="text-gray-300">ENGINEERING</span>
        </>
      ),
      subtitle: "Meticulously inspected engine components and professional tools for uncompromised reliability.",
      durationMs: 5000,
    },
    {
      id: "phase-3",
      mediaType: "video",
      mediaBase: "3. OIG1",
      h1: (
        <>
          SHOP WITH <br />
          <span className="text-gray-300">TOTAL CONFIDENCE</span>
        </>
      ),
      subtitle: "Every part is rigorously reviewed by our experts to ensure the highest standards of quality.",
      durationMs: 5000,
    }
  ];

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  // Timer logic for cycling through the hero sequence
  useEffect(() => {
    const currentPhase = heroSequence[currentPhaseIndex];
    const timer = setTimeout(() => {
      setCurrentPhaseIndex((prevIndex) => (prevIndex + 1) % heroSequence.length);
    }, currentPhase.durationMs);

    return () => clearTimeout(timer);
  }, [currentPhaseIndex]);

  return (
    <div className="bg-white min-h-screen w-full">
      {/* HERO SECTION WITH DYNAMIC SEQUENCE */}
      <section className="relative h-[450px] md:h-[550px] w-full bg-black overflow-hidden">
        {/* MEDIA LAYERS: Render all so they preload, cross-fade with opacity */}
        {heroSequence.map((phase, index) => {
          const isActive = index === currentPhaseIndex;
          return (
            <div
              key={phase.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-60" : "opacity-0"
              }`}
            >
              {phase.mediaType === "image" ? (
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${phase.mediaSrc})` }}
                />
              ) : (
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                >
                  <source src={`/assets/videos/${phase.mediaBase}.webm`} type="video/webm" />
                  <source src={`/assets/videos/${phase.mediaBase}.mp4`} type="video/mp4" />
                </video>
              )}
            </div>
          );
        })}

        {/* PERSISTENT DARK OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center text-white">
          <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
            Verified by Xpress AutoZone
          </span>

          <div className="relative h-32 md:h-48 mb-6 overflow-hidden">
            {/* TEXT ANIMATION: Cross-fade H1 layers */}
            {heroSequence.map((phase, index) => {
              const isActive = index === currentPhaseIndex;
              return (
                <h1
                  key={`h1-${phase.id}`}
                  className={`absolute inset-0 text-4xl md:text-8xl font-black leading-[0.9] uppercase italic tracking-tighter transition-all duration-1000 ease-in-out ${
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                >
                  {phase.h1}
                </h1>
              );
            })}
          </div>

          <div className="relative h-24 mb-10 max-w-2xl border-l-2 border-yellow-500 pl-4">
            {/* TEXT ANIMATION: Cross-fade Subtitle layers */}
            {heroSequence.map((phase, index) => {
              const isActive = index === currentPhaseIndex;
              return (
                <p 
                  key={`sub-${phase.id}`}
                  className={`absolute inset-0 text-base md:text-lg text-gray-300 font-medium leading-relaxed transition-all duration-1000 ease-in-out ${
                    isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                  }`}
                >
                  {phase.subtitle}
                </p>
              );
            })}
          </div>
          
          <button
            onClick={handleNavigate}
            className="w-fit bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black font-black uppercase italic tracking-[0.2em] text-xs md:text-sm py-3 px-8 md:py-5 md:px-12 transition-all duration-500 shadow-[0_10px_30px_rgba(234,179,8,0.25)] hover:shadow-[0_15px_40px_rgba(234,179,8,0.4)] hover:scale-105 active:scale-95 border-2 border-black/10 group flex items-center gap-3"
          >
            Shop Verified Parts <ArrowRight className="group-hover:translate-x-1 transition-transform w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </section>

      {/* REMAINDER OF HOME PAGE */}
      <div className="max-w-7xl mx-auto px-4 md:px-2 py-10">
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
                className="flex items-center space-x-4 text-left w-full p-4 h-24 border border-gray-100 hover:border-black transition-all group overflow-hidden"
              >
                <span className="text-gray-400 group-hover:text-black transition-all transform scale-125 group-hover:scale-[1.4] duration-500">
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
                className="border border-gray-100 p-4 flex flex-col items-center text-center group overflow-hidden"
              >
                <div className="mb-3 text-gray-400 group-hover:text-black transition-all transform scale-[1.3] group-hover:scale-[1.5] duration-500">
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
        <div className="bg-white border border-gray-100 p-3 md:p-12 text-center mt-4">
          <div className="max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-black uppercase italic tracking-tighter mb-4">
              Featured Auto Parts
            </h2>
            <div className="h-1 w-32 bg-yellow-500 mx-auto"></div>
          </div>

          {productsLoading ? (
            <div className="py-20 text-center">
              <p className="text-gray-500 font-medium">
                Loading featured products...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-500 font-medium text-lg">
                No products found
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Check back soon for featured items
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="featured"
                />
              ))}
            </div>
          )}

          {products.length > 0 && (
            <button
              onClick={() => navigate("/xplore/featured")}
              className="mt-12 flex items-center justify-center gap-3 bg-yellow-500 text-black font-black uppercase italic tracking-[0.2em] text-xs py-5 px-10 hover:bg-black hover:text-white transition-colors mx-auto"
            >
              View All Featured Products <ArrowRight size={16} />
            </button>
          )}
        </div>

        {/* CTA Section */}
        <div className="py-20 text-center border-b border-gray-100">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter mb-6">
            Discover More with Xplore
          </h2>
          <p className="text-gray-500 font-medium text-base md:text-lg mb-10 max-w-2xl mx-auto">
            Explore curated collections of trending items and new arrivals. Find
            exactly what your vehicle needs to perform at its peak.
          </p>
          <button
            onClick={() => navigate("/xplore")}
            className="bg-yellow-500 text-black font-black uppercase italic tracking-[0.2em] text-sm py-4 px-12 hover:bg-black hover:text-white transition-all"
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
              <h3 className="text-sm font-black text-black uppercase tracking-widest mb-4">
                Admin Reviewed
              </h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Meticulously inspected and verified by our expert team for
                authenticity and condition.
              </p>
            </div>
            <div className="p-10 border-b md:border-b-0 md:border-r border-gray-100 hover:bg-gray-50 transition-colors">
              <h3 className="text-sm font-black text-black uppercase tracking-widest mb-4">
                Uncompromised Quality
              </h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Stringent quality standards, providing you with reliable and
                durable automotive solutions.
              </p>
            </div>
            <div className="p-10 hover:bg-gray-50 transition-colors">
              <h3 className="text-sm font-black text-black uppercase tracking-widest mb-4">
                Buyer Protection
              </h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Your satisfaction is our priority. Secure and worry-free
                purchasing experience guaranteed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
