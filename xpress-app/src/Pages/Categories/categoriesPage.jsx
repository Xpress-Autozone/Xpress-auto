import React from "react";
import {
  Package,
  Wrench,
  Circle,
  Battery,
  Car,
  Settings,
  Zap,
} from "lucide-react";
import slideImage from "../../assets/productsStrip.jpg";
import { useNavigate } from "react-router-dom";

export default function CategoriesPage() {
  const navigate = useNavigate();

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

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full py-16 lg:py-16">
      {/* Hero Image Section with Overlay */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="relative h-34 md:h-30 lg:h-100 w-full overflow-hidden shadow-lg">
          <img
            src={slideImage}
            alt="All Categories"
            className="w-full h-full object-cover"
          />
          {/* Black Overlay */}
          <div className="absolute inset-0 bg-black opacity-50"></div>

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Browse All Categories
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-gray-100 max-w-2xl leading-relaxed">
              Explore our complete selection of auto parts across all
              categories. Find exactly what you need from our verified
              collection.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Categories Section */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                ALL CATEGORIES
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

        {/* Info Section */}
        <div className="bg-white rounded-2xl p-5 md:p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
              Why Browse Categories?
            </h2>
          </div>

          {/* Trust Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Card 1: Organized Selection */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-50">
              <div className="text-4xl mb-4 text-center">📂</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Organized Selection
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Browse parts by category for an organized and efficient shopping
                experience. Find what you need faster.
              </p>
            </div>

            {/* Card 2: Verified Quality */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-50">
              <div className="text-4xl mb-4 text-center">✓</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Verified Quality
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Every part across all categories is verified by our expert team
                for authenticity and quality assurance.
              </p>
            </div>

            {/* Card 3: Expert Support */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-50">
              <div className="text-4xl mb-4 text-center">💬</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Expert Support
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Need help choosing the right part? Our expert team is here to
                guide you through each category.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
