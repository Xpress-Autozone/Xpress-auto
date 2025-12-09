import React, { useState, useEffect } from "react";
import {
  Package,
  Wrench,
  Circle,
  Battery,
  Car,
  Settings,
  Zap,
  Check,
  ArrowRight,
} from "lucide-react";
import slideImage from "../../assets/slide.jpg";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../../Components/SkeletonLoader/skeletonLoader";

function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const categories = [
    {
      icon: <Package className="h-6 w-6" />,
      name: "Engine Parts",
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      name: "Suspension & Steering",
    },
    {
      icon: <Circle className="h-6 w-6" />,
      name: "Tires & Wheels",
    },
    {
      icon: <Battery className="h-6 w-6" />,
      name: "Electrical Components",
    },
    {
      icon: <Car className="h-6 w-6" />,
      name: "Brakes",
    },
    {
      icon: <Settings className="h-6 w-6" />,
      name: "Exhaust Systems",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      name: "Interior Accessories",
    },
    {
      icon: <Circle className="h-6 w-6" />,
      name: "Exterior Accessories",
    },
  ];

  const products = [
    {
      id: 1,
      name: "Monroe OESpectrum Front Strut Assembly",
      price: 189.99,
      status: "In Stock",
      verified: true,
    },
    {
      id: 2,
      name: "KYB Excel-G Gas Strut - Rear Left - Toyota",
      price: 125.5,
      status: "In Stock",
      verified: true,
    },
    {
      id: 3,
      name: "Moog K80673 Front Lower Control Arm",
      price: 245.0,
      status: "In Stock",
      verified: true,
    },
    {
      id: 4,
      name: "ACDelco Gold 45G0400 Professional Front",
      price: 38.99,
      status: "Low Stock",
      verified: true,
    },
    {
      id: 5,
      name: "Gabriel ReadyMount Loaded Strut Assembly",
      price: 175.75,
      status: "In Stock",
      verified: true,
    },
    {
      id: 6,
      name: "Bilstein B4 OE Replacement Shock",
      price: 98.5,
      status: "In Stock",
      verified: true,
    },
  ];

  const handleNavigate = () => {
    navigate("/xplore");
  };

  const handleCategoryClick = (categoryName) => {
    const categoryRoutes = {
      "Engine Parts": "/engine-parts",
      "Suspension & Steering": "/suspension-steering",
      "Tires & Wheels": "/tires-wheels",
      "Electrical Components": "/electrical-components",
      Brakes: "/brakes",
      "Exhaust Systems": "/exhaust-systems",
      "Interior Accessories": "/interior-accessories",
      "Exterior Accessories": "/exterior-accessories",
    };
    navigate(categoryRoutes[categoryName]);
  };

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full py-16 lg:py-16 ">
      {/* Hero Image Section with Overlay */}
      <div className="max-w-7xl mx-auto mb-12 ">
        <div className="relative h-64 md:h-80 lg:h-100 w-full overflow-hidden shadow-lg ">
          <img
            src={slideImage}
            alt="Xpress Auto Hero"
            className="w-full h-full object-cover "
          />
          {/* Black Overlay */}
          <div className="absolute inset-0 bg-black opacity-50"></div>

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 rounded-2xl">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Discover Quality Parts, Verified by 
              
             <span className="text-yellow-500"> Xpress AutoZone</span> 
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-100 mb-6 max-w-2xl leading-relaxed">
              Every part listed goes through a rigorous admin review process,
              ensuring authenticity, quality, and your satisfaction.
              Shop with confidence on Ghana's premier Aftermarket platform for Vehicle parts.
            </p>
            <button
              onClick={handleNavigate}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 md:py-3 px-6 md:px-8 rounded-lg transition-colors duration-300 text-base md:text-lg shadow-lg hover:shadow-xl"
            >
              Shop Verified Parts
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Categories Section */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                CATEGORIES
              </h2>
            </div>
            <div className="h-1.5 w-24 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mt-3 shadow-sm"></div>
          </div>

          {/* Categories List - Desktop */}
          <div className="hidden md:block">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <div key={index}>
                  <button
                    onClick={() => handleCategoryClick(category.name)}
                    className="flex items-center space-x-4 text-left w-full p-4 h-20 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-50 hover:shadow-md transition-all duration-300 group border border-gray-100 hover:border-yellow-200"
                  >
                    <span className="text-gray-600 group-hover:text-yellow-300 flex-shrink-0 transition-colors duration-300">
                      {category.icon}
                    </span>
                    <span className="text-gray-700 group-hover:text-gray-900 font-medium text-sm lg:text-base transition-colors duration-300">
                      {category.name}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Categories Grid - Mobile */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryClick(category.name)}
                  className="bg-gradient-to-br from-white to-gray-50 h-24 flex flex-col items-center justify-center rounded-xl shadow-md hover:shadow-lg hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
                >
                  <div className="mb-2 text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                    {category.icon}
                  </div>
                  <span className="text-xs text-center font-medium text-gray-700 group-hover:text-gray-900 px-2 leading-tight transition-colors duration-300">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Featured Parts */}
        <div className="bg-white rounded-2xl  p-6 md:p-12 text-center mt-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6 leading-tight">
              Featured Auto Parts
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mx-auto mb-6"></div>
          </div>

          {/* Products Grid */}
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
                      {product.status === "In Stock" ? "In Stock" : "Low Stock"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* View All Featured Products Button */}
          <button
            onClick={() => navigate("/xplore/featured")}
            className="mt-8 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 md:py-3 px-6 md:px-8 rounded-lg transition-colors duration-300 text-base md:text-lg shadow-lg hover:shadow-xl mx-auto"
          >
            View All Featured Products
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>{" "}
        

        
        {/* Xplore Autozone CTA Section */}
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Discover More with Xplore
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Explore our curated collections of featured products, trending items, and new arrivals. Find exactly what you need.
          </p>
          <button
            onClick={() => navigate("/xplore")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 md:py-3 px-6 md:px-8 rounded-lg transition-colors duration-300 text-base md:text-lg shadow-lg hover:shadow-xl"
          >
            Xplore Autozone
          </button>
        </div>

        <div className=" bg-white rounded-2xl  p-5 md:p-12 text-center mt-3">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent  leading-tight">
              Why choose Xpress AutoZone?
            </h2>
          </div>

          
          {/* Trust Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Card 1: Admin Reviewed Parts */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-xl p-6  hover:shadow-lg transition-shadow duration-300 border border-gray-50">
              <div className="text-4xl mb-4 text-center"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Admin Reviewed Parts
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Every single component is meticulously inspected and verified by
                our expert team for authenticity and condition.
              </p>
            </div>

            {/* Card 2: Uncompromised Quality */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-xl p-6  hover:shadow-lg transition-shadow duration-300 border border-gray-50">
              <div className="text-4xl mb-4 text-center"></div>
              <h3 className="text-xl font-bold text-gray-800 ">
                Uncompromised Quality
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                We ensure that all listed parts meet stringent quality
                standards, providing you with reliable and durable solutions.
              </p>
            </div>

            {/* Card 3: Buyer Protection Guarantee */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-xl p-6  hover:shadow-lg transition-shadow duration-300 border border-gray-50">
              <div className="text-4xl mb-4 text-center"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Buyer Protection Guarantee
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your satisfaction is our priority. Our robust protection ensures
                a secure and worry-free purchasing experience.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
