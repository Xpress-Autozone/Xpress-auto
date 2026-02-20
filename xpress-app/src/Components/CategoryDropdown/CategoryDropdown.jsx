import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: "Body & Parts", route: "/body-chassis" },
  { name: "Engine & Performance", route: "/engine-performance" },
  { name: "Wheels & Tires", route: "/wheels-tires" },
  { name: "Lighting & Electronics", route: "/lighting-electronics" },
  { name: "Accessories", route: "/accessories" },
  { name: "Automotive Tools", route: "/automotive-tools" },
  { name: "Fluids & Car Care", route: "/fluids-care" },
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
    const handleTouchOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleTouchOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleTouchOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="inline-block overflow-visible">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 text-white hover:text-yellow-500 transition-all duration-300 font-black uppercase italic tracking-widest text-[10px]"
      >
        <span className="hidden sm:inline-block sm:max-w-0 sm:overflow-hidden sm:whitespace-nowrap sm:opacity-0 sm:group-hover:max-w-[140px] sm:group-hover:opacity-100 sm:transition-all sm:duration-300">
          Change Category
        </span>
        <ChevronDown className={`w-7 h-7 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="
          absolute top-full left-0 mt-2 
          w-60 bg-grey/95 backdrop-blur-md 
          border border-white/10 z-[100] 
          max-h-[60vh] overflow-y-auto overflow-x-hidden
        ">
          <div className="flex flex-col">
            {categories.map((category) => (
              <button
                key={category.route}
                onClick={() => { navigate(category.route); setIsOpen(false); }}
                className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all duration-200 border-b border-white/5 last:border-0 group ${currentCategory === category.name ? 'bg-yellow-500 text-black' : 'text-yellow-500 hover:bg-yellow-500 hover:text-black'
                  }`}
              >
                <span className="text-[12px] font-black uppercase tracking-[0.1em]">
                  {category.name}
                </span>
                <ChevronRight size={12} className={currentCategory === category.name ? 'text-black' : 'text-yellow-500'} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
