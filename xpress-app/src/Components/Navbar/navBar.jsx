import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-yellow-400 p-3 shadow-md fixed w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="text-black text-2xl font-bold">
            ✱ XpressAutozone
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-black hover:text-gray-700 font-medium transition-colors">
            Home
          </a>
          <a href="#" className="text-black hover:text-gray-700 font-medium transition-colors">
            Categories
          </a>
          <a href="#" className="text-black hover:text-gray-700 font-medium transition-colors">
            About Us
          </a>
          <a href="#" className="text-black hover:text-gray-700 font-medium transition-colors">
            Contact
          </a>
        </div>

        {/* Search Bar and Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search for auto parts..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>

          {/* Auth Buttons */}
          <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium">
            Login
          </button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium">
            Sign Up
          </button>
        </div>

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
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-yellow-500">
          <div className="flex flex-col space-y-4 pt-4">
            {/* Mobile Navigation Links */}
            <a href="#" className="text-black hover:text-gray-700 font-medium transition-colors">
              Home
            </a>
            <a href="#" className="text-black hover:text-gray-700 font-medium transition-colors">
              Categories
            </a>
            <a href="#" className="text-black hover:text-gray-700 font-medium transition-colors">
              About Us
            </a>
            <a href="#" className="text-black hover:text-gray-700 font-medium transition-colors">
              Contact
            </a>

            {/* Mobile Search Bar */}
            <div className="relative mt-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search for auto parts..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-2 mt-4">
              <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium">
                Login
              </button>
              <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;