import React, { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import SearchBar from "../Search/searchBar";
import XpressLogo from "../../assets/Xpress-Autozone-Logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchPlaceholders = [
    "Search for auto parts…",
    "Try: 'brake pads for Corolla 2012'",
    "Type: 'Toyota filters under 80 cedis'",
    "Ask like a human… it works."
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-yellow-500 p-3 shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-black hover:text-gray-700 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center md:ml-0 ml-2">
          <div className="flex-shrink-0">
            <img
              src={XpressLogo}
              alt="Xpress Autozone Logo"
              className="h-10 w-auto"
            />
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="/"
            className="text-black hover:text-gray-700 font-medium transition-colors"
          >
            Home
          </a>
          <a
            href="/categories"
            className="text-black hover:text-gray-700 font-medium transition-colors"
          >
            Categories
          </a>
          <a
            href="xplore"
            className="text-black hover:text-gray-700 font-medium transition-colors"
          >
            Xplore
          </a>
          <a
            href="partner"
            className="text-black hover:text-gray-700 font-medium transition-colors"
          >
          Partner With Us
          </a>
        </div>

        {/* Search Bar and Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search Bar */}
          <SearchBar className="w-64" placeholders={searchPlaceholders} />
          {/* Cart Icon */}
          <button
            onClick={() => navigate("/cart")}
            className="text-black hover:text-gray-700 transition-colors relative"
          >
            <ShoppingCart className="h-6 w-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>

        {/* Cart Icon for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => {
              navigate("/cart");
              setIsMobileMenuOpen(false);
            }}
            className="text-black hover:text-gray-700 transition-colors relative"
          >
            <ShoppingCart className="h-6 w-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mt-4 pb-4 border-t border-yellow-500">
          <div className="flex flex-col space-y-4 pt-4">
            {/* Mobile Navigation Links */}
            <a
              href="/"
              className="text-black hover:text-gray-700 font-medium transition-colors transform hover:translate-x-1 duration-300"
            >
              Home
            </a>
            <a
              href="/categories"
              className="text-black hover:text-gray-700 font-medium transition-colors transform hover:translate-x-1 duration-300"
            >
              Categories
            </a>
            <a
              href="/xplore"
              className="text-black hover:text-gray-700 font-medium transition-colors transform hover:translate-x-1 duration-300"
            >
              Xplore
            </a>
            <a
              href="partner"
              className="text-black hover:text-gray-700 font-medium transition-colors transform hover:translate-x-1 duration-300"
            >
             Partner With Us
            </a>

            {/* Mobile Search Bar */}
            <div className="mt-4">
              <SearchBar className="w-full" placeholders={searchPlaceholders} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
