import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, History, Package, TrendingUp } from 'lucide-react';
import { getAllProducts } from '../../lib/productService';

const SearchBar = ({ 
  className = "", 
  placeholder = "Search auto parts...", 
  placeholders = null, 
  onSearch,
  isOpen = false 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inventory, setInventory] = useState([]);
  
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load History and Inventory
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('xpress_search_history') || '[]');
    setHistory(savedHistory);

    const fetchInventory = async () => {
      try {
        const data = await getAllProducts({ limit: 100, page: 1 });
        if (data.success) setInventory(data.data);
      } catch (err) { console.error("Search inventory fetch error:", err); }
    };
    fetchInventory();
  }, []);

  // Handle Focus when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Handle Dropdown Click Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Typewriting effect
  useEffect(() => {
    if (!placeholders || placeholders.length === 0) {
      setCurrentPlaceholder(placeholder);
      return;
    }
    if (subIndex === placeholders[index].length + 1 && !reverse) {
      const timer = setTimeout(() => setReverse(true), 1200);
      return () => clearTimeout(timer);
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % placeholders.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 20 : 35);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, placeholders, placeholder]);

  useEffect(() => {
    if (placeholders && placeholders.length > 0) {
      setCurrentPlaceholder(placeholders[index].substring(0, subIndex));
    }
  }, [subIndex, index, placeholders]);

  // Live Suggestions logic
  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = inventory
        .filter(p => {
          const name = (p.itemName || p.name || "").toLowerCase();
          const brand = (p.brand || "").toLowerCase();
          const q = query.toLowerCase();
          return name.includes(q) || brand.includes(q);
        })
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query, inventory]);

  const saveToHistory = (q) => {
    const newHistory = [q, ...history.filter(i => i !== q)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('xpress_search_history', JSON.stringify(newHistory));
  };

  const handleSearch = (q) => {
    if (!q.trim()) return;
    saveToHistory(q.trim());
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    setQuery('');
    setShowDropdown(false);
    if (onSearch) onSearch();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className={`relative group ${className}`}>
      <form onSubmit={handleSubmit} className="relative z-20">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setShowDropdown(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={currentPlaceholder}
          className="w-full pl-10 pr-12 py-3.5 bg-white border-2 border-black text-black outline-none focus:bg-yellow-50 placeholder-gray-400 font-bold italic rounded-none text-sm transition-all"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {query && (
            <button type="button" onClick={() => setQuery('')} className="text-gray-400 hover:text-black">
              <X size={16} />
            </button>
          )}
          <button type="submit" className="text-black hover:text-yellow-600 transition-colors">
            <ArrowRight size={18} />
          </button>
        </div>
      </form>

      {/* DROPDOWN OVERLAY */}
      {showDropdown && (history.length > 0 || suggestions.length > 0) && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 w-full bg-white border-2 border-black border-t-0 shadow-2xl z-10 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          {/* Suggestions (When Typing) */}
          {query.length > 1 && suggestions.length > 0 && (
            <div className="p-1">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    navigate(`/product/${p.id}`, { state: { product: p } });
                    setShowDropdown(false);
                    if (onSearch) onSearch();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-yellow-50 text-left transition-colors group"
                >
                  <Package size={12} className="text-gray-300 group-hover:text-black" />
                  <span className="text-[11px] font-black uppercase truncate group-hover:text-yellow-600 transition-colors">
                    {p.itemName || p.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* History (When focus or typing) */}
          {history.length > 0 && (
            <div className={`p-2 ${query.length > 1 && suggestions.length > 0 ? 'border-t border-gray-100' : ''}`}>
              <p className="text-[9px] font-black uppercase text-gray-400 px-3 py-2 flex items-center gap-2">
                <History size={10} /> Recent Searches
              </p>
              {history.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(item)}
                  className="w-full flex items-center gap-3 p-2.5 px-3 hover:bg-gray-50 text-left transition-colors group"
                >
                  <History size={12} className="text-gray-300 group-hover:text-black transition-colors" />
                  <span className="text-[11px] font-bold text-gray-700">{item}</span>
                  <ArrowRight size={10} className="ml-auto opacity-0 group-hover:opacity-100 transition-all text-yellow-500" />
                </button>
              ))}
              <button 
                onClick={() => {
                  localStorage.removeItem('xpress_search_history');
                  setHistory([]);
                }}
                className="w-full text-center py-2 text-[9px] font-bold text-gray-300 hover:text-red-500 transition-colors"
              >
                Clear History
              </button>
            </div>
          )}

          {/* Empty State */}
          {query.length > 1 && suggestions.length === 0 && (
            <div className="p-8 text-center">
              <Package size={24} className="mx-auto text-gray-200 mb-2" />
              <p className="text-[10px] font-black uppercase text-gray-400 italic">No direct matches. Press Enter to search all results.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;