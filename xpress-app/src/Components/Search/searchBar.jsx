import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';

const SearchBar = ({ className = "", placeholder = "Search auto parts...", placeholders = null, onSearch }) => {
  const [query, setQuery] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholder);
  const navigate = useNavigate();

  // Rotating placeholder effect
  useEffect(() => {
    if (!placeholders || placeholders.length === 0) {
      return;
    }

    let currentIndex = 0;
    setCurrentPlaceholder(placeholders[0]);

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % placeholders.length;
      setCurrentPlaceholder(placeholders[currentIndex]);
    }, 4000);

    return () => clearInterval(interval);
  }, [placeholders]);

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
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={currentPlaceholder}
          className="w-full pl-10 pr-24 md:pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-200 focus:border-white outline-none bg-white text-black text-sm placeholder:text-sm"
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