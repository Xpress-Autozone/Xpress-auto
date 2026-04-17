import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, ExternalLink, ArrowRight } from "lucide-react";

/**
 * WhatsAppButton Component
 * - 1st Click: Expands to show "Chat with us"
 * - 2nd Click: Opens WhatsApp
 * - Appearance: Premium Yellow/Black theme, pulse animation, and glassmorphism highlight.
 */
const WhatsAppButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const timeoutRef = useRef(null);

  const WHATSAPP_NUMBER = "+233271665737"; 
  const DEFAULT_MESSAGE = "Hello Xpress AutoZone, I'm interested in learning more about your verified parts and professional services.";

  // 1. Scroll Awareness Logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsExpanded(false); // Auto-collapse when hiding
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // 2. Click Handling Logic
  const handleClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      
      // Auto-collapse after 5 seconds of inactivity
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
    } else {
      const url = `https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
      window.open(url, "_blank");
      setIsExpanded(false);
    }
  };

  return (
    <div 
      className={`fixed bottom-8 right-8 z-[9999] transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative group">
        <button
          onClick={handleClick}
          className={`flex items-center gap-3 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black shadow-[0_10px_30px_rgba(234,179,8,0.25)] border-2 border-black/5 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(234,179,8,0.4)] active:scale-95 overflow-hidden ${
            isExpanded ? "px-5 py-3 rounded-xl" : "p-3.5 rounded-full"
          }`}
        >
          {/* Main Icon */}
          <div className="relative">
            <MessageCircle 
              size={20} 
              className={`transition-transform duration-500 ${isExpanded ? "rotate-[360deg] scale-110" : "group-hover:rotate-12"}`} 
            />
          </div>

          {/* Expanded Content with Slide/Fade-in */}
          <div 
            className={`flex items-center gap-3 transition-all duration-500 ease-out overflow-hidden ${
              isExpanded ? "w-40 opacity-100" : "w-0 opacity-0"
            }`}
          >
            <div className="h-6 w-[1px] bg-black/20" />
            <div className="flex flex-col items-start leading-none group-hover:translate-x-1 transition-transform">
              <span className="text-[9px] font-black uppercase tracking-tighter opacity-70">Ready to chat?</span>
              <span className="text-[10px] font-black uppercase italic tracking-widest whitespace-nowrap">Open WhatsApp</span>
            </div>
            <ArrowRight size={12} className="ml-auto" />
          </div>
        </button>

        {/* Floating Tooltip (Only on hover, when not expanded) */}
        {!isExpanded && isVisible && (
          <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 pointer-events-none">
            <div className="bg-black text-white py-1.5 px-3 rounded-none text-[8px] font-black uppercase italic tracking-[0.2em] whitespace-nowrap border-b-2 border-yellow-500">
              Support Online
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppButton;
