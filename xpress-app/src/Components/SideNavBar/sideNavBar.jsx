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

const CategoriesSidebar = () => {
    const [isMobile, setIsMobile] = React.useState(false);

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
      icon: <Package className="h-6 w-6" />,
      name: "Exhaust Systems"
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      name: "Interior Accessories"
    },
    {
      icon: <Circle className="h-6 w-6" />,
      name: "Exterior Accessories"
    }
  ];

  return (
    <div className=" bg-white border border-gray-200 rounded-lg shadow-sm h-full fixed top-17 left-0">
      {/* Header */}
      <div className="p-4 border-b border-purple-300 mt-6">
        <h2 className="text-lg font-semibold text-gray-800 bg-purple-100 border-2 border-purple-300 px-3 py-2 inline-block">
          CATEGORIES
        </h2>
      </div>

      {/* Categories List */}
      <div className="p-4">
        <ul className="space-y-4">
          {categories.map((category, index) => (
            <li key={index}>
              <button className="flex items-center space-x-3 text-left w-full p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 group">
                <span className="text-gray-600 group-hover:text-gray-800 flex-shrink-0">
                  {category.icon}
                </span>
                <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                  {category.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoriesSidebar;