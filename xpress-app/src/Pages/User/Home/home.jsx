import React from 'react';
import {
  Package,
  Wrench,
  Circle,
  Battery,
  Car,
  Settings,
  Zap
} from 'lucide-react';
import slideImage from '../../../assets/slide.jpg';

function Home() {
  const categories = [
    {
      icon: <Package className="h-6 w-6" />,
      name: "Engine Parts"
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      name: "Suspension & Steering"
    },
    {
      icon: <Circle className="h-6 w-6" />,
      name: "Tires & Wheels"
    },
    {
      icon: <Battery className="h-6 w-6" />,
      name: "Electrical Components"
    },
    {
      icon: <Car className="h-6 w-6" />,
      name: "Brakes"
    },
    {
      icon: <Settings className="h-6 w-6" />,
      name: "Exhaust Systems"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      name: "Interior Accessories"
    },
    {
      icon: <Circle className="h-6 w-6" />,
      name: "Exterior Accessories"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full py-17 lg:py-20 px-4 md:px-8 lg:px-12">
       
      {/* Hero Image Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="h-64 md:h-80 lg:h-96 w-full overflow-hidden shadow-lg">
          <img 
            src={slideImage} 
            alt="Xpress Auto Hero" 
            className="w-full h-full object-cover "
          />
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
                  <button className="flex items-center space-x-4 text-left w-full p-4 h-20 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-50 hover:shadow-md transition-all duration-300 group border border-gray-100 hover:border-yellow-200">
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

        {/* Main Content */}
        <div className="bg-white rounded-2xl  p-8 md:p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6 leading-tight">
              Welcome to Xpress Auto!
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Your one-stop solution for all your automotive needs. Experience premium quality parts and exceptional service that keeps you moving forward.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;