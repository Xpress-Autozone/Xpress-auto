import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: "Body & Parts", route: "/body-chassis" },
  { name: "Engine & Performance", route: "/engine-performance" },
  { name: "Wheels & Tires", route: "/wheels-tires" },
  { name: "Lighting & Electronics", route: "/lighting-electronics" },
  { name: "Accessories", route: "/accessories" },
  { name: "Fluids & Car Care", route: "/fluids-care" },
  { name: "Automotive Tools", route: "/automotive-tools" },
  { name: "Cooling & AC", route: "/cooling-ac" }
];

export default function CategoryDropdown({ currentCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (route) => {
    navigate(route);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-white hover:text-yellow-500 transition-colors"
      >
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            {categories.map((category) => (
              <button
                key={category.route}
                onClick={() => handleCategoryClick(category.route)}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                  currentCategory === category.name
                    ? 'bg-black text-white'
                    : 'text-gray-900 hover:bg-gray-100 hover:text-black'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
