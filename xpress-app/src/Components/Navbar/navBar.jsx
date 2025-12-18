import React, { useState } from "react";
import { Menu, X, ShoppingCart, Search, Home as HomeIcon, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import { useSelector } from 'react-redux';
import SearchBar from "../Search/searchBar";

const Navbar = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchPlaceholders = [
    "Spark plugs for Toyota Corolla 2025 Sports Edition",
    "Synthetic oil filter for Honda CR-V 2020-2023",
    "Brake pads and rotors for Mercedes C300 2022",
    "Air filter and cabin filter bundle for all models",
    "LED headlight bulbs for Toyota Hilux 2018-2023",
    "Performance air intake for Ford Ranger Raptor"
  ];

  return (
    <>
      <nav className="bg-yellow-500 border-b border-black/10 fixed w-full z-50 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* LEFT: Logo & Nav Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex-shrink-0">
              <img src="/assets/favicon.png" alt="Xpress Autozone Logo" className="h-10 w-auto p-2" />
            </Link>

            <div className="hidden md:flex items-center space-x-6 text-[11px] font-black uppercase tracking-widest italic">
              <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                <HomeIcon size={16} />
              </Link>
              <Link to="/categories" className="hover:text-white transition-colors">Categories</Link>
              <Link to="/xplore" className="hover:text-white transition-colors">Xplore</Link>
              <Link to="/partner" className="hover:text-white transition-colors">Partner</Link>
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* Search Trigger */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:bg-black/5 rounded-none transition-colors"
            >
              <Search className="h-5 w-5 text-black" />
            </button>

            {/* Auth: Login/Signup Desktop */}
            <div className="hidden md:flex items-center gap-4 text-[11px] font-black uppercase tracking-widest italic">
              {isAuthenticated ? (
                <Link to="/account" className="hover:text-white flex items-center gap-2">
                  <User size={16} />
                  My Account
                </Link>
              ) : (
                <>
                  <Link to="/login" className="hover:text-white">Sign In</Link>
                  <Link to="/signup" className="bg-black text-white px-4 py-2 hover:bg-white hover:text-black transition-all">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Cart Icon */}
            <button
              onClick={() => navigate("/cart")}
              className="text-black hover:text-white transition-colors relative p-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[9px] font-black w-4 h-4 flex items-center justify-center italic">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-black"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-yellow-500 border-t border-black/10 overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-screen pb-8" : "max-h-0"}`}>
          <div className="flex flex-col p-6 space-y-6 text-sm font-black uppercase italic tracking-widest">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
            <Link to="/xplore" onClick={() => setIsMobileMenuOpen(false)}>Xplore</Link>
            <Link to="/partner" onClick={() => setIsMobileMenuOpen(false)}>Partner</Link>
            <div className="h-px bg-black/10 w-full" />
            {isAuthenticated ? (
              <Link to="/account" onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="bg-black text-white p-4 text-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-start pt-32 px-6">
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-8 right-8 text-white hover:text-yellow-500 transition-colors"
          >
            <X size={40} strokeWidth={1} />
          </button>
          
          <div className="w-full max-w-3xl space-y-8">
            <div className="text-center space-y-2">
              <span className="text-yellow-500 font-black uppercase tracking-[0.3em] text-xs">Xpress Search</span>
              <h2 className="text-white text-3xl md:text-5xl font-black uppercase italic tracking-tighter">What are we looking for?</h2>
            </div>
            
            <div className="relative border-b-2 border-yellow-500 pb-4">
               <SearchBar 
                 className="bg-transparent text-white text-2xl md:text-4xl outline-none w-full" 
                 placeholders={searchPlaceholders} 
               />
            </div>
            
            <p className="text-yellow-400 text-center text-sm font-medium">
              With our Xpress Search, ask like a human - we'll find exactly what you need!
            </p>
            
            <p className="text-gray-500 text-center font-medium italic">
              Press <span className="text-white">ESC</span> to close or click the X above.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;