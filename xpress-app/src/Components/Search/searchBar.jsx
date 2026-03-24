import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';

const SearchBar = ({ className = "", placeholder = "Search auto parts...", placeholders = null, onSearch }) => {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const navigate = useNavigate();

  // Typewriting effect for rotating placeholders
  useEffect(() => {
    if (!placeholders || placeholders.length === 0) {
      setCurrentPlaceholder(placeholder);
      return;
    }

    if (subIndex === placeholders[index].length + 1 && !reverse) {
      const timer = setTimeout(() => setReverse(true), 1200); // Wait at end
      return () => clearTimeout(timer);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % placeholders.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 20 : 35); // Speed of typing/deleting

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, placeholders, placeholder]);

  useEffect(() => {
    if (placeholders && placeholders.length > 0) {
      setCurrentPlaceholder(placeholders[index].substring(0, subIndex));
    }
  }, [subIndex, index, placeholders]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      if (onSearch) onSearch(); // Close the overlay after search
    }
  };

  const handleSearchButtonClick = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      if (onSearch) onSearch(); // Close the overlay after search
    }
  };

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative group ${className}`}>
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 transition-colors ${className.includes('bg-white') && !className.includes('/') ? 'text-black' : className.includes('text-white') ? 'text-white/50' : 'text-gray-400'}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={currentPlaceholder}
          className={`w-full pl-10 pr-24 md:pr-10 py-3 border outline-none transition-all ${className.includes('bg-transparent') || className.includes('bg-white/')
            ? 'bg-transparent border-white/20 text-white focus:border-yellow-500 placeholder-white/30 rounded-lg'
            : 'bg-white border-2 border-black text-black focus:bg-yellow-50 placeholder-gray-400 font-bold italic rounded-none'
            } ${className.includes('text-') ? 'text-inherit' : 'text-sm'}`}
        />
        <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <>
              {/* Mobile Search Button - Visible on small screens */}
              <button
                type="button"
                onClick={handleSearchButtonClick}
                className="md:hidden bg-yellow-500 text-black p-1.5 rounded-md hover:bg-yellow-600 transition-colors"
                aria-label="Search"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              {/* Clear Button */}
              <button
                type="button"
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600 p-1"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
};

export default SearchBar;